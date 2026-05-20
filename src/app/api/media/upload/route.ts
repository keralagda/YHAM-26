import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { verifySession } from '@/lib/auth'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
]
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
]
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, 'application/pdf']

// Max file size: 10MB for images, 100MB for videos
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

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed.` },
        { status: 400 }
      )
    }

    // Validate file size
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? '100MB' : '10MB'}.` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder: `yham/${folder}`,
      resource_type: isVideo ? 'video' : 'image',
    })

    // Save to database
    const media = await db.media.create({
      data: {
        filename: file.name.slice(0, 255),
        url: result.secure_url,
        mimeType: file.type,
        size: file.size,
        alt: alt.slice(0, 500),
        category: category.slice(0, 50),
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
