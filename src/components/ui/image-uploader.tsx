'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  category?: string
  accept?: string
  className?: string
  placeholder?: string
  aspectRatio?: string
  maxSizeMB?: number
}

export function ImageUploader({
  value,
  onChange,
  folder = 'leaders',
  category = 'leaders',
  accept = 'image/*',
  className,
  placeholder = 'Upload image',
  aspectRatio = 'aspect-square',
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)

    // Client-side validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB.`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', file.name)
      formData.append('category', category)
      formData.append('folder', folder)

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const media = await res.json()
      onChange(media.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [category, folder, maxSizeMB, onChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const handleRemove = () => {
    onChange('')
    setError(null)
  }

  const isVideo = value?.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg overflow-hidden transition-all cursor-pointer',
          aspectRatio,
          dragOver ? 'border-[#FF9933] bg-[#FF9933]/5' : 'border-gray-200 hover:border-gray-300',
          uploading && 'pointer-events-none opacity-70'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <>
            {isVideo ? (
              <video
                src={value}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            )}
            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
            {uploading ? (
              <>
                <Loader2 className="size-8 animate-spin mb-2 text-[#FF9933]" />
                <p className="text-xs">Uploading...</p>
              </>
            ) : (
              <>
                {accept.includes('video') ? (
                  <Video className="size-8 mb-2 opacity-50" />
                ) : (
                  <ImageIcon className="size-8 mb-2 opacity-50" />
                )}
                <p className="text-xs text-center">{placeholder}</p>
                <p className="text-[10px] mt-1 opacity-60">
                  Drag & drop or click to browse
                </p>
              </>
            )}
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && value && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
