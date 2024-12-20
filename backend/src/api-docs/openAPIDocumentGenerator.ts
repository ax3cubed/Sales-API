import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/routes/api-registry/health-check.router";
import   { userRouterRegistry } from "@/api/routes/user.router";
import { orderRouterRegistry } from "@/api/routes/order.router";
import { productRouterRegistry } from "@/api/routes/product.router";
import salesRouter, { salesRouterRegistry } from "@/api/routes/sales.router";


export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry,userRouterRegistry,orderRouterRegistry, productRouterRegistry, salesRouterRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
