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
    const id = req.params.id;
    const product = await this.productModel.getById({
      id: id,
    });
    return res.json(product);
  };

  create = async (req, res) => {
    const result = valideProduct(req.body);

    if (result.error) {
      return res.status(400).json({
        error: JSON.parse(result.error),
      });
    }

    const newProduct = await this.productModel.create({ input: result });
    return res.json({
      message: "el obejeto ah sido agregado",
      data: newProduct,
    });
  };

  update = async (req, res) => {
    const result = validePartialProduct(req.body);

    if (!result.success) {
      return res.status(404).json({ message: "no se encontro la pelicula" });
    }

    const updateProduct = await this.productModel.patch({
      input: result,
      id: req.params.id,
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
