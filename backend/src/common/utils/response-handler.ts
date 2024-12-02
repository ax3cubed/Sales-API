import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../dtos/service-response.dto';
import { handleServiceResponse } from './http-handlers';


export class ResponseHandler<T> {
    private entity: T;

    constructor(entity: T) {
        this.entity = entity;
    }

    handleSuccess(message: string, responseObject: any, response: Response) {
        const serviceResponse = ServiceResponse.success(message, responseObject, StatusCodes.OK, this.entity);
        return handleServiceResponse(serviceResponse, response);
    }

    handleError(response: Response, error: any) {
        const errorMessage = error?.message;
        const serviceResponse = ServiceResponse.failure(errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR, this.entity);
        return handleServiceResponse(serviceResponse, response);
    }
}