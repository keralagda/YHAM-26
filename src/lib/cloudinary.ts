import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
  resource_type: string
}

/**
 * Upload a buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string
    public_id?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: object[]
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'yham',
        public_id: options.public_id,
        resource_type: options.resource_type || 'auto',
        transformation: options.transformation,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result as CloudinaryUploadResult)
      }
    )
    uploadStream.end(buffer)
  })
}
