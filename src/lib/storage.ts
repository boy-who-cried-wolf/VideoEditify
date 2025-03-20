import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export async function uploadFile(file: File, key: string) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    },
  })

  try {
    await upload.done()
    return { key, size: file.size, mimeType: file.type }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

export async function getSignedDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL expires in 1 hour
    return url
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate download URL')
  }
}

export async function getSignedUploadUrl(key: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL expires in 1 hour
    return url
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate upload URL')
  }
} 