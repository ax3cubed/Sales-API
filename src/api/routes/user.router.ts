import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { z } from "zod"; 
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry ,extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
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

const init = async () => {
    return await getDataSource();
};
  
const userRouter = Router();
 

export const userRouterRegistry = new OpenAPIRegistry();
userRouterRegistry.registerPath({
    method: 'get',
    path: '/api/users',
    description: 'Get a list of users',
    summary: 'List all users',
    tags: ["Users"],
    responses: createApiResponse(UserSchema.array(), 'List of users'), 
  });
  
  userRouterRegistry.registerPath({
    method: 'get',
    path: '/api/users/{id}',
    description: 'Get user data by its ID',
    summary: 'Get a single user',
    tags: ["Users"],
   parameters:[
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        example: "60c72b2f9b1d4e4b7c8a4e4d",
      },
    },
   ],
    responses: {
      200: {
        description: 'Object with user data.',
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
      },
      204: {
        description: 'No content - successful operation',
      },
    },
  });
  
  userRouterRegistry.registerPath({
    method: 'post',
    path: '/api/users',
    description: 'Create a new user',
    summary: 'Create User',
    tags: ["Users"],
    request: {
      body:  {
          content:{
              "application/json": { schema: UserSchema },
          }
      }
    },
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
      },
      400: {
        description: 'Bad Request - Invalid input',
      },
    },
  });
  
  userRouterRegistry.registerPath({
    method: 'put',
    path: '/api/users/{id}',
    description: 'Update an existing user',
    summary: 'Update User',
    tags: ["Users"],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '60c72b2f9b1d4e4b7c8a4e4d' }),
      }),
      body: {
          content:{
              "application/json": { schema: UserSchema },
          }
      }
    },
    responses: {
      200: {
        description: 'User updated successfully',
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
      },
      404: {
        description: 'User not found',
      },
    },
  });
  
  userRouterRegistry.registerPath({
    method: 'delete',
    path: '/api/users/{id}',
    description: 'Delete a user',
    summary: 'Delete User',
    tags: ["Users"],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '60c72b2f9b1d4e4b7c8a4e4d' }),
      }),
    },
    responses: {
      204: {
        description: 'User deleted successfully',
      },
      404: {
        description: 'User not found',
      },
    },
  });

init().then((MongoDbDataSource) => {
  const userService = new UserService(MongoDbDataSource.getRepository(User));
  const userController = new UserController(userService);
  
   
  userRouter.get("/", (req, res) => userController.getAllUsers(req, res));
  userRouter.get("/:id", (req, res) => userController.getUserById(req, res));
  userRouter.post("/", validateRequest(User),(req, res, next) => userController.createUser(req, res, next));
  userRouter.put("/:id", validateRequest(User),(req, res, next) => userController.updateUser(req, res, next));
  userRouter.delete("/:id", (req, res) => userController.deleteUser(req, res));
});
  export default userRouter;
