import { Injectable, NotFoundException } from '@nestjs/common'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { PrismaService } from '../database/prisma.service'
import sharp = require('sharp')

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  private r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  async uploadProductImages(files: Express.Multer.File[], sku: string) {
    if (!files?.length) throw new NotFoundException('No files provided.')

    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: { images: true },
    })
    if (!product) throw new NotFoundException(`No product found with SKU "${sku}".`)

    const sizes = [
      { suffix: 'hero', width: 1200 },
      { suffix: 'medium', width: 800 },
      { suffix: 'thumb', width: 400 },
    ]

    let sortOrder = product.images.length
    const created = []

    for (const file of files) {
      const urls: Record<string, string> = {}
      for (const { suffix, width } of sizes) {
        const webp = await sharp(file.buffer).resize(width).webp({ quality: 90 }).toBuffer()
        const key = `products/${product.slug}/${Date.now()}-${suffix}-${sortOrder}.webp`
        await this.r2.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: webp,
          ContentType: 'image/webp',
        }))
        urls[suffix] = `${process.env.R2_PUBLIC_CDN_URL}/${key}`
      }

      const image = await this.prisma.productImage.create({
        data: {
          productId: product.id,
          url: urls.hero,
          sortOrder,
        },
      })
      created.push({ ...image, ...urls })
      sortOrder++
    }

    return { product: { id: product.id, name: product.name, sku: product.sku }, images: created }
  }

  async uploadHomepageMedia(file: Express.Multer.File) {
    if (!file) throw new NotFoundException('No file provided.')

    const isVideo = file.mimetype.startsWith('video/')
    const key = `homepage/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`

    await this.r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }))

    return { url: `${process.env.R2_PUBLIC_CDN_URL}/${key}`, mediaType: isVideo ? 'video' : 'image' }
  }

  async getProductImages(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!product) throw new NotFoundException(`No product found with SKU "${sku}".`)

    return { product: { id: product.id, name: product.name, sku: product.sku }, images: product.images }
  }

  async deleteProductImage(sku: string, imageId: string) {
    const product = await this.prisma.product.findUnique({ where: { sku } })
    if (!product) throw new NotFoundException(`No product found with SKU "${sku}".`)

    const image = await this.prisma.productImage.findFirst({ where: { id: imageId, productId: product.id } })
    if (!image) throw new NotFoundException('Image not found for this product.')

    const prefix = process.env.R2_PUBLIC_CDN_URL + '/'
    if (image.url.startsWith(prefix)) {
      const heroKey = image.url.slice(prefix.length)
      const keys = [heroKey, heroKey.replace('-hero-', '-medium-'), heroKey.replace('-hero-', '-thumb-')]
      await Promise.all(keys.map((key) =>
        this.r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key })),
      ))
    }

    await this.prisma.productImage.delete({ where: { id: imageId } })
    return { id: imageId }
  }
}
