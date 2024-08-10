import e from "cors";
import { valideProduct, validePartialProduct } from "../schemas/product.js";

export class ProductController {
  constructor({ productModel }) {
    this.productModel = productModel;
  }

  getAll = async (req, res) => {
    const min = req.query.min;
    const max = req.query.max;
    const productos = await this.productModel.getAll({ min: min, max: max });
    res.json(productos);
  };

  getById = async (req, res) => {
    try {
      const id = req.params.id;

      const product = await this.productModel.getById({ id });

      if (!product) {
        return res.status(400).send({ error: "Product not found" });
      }

      return res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).send({ error: "product not found" });
    }
  };

  create = async (req, res) => {
    try {
      const result = valideProduct(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "the request is bad, plese chek it",
          error: JSON.parse(result.error),
        });
      }

      const newProduct = await this.productModel.create({ input: result.data });

      return res.json({
        message: "El objeto ha sido agregado",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al crear el producto",
        error: error.message,
      });
    }
  };

  update = async (req, res) => {
    const result = validePartialProduct(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({
          message:
            "no se encontro la pelicula <= solo quiero ver cuando se manda",
          error: result.error,
        });
    }

    const updateProduct = await this.productModel.update({
      id: req.params.id,
      input: result.data,
    });

    return res.json({
      message: "el obejeto ah sido modificado",
      data: updateProduct,
    });
  };

  delete = async (req, res) => {
    const id = req.params.id;

    const product = await this.productModel.delete({
      id: id,
    });

    return res.json(product);
  };
}
