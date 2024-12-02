import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ApiLogger } from "./api-logger";

export const ServiceResponseSchema = (schema: z.ZodType) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: schema.optional(),
    statusCode: z.number(),
  });

export class ServiceResponse<T = null> {
  @IsBoolean()
  readonly success: boolean;

  @IsString()
  readonly message: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly responseObject: T;

  @IsNumber()
  readonly statusCode: number;

 

  private constructor(
    success: boolean,
    message: string,
    responseObject: T,
    statusCode: number
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
     
  }

  static success<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.OK,
    entity:any
  ) {
    const logger = new ApiLogger(entity)
    logger.logInfo(`Success: ${message} \n${JSON.stringify(responseObject)}`);
    return new ServiceResponse(true, message, responseObject, statusCode);
  }

  static failure<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.BAD_REQUEST,
    entity:any
  ) {
    const logger = new ApiLogger(entity)
    logger.logError(`Failure: ${message}`);
    return new ServiceResponse(false, message, responseObject, statusCode);
  }
}
