import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class ProductDto {
    @IsNotEmpty({ message: "Product ID is required" })
    @IsString({ message: "Product ID must be a string" })
    product_id!: string;
  
    @IsNotEmpty({ message: "Quantity is required" })
    @IsPositive({ message: "Quantity must be a positive number" })
    quantity?: number;
  
    @IsNotEmpty({ message: "Total price is required" })
    @IsPositive({ message: "Total price must be a positive number" })
    totalPrice?: number;
  }
  