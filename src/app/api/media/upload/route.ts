import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || ''
    const category = (formData.get('category') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const ext = path.extname(file.name) || '.jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`

    const media = await db.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type || 'image/jpeg',
        size: file.size,
        alt,
        category,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
