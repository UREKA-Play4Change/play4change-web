import { isValidUrl } from '@/lib/validators'
import { MAX_URLS } from '@/lib/constants'

interface UrlInputProps {
  urls: string[]
  onChange: (urls: string[]) => void
  error?: string
}

export default function UrlInput({ urls, onChange, error }: UrlInputProps) {
  const list = urls.length === 0 ? [''] : urls

  function updateUrl(index: number, value: string) {
    const next = [...list]
    next[index] = value
    onChange(next.filter((u, i) => u || i === next.length - 1))
  }

  function addUrl() {
    if (list.length >= MAX_URLS) return
    onChange([...list, ''])
  }

  function removeUrl(index: number) {
    const next = list.filter((_, i) => i !== index)
    onChange(next.length === 0 ? [''] : next)
  }

  return (
    <div className="space-y-2">
      {list.map((url, i) => (
        <div key={i} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={e => {
                updateUrl(i, e.target.value)
              }}
              placeholder="https://example.com/article"
              aria-label={`URL ${i + 1}`}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
                url && !isValidUrl(url)
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white focus:border-blue-400'
              }`}
            />
            {url && isValidUrl(url) && (
              <svg
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {list.length > 1 && (
            <button
              type="button"
              onClick={() => {
                removeUrl(i)
              }}
              aria-label={`Remove URL ${i + 1}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}

      {list.length < MAX_URLS && (
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add another URL ({list.length}/{MAX_URLS})
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
