import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/dtos/service-response.dto";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
   
    const schemaIntance = plainToInstance(schema, {
      ...req.body,
      ...req.query,
      ...req.params
    })
    const errors: ValidationError[] = await validate(schemaIntance);
    if(errors.length > 0){
      const errorMessage = `Invalid input: ${errors.map((e) => Object.values(e.constraints || {}).join(", ")).join(", ")}`; 
      const serviceResponse = ServiceResponse.failure(errorMessage, null, StatusCodes.BAD_REQUEST);
      return handleServiceResponse(serviceResponse, res);
    }
    
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
};