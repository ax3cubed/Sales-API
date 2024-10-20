import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

import { ServiceResponseSchema } from "@/common/dtos/service-response.dto";

export function createApiResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseSchema(schema),
        },
      },
    },
  };
}

export function createApiRequest(schema: z.ZodTypeAny, description: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: ServiceResponseSchema(schema),
      },
    },
  };
}