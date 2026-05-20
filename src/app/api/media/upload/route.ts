import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
]
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
]
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, 'application/pdf']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || ''
    const category = (formData.get('category') as string) || 'general'
    const folder = (formData.get('folder') as string) || 'yham'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type "${file.type}" not allowed.` }, { status: 400 })
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${isVideo ? '100MB' : '10MB'}.` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let uploadUrl = ''

    // Try Cloudinary first
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (cloudName && apiKey && apiSecret) {
      try {
        const { uploadToCloudinary } = await import('@/lib/cloudinary')
        const result = await uploadToCloudinary(buffer, {
          folder: `yham/${folder}`,
          resource_type: isVideo ? 'video' : 'image',
        })
        uploadUrl = result.secure_url
      } catch (cloudErr) {
        console.error('Cloudinary upload failed, falling back to local:', cloudErr)
      }
    }

    // Fallback to local storage if Cloudinary fails or not configured
    if (!uploadUrl) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const ext = path.extname(file.name).toLowerCase() || '.jpg'
      const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)
      uploadUrl = `/uploads/${filename}`
    }

    // Save to database
    const media = await db.media.create({
      data: {
        filename: file.name.slice(0, 255),
        url: uploadUrl,
        mimeType: file.type,
        size: file.size,
        alt: alt.slice(0, 500),
        category: category.slice(0, 50),
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Failed to upload file'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
