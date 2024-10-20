import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { plainToInstance } from "class-transformer";
import { type ValidationError, validate } from "class-validator";
import { logger } from "../config/logger/logger.config";


export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};



export const validateRequest = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  const schemaIntance = plainToInstance(schema, {
    ...req.body,
    ...req.query,
    ...req.params,
  });
  const errors: ValidationError[] = await validate(schemaIntance);
  if (errors.length > 0) {
    const errorMessage = `Invalid input: ${errors.map((e) => Object.values(e.constraints || {}).join(", ")).join(", ")}`;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, StatusCodes.BAD_REQUEST,schema);
    return handleServiceResponse(serviceResponse, res);
  }
  logger.info(`${JSON.stringify(schema)} =>Valiated`)
  next();
};
