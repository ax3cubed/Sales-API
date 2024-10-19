import { Router } from "express";
import { UserService } from "../services/user.service";
import { MongoDbDataSource } from "@/common/datasources";
import { User } from "../models/user.model";
import { UserController } from "../controller/user.controller";


const userRouter = Router();
const userService = new UserService(MongoDbDataSource.getRepository(User));
const userController = new UserController(userService);

userRouter.get("/", (req, res) => userController.getAllUsers(req,res));
userRouter.get("/:id", (req, res) => userController.getUserById(req, res));
userRouter.post("/", (req, res) => userController.createUser(req, res));
userRouter.put("/", (req, res) => userController.updateUser(req, res));
userRouter.delete("/:id", (req, res) => userController.deleteUser(req, res));

export default userRouter;