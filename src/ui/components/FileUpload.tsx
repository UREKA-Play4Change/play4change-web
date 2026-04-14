import { DragEvent, useRef, useState } from 'react'
import { validatePdfFile } from '@/lib/validators'
import { MAX_PDF_SIZE_MB } from '@/lib/constants'

interface FileUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  error?: string
}

export default function FileUpload({ value, onChange, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState('')

  function handleFile(file: File | undefined) {
    if (!file) return
    const validationError = validatePdfFile(file)
    if (validationError) {
      setFileError(validationError)
      return
    }
    setFileError('')
    onChange(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const displayError = fileError || error

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload PDF file, max ${MAX_PDF_SIZE_MB}MB`}
        onClick={() => {
          inputRef.current?.click()
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => {
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : displayError
              ? 'border-red-300 bg-red-50'
              : value
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
        }`}
      >
        {value ? (
          <>
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-700">{value.name}</p>
              <p className="text-xs text-gray-400">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onChange(null)
                setFileError('')
              }}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop your PDF here, or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-xs text-gray-400">PDF only · max {MAX_PDF_SIZE_MB}MB</p>
            </div>
          </>
        )}
      </div>

      {displayError && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {displayError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={e => {
          handleFile(e.target.files?.[0])
        }}
        aria-hidden="true"
      />
    </div>
  )
}
