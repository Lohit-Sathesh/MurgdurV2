import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { RedisService } from '../database/redis.service'
import { SearchService } from '../search/search.service'
import { ProductQueryDto } from './dto/product-query.dto'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private search: SearchService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(query)}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const where: any = { isActive: true }
    let categoryInfo: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null } | null = null

    if (query.category) {
      const cat = await this.prisma.category.findUnique({
        where: { slug: query.category },
        include: { children: true },
      })
      if (cat) {
        categoryInfo = { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, imageUrl: cat.imageUrl }
        if (cat.slug === 'new-arrivals') {
          const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          where.OR = [
            { createdAt: { gte: twoDaysAgo } },
            { categoryId: cat.id },
          ]
        } else {
          const categoryIds = [cat.id, ...cat.children.map((c) => c.id)]
          where.categoryId = { in: categoryIds }
        }
      }
    }
    if (query.featured) where.isFeatured = true
    if (query.newArrivals) {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      const newArrivalsCategory = await this.prisma.category.findUnique({ where: { slug: 'new-arrivals' } })
      where.OR = [
        { createdAt: { gte: twoDaysAgo } },
        ...(newArrivalsCategory ? [{ categoryId: newArrivalsCategory.id }] : []),
      ]
    }
    if (query.color || query.size) {
      where.variants = {
        some: {
          ...(query.color ? { color: { equals: query.color, mode: 'insensitive' } } : {}),
          ...(query.size ? { size: { equals: query.size, mode: 'insensitive' } } : {}),
        },
      }
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      }
    }

    const orderBy: any = query.sort === 'price_asc'  ? { price: 'asc' }
                       : query.sort === 'price_desc' ? { price: 'desc' }
                       : { createdAt: 'desc' }

    const products = await this.prisma.product.findMany({
      where, orderBy,
      take: query.limit ?? 20,
      skip: query.offset ?? 0,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: true,
        category: true,
      }
    })

    const result = { products, total: products.length, category: categoryInfo }
    await this.redis.set(cacheKey, JSON.stringify(result), 60)
    return result
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:${slug}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true, category: true }
    })

    if (product) await this.redis.set(cacheKey, JSON.stringify(product), 120)
    return product
  }

  async getCategories() {
    const cached = await this.redis.get('categories:tree')
    if (cached) return JSON.parse(cached)

    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: { include: { children: true } } },
      orderBy: { sortOrder: 'asc' }
    })

    await this.redis.set('categories:tree', JSON.stringify(categories), 300)
    return categories
  }

  async create(dto: CreateProductDto) {
    const { variants, ...productData } = dto

    const existingSku = await this.prisma.product.findUnique({ where: { sku: dto.sku } })
    if (existingSku) throw new ConflictException(`SKU "${dto.sku}" is already in use.`)

    const existingSlug = await this.prisma.product.findUnique({ where: { slug: dto.slug } })
    if (existingSlug) throw new ConflictException(`Slug "${dto.slug}" is already in use.`)

    if (variants?.length) {
      const variantSkus = variants.map(v => v.sku)
      if (new Set(variantSkus).size !== variantSkus.length) {
        throw new ConflictException('Variant SKUs must be unique.')
      }
      const existingVariants = await this.prisma.productVariant.findMany({
        where: { sku: { in: variantSkus } },
      })
      if (existingVariants.length) {
        throw new ConflictException(`Variant SKU "${existingVariants[0].sku}" is already in use.`)
      }
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        ...(variants?.length ? { variants: { create: variants } } : {}),
      } as any,
      include: { images: true, variants: true, category: true },
    })
    await this.search.syncProduct(product)
    return product
  }
}