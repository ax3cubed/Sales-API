import { Router } from "express";
import { SalesService } from "../services/sales.service";
import { MongoDbDataSource } from "@/common/datasources";
import { Sales } from "../models/sales.model";
import { SalesController } from "../controller/sales.controller";


const salesRouter = Router();
const salesService = new SalesService(MongoDbDataSource.getRepository(Sales));
const salesController = new SalesController(salesService);

salesRouter.get("/", (req, res) => salesController.getAllSales(req,res));
salesRouter.get("/:id", (req, res) => salesController.getSalesById(req, res));
salesRouter.post("/", (req, res) => salesController.createSales(req, res));
salesRouter.put("/", (req, res) => salesController.updateSales(req, res));
salesRouter.delete("/:id", (req, res) => salesController.deleteSales(req, res));

export default salesRouter;