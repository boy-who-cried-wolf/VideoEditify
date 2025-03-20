import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  orderId: string
  type: 'source' | 'delivery'
  onUploadComplete?: (fileId: string) => void
  onError?: (error: string) => void
  className?: string
}

export default function FileUpload({
  orderId,
  type,
  onUploadComplete,
  onError,
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get signed URL for upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          orderId,
          type,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const { uploadUrl, fileId } = await response.json()

      // Upload file to R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      onUploadComplete?.(fileId)
    } catch (error) {
      console.error('Upload error:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [orderId, type, onUploadComplete, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
      } ${className}`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        {isUploading ? (
          <>
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                'Drop the file here'
              ) : (
                'Drag and drop a file here, or click to select a file'
              )}
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: MP4, MOV, AVI (max 2GB)
            </p>
          </>
        )}
      </div>
    </div>
  )
} 