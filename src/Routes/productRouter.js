import { Router } from "express";
import { ProductController } from "../controllers/productController.js";

export const productRouter = Router();

productRouter.get("/", ProductController.getAll);
productRouter.get("/:id", ProductController.getById);
productRouter.post("/", ProductController.create);
productRouter.patch("/:id", ProductController.update);
productRouter.delete("/:id", ProductController.delete);
