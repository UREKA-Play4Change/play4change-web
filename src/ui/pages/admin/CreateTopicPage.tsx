import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTopicFromUrl, useCreateTopicFromPdf } from '@/application/hooks/useTopics'
import type { TopicDifficulty } from '@/domain/models/Topic'
import FileUpload from '@/ui/components/FileUpload'
import UrlInput from '@/ui/components/UrlInput'
import DurationSelector from '@/ui/components/DurationSelector'
import DifficultySelector from '@/ui/components/DifficultySelector'
import { validateUrls } from '@/lib/validators'
import { ROUTES } from '@/lib/constants'

type SourceType = 'url' | 'pdf'

interface FormErrors {
  title?: string
  description?: string
  urls?: string
  pdf?: string
  category?: string
}

export default function CreateTopicPage() {
  const navigate = useNavigate()
  const createFromUrl = useCreateTopicFromUrl()
  const createFromPdf = useCreateTopicFromPdf()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sourceType, setSourceType] = useState<SourceType>('url')
  const [urls, setUrls] = useState([''])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [durationDays, setDurationDays] = useState(5)
  const [difficulty, setDifficulty] = useState<TopicDifficulty>('BEGINNER')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const isPending = createFromUrl.isPending || createFromPdf.isPending

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!category.trim()) e.category = 'Category is required'
    if (sourceType === 'url') {
      const validUrls = urls.filter(Boolean)
      const urlErr = validateUrls(validUrls)
      if (urlErr) e.urls = urlErr
    } else if (!pdfFile) {
      e.pdf = 'Please upload a PDF file'
    }
    return e
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})

    if (sourceType === 'url') {
      createFromUrl.mutate(
        {
          title: title.trim(),
          description: description.trim(),
          urls: urls.filter(Boolean),
          durationDays,
          difficulty,
          category: category.trim(),
        },
        {
          onSuccess: topic => {
            void navigate(ROUTES.ADMIN_TOPIC_DETAIL.replace(':id', topic.id))
          },
        },
      )
    } else {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('durationDays', String(durationDays))
      formData.append('difficulty', difficulty)
      formData.append('category', category.trim())
      if (pdfFile) formData.append('file', pdfFile)

      createFromPdf.mutate(formData, {
        onSuccess: topic => {
          void navigate(ROUTES.ADMIN_TOPIC_DETAIL.replace(':id', topic.id))
        },
      })
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Create New Topic</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a PDF or provide URLs — our AI will generate the learning content.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
            Topic title{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              setErrors(p => ({ ...p, title: undefined }))
            }}
            placeholder="e.g. Introduction to Sustainable Development Goals"
            aria-invalid={Boolean(errors.title)}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => {
              setDescription(e.target.value)
              setErrors(p => ({ ...p, description: undefined }))
            }}
            placeholder="Briefly describe what learners will gain from this topic…"
            rows={3}
            aria-invalid={Boolean(errors.description)}
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={e => {
              setCategory(e.target.value)
              setErrors(p => ({ ...p, category: undefined }))
            }}
            placeholder="e.g. Sustainability, Digital Literacy, Climate…"
            aria-invalid={Boolean(errors.category)}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        {/* Source type toggle */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">
            Content source{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </p>
          <div
            className="mb-4 inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1"
            role="group"
            aria-label="Select content source"
          >
            <button
              type="button"
              onClick={() => {
                setSourceType('url')
              }}
              aria-pressed={sourceType === 'url'}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${sourceType === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              URL(s)
            </button>
            <button
              type="button"
              onClick={() => {
                setSourceType('pdf')
              }}
              aria-pressed={sourceType === 'pdf'}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${sourceType === 'pdf' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              PDF Upload
            </button>
          </div>

          {sourceType === 'url' ? (
            <UrlInput
              urls={urls}
              onChange={next => {
                setUrls(next)
                setErrors(p => ({ ...p, urls: undefined }))
              }}
              error={errors.urls}
            />
          ) : (
            <FileUpload
              value={pdfFile}
              onChange={f => {
                setPdfFile(f)
                setErrors(p => ({ ...p, pdf: undefined }))
              }}
              error={errors.pdf}
            />
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Duration (days)</label>
          <DurationSelector value={durationDays} onChange={setDurationDays} />
        </div>

        {/* Difficulty */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Difficulty</label>
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
                Creating…
              </>
            ) : (
              'Create Topic'
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              void navigate(-1)
            }}
            disabled={isPending}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {(createFromUrl.isError || createFromPdf.isError) && (
          <p className="text-sm text-red-600" role="alert">
            Failed to create topic. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
