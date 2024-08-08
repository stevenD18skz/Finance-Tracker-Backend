import { ProductModel } from "../models/sql/productModel.js";
import { valideProduct, validePartialProduct } from "../schemas/product.js";

export class ProductController {
  static async getAll(req, res) {
    const min = req.query.min;
    const max = req.query.max;
    const productos = await ProductModel.getAll({ min: min, max: max });
    res.json(productos);
  }

  static async getById(req, res) {
    const id = req.params.id;
    const product = await ProductModel.getById({
      id: id,
    });
    return res.json(product);
  }

  static async create(req, res) {
    const result = valideProduct(req.body);

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error),
      });
    }

    const newProduct = await ProductModel.create({ input: result });
    return res.json({
      message: "el obejeto ah sido agregado",
      data: newProduct,
    });
  }

  static async update(req, res) {
    const result = validePartialProduct(req.body);

    if (!result.success) {
      return res.status(404).json({ message: "no se encontro la pelicula" });
    }

    const updateProduct = await ProductModel.patch({
      input: result,
      id: req.params.id,
    });

    return res.json({
      message: "el obejeto ah sido modificado",
      data: updateProduct,
    });
  }

  static async delete(req, res) {
    const id = req.params.id;
    const product = await ProductModel.delete({
      id: id,
    });
    return res.json(product);
  }
}
