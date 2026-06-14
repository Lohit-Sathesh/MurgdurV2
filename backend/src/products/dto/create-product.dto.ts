import { IsString, IsNumber, IsOptional, IsUUID, IsBoolean, Min, IsArray, ValidateNested, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateVariantDto {
  @IsString() sku!: string
  @IsOptional() @IsString() color?: string
  @IsOptional() @IsString() colorHex?: string
  @IsOptional() @IsString() size?: string
  @IsInt() @Min(0) stock!: number
}

export class CreateProductDto {
  @IsString() name!: string
  @IsString() slug!: string
  @IsString() sku!: string
  @IsString() description!: string
  @IsNumber() @Min(0) price!: number
  @IsUUID() categoryId!: string
  @IsOptional() @IsString() material?: string
  @IsOptional() @IsBoolean() isFeatured?: boolean
  @IsOptional() @IsNumber() comparePrice?: number
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateVariantDto) variants?: CreateVariantDto[]
}
