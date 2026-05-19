import { useEffect, useRef, useState } from 'react'
import { getAccessToken } from '@/infrastructure/api/apiClient'

export type GenerationPhase =
  | 'INGESTION'
  | 'ANALYSIS'
  | 'GENERATION'
  | 'INDEXING'
  | 'ACTIVE'
  | 'FAILED'

export interface TopicProgressState {
  phase: GenerationPhase | null
  tasksCompleted: number
  tasksTotal: number
  done: boolean
  failed: boolean
  failureReason: string | null
}

const INITIAL_STATE: TopicProgressState = {
  phase: null,
  tasksCompleted: 0,
  tasksTotal: 0,
  done: false,
  failed: false,
  failureReason: null,
}

export function useTopicProgress(topicId: string | null, enabled: boolean) {
  const [state, setState] = useState<TopicProgressState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled || !topicId) return

    setState(INITIAL_STATE)

    const controller = new AbortController()
    abortRef.current = controller

    async function connect() {
      const token = getAccessToken()
      const baseUrl = import.meta.env.VITE_API_BASE_URL

      try {
        const response = await fetch(`${baseUrl}/admin/topics/${topicId}/progress`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
        })

        if (!response.ok || !response.body) return

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let pendingEventName = ''

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('event:')) {
              pendingEventName = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
              const raw = line.slice(5).trim()
              if (raw !== '') {
                try {
                  const data = JSON.parse(raw) as Record<string, unknown>
                  applyEvent(pendingEventName, data)
                } catch {
                  // malformed JSON — skip
                }
              }
              pendingEventName = ''
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setState(s => ({ ...s, failed: true, failureReason: 'Connection lost' }))
        }
      }
    }

    function applyEvent(name: string, data: Record<string, unknown>) {
      if (name === 'phase-change') {
        setState(s => ({ ...s, phase: data.phase as GenerationPhase }))
      } else if (name === 'generation-progress') {
        setState(s => ({
          ...s,
          tasksCompleted: data.completed as number,
          tasksTotal: data.total as number,
        }))
      } else if (name === 'complete') {
        setState(s => ({ ...s, done: true, phase: 'ACTIVE' }))
      } else if (name === 'failed') {
        setState(s => ({ ...s, failed: true, failureReason: data.reason as string }))
      }
    }

    void connect()

    return () => {
      controller.abort()
    }
  }, [topicId, enabled])

  return state
}
