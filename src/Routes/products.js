import { Router } from "express";
import { ProductController } from "../controllers/products.js";

export const productRouter = Router();

productRouter.get("/", ProductController.getAll);
productRouter.get("/:producto", ProductController.getById);
productRouter.post("/", ProductController.create);
productRouter.patch("/:id", ProductController.update);
