import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ProductDto } from "./product.dto";

export class OrderDto {
    @IsNotEmpty({ message: "User ID is required" })
    @IsString({ message: "User ID must be a string" })
    user_id!: string;
  
    @IsArray({ message: "Products must be an array" })
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products!: ProductDto[];
  }