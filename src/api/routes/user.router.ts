import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { z, ZodTypeAny } from "zod"; 
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { validateRequest } from "@/common/utils/http-handlers";

extendZodWithOpenApi(z);

const UserSchema = z.object({
  id: z.string().optional().openapi({ example: "60c72b2f9b1d4e4b7c8a4e4d" }),
  name: z.string().openapi({ example: "John Doe" }),
  email: z.string().email().openapi({ example: "johndoe@example.com" }),
  age: z.number().optional().openapi({ example: 30 }),
  createdAt: z.string().optional().openapi({ example: "2023-01-01T00:00:00Z" }),
  updatedAt: z.string().optional().openapi({ example: "2023-01-02T00:00:00Z" }),
});

// Utility functions for generating request and response objects
const createRequestBody = (schema: ZodTypeAny) => ({
  required: true,
  content: {
    'application/json': {
      schema: schema.openapi({}),
    },
  },
});

const generateApiResponse = (schema: ZodTypeAny, description: string) => ({
  200: {
    description,
    content: {
      'application/json': {
        schema: schema.openapi({}),
      },
    },
  },
  400: { description: 'Bad request' },
  404: { description: 'Not found' },
});

// Initialize the OpenAPI registry and register routes
export const userRouterRegistry = new OpenAPIRegistry();

userRouterRegistry.registerPath({
  method: 'get',
  path: '/api/users',
  summary: 'List all users',
  description: 'Get a list of users',
  tags: ['Users'],
  responses: createApiResponse(UserSchema.array(), 'List of users'),
});

userRouterRegistry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  summary: 'Get a single user',
  description: 'Get user data by its ID',
  tags: ['Users'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: generateApiResponse(UserSchema, 'User data retrieved successfully'),
});

userRouterRegistry.registerPath({
  method: 'post',
  path: '/api/users',
  summary: 'Create User',
  description: 'Create a new user',
  tags: ['Users'],
  requestBody: createRequestBody(UserSchema),
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: UserSchema.openapi({}),
        },
      },
    },
    400: { description: 'Bad Request - Invalid input' },
  },
});

userRouterRegistry.registerPath({
  method: 'put',
  path: '/api/users/{id}',
  summary: 'Update User',
  description: 'Update an existing user',
  tags: ['Users'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  requestBody: createRequestBody(UserSchema),
  responses: generateApiResponse(UserSchema, 'User updated successfully'),
});

userRouterRegistry.registerPath({
  method: 'delete',
  path: '/api/users/{id}',
  summary: 'Delete User',
  description: 'Delete a user',
  tags: ['Users'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string', example: '60c72b2f9b1d4e4b7c8a4e4d' },
    },
  ],
  responses: {
    204: { description: 'User deleted successfully' },
    404: { description: 'User not found' },
  },
});

const init = async () => {
  return await getDataSource();
};

const userRouter = Router();

init().then((MongoDbDataSource) => {
  const userService = new UserService(MongoDbDataSource.getRepository(User));
  const userController = new UserController(userService);

  userRouter.get("/", (req, res) => userController.getAllUsers(req, res));
  userRouter.get("/:id", (req, res) => userController.getUserById(req, res));
  userRouter.post("/", validateRequest(UserSchema), (req, res, next) => userController.createUser(req, res, next));
  userRouter.put("/:id", validateRequest(UserSchema), (req, res, next) => userController.updateUser(req, res, next));
  userRouter.delete("/:id", (req, res) => userController.deleteUser(req, res));
});

export default userRouter;
