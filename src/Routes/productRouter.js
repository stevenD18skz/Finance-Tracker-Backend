import { Router } from "express";
import { ProductController } from "../controllers/productController.js";

export const createMovieRouter = ({ productModel }) => {
  const productRouter = Router();

  const productController = new ProductController({
    productModel,
  });

  productRouter.get("/", productController.getAll);
  productRouter.get("/:id", productController.getById);
  productRouter.post("/", productController.create);
  productRouter.patch("/:id", productController.update);
  productRouter.delete("/:id", productController.delete);

  return productRouter;
};
