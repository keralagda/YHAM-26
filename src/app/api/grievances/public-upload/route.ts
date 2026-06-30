import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type "${file.type}" not allowed. Only images are permitted.` }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: `File too large. Max 5MB.` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'grievances')
    await mkdir(uploadDir, { recursive: true })
    const ext = path.extname(file.name).toLowerCase() || '.jpg'
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    const uploadUrl = `/uploads/grievances/${filename}`

    return NextResponse.json({ url: uploadUrl }, { status: 201 })
  } catch (error) {
    console.error('Public upload error:', error)
    const message = error instanceof Error ? error.message : 'Failed to upload file'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
