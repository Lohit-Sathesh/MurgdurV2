import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
export class CreateProductDto{@IsString() slug!:string; @IsString() name!:string; @IsString() category!:string; @IsString() description!:string; @IsInt() @Min(0) price!:number; @IsOptional() @IsArray() media?:string[];}
