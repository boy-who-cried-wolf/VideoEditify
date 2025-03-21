'use client'

import { useState } from 'react'
import { getSignedDownloadUrl } from '@/lib/storage'

interface File {
  id: string
  filename: string
  key: string
  size: number
  mimeType: string
  uploadedAt: Date
}

interface FileListProps {
  files: File[]
  title?: string
  emptyMessage?: string
  className?: string
}

export default function FileList({
  files,
  title = 'Files',
  emptyMessage = 'No files uploaded yet',
  className = '',
}: FileListProps) {
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (file: File) => {
    try {
      if (downloadUrls[file.id]) {
        window.open(downloadUrls[file.id], '_blank')
        return
      }

      const url = await getSignedDownloadUrl(file.key)
      setDownloadUrls(prev => ({ ...prev, [file.id]: url }))
      window.open(url, '_blank')
    } catch (err) {
      setError('Failed to generate download link')
      setTimeout(() => setError(null), 3000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
            >
              <div className="flex items-center flex-1 w-0">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-4 flex-1 w-0">
                  <div className="truncate font-medium">{file.filename}</div>
                  <div className="text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => handleDownload(file)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 