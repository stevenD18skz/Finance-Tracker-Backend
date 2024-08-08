import { readJSON } from "../../utils/read.js";

const wishlist = readJSON("./list.json");

export class ProductModel {
  static async getAll({ min, max }) {
    const filteredWishlist = wishlist.filter((item) => {
      return (!min || item.precio >= min) && (!max || item.precio <= max);
    });
    return filteredWishlist;
  }

  static async getById({ productTitle }) {
    console.log(productTitle);
    const producto = wishlist.find((current) => current.title === productTitle);

    return producto;
  }

  static async create({ input }) {
    const newProduct = {
      ...input.data,
    };

    wishlist.push(newProduct);

    return newProduct;
  }

  static async patch({ input, id }) {
    const productTile = id;
    const productIndex = wishlist.findIndex((c) => c.title === productTile);

    if (productIndex === -1) {
      return false;
    }

    const updateProduct = {
      ...wishlist[productIndex],
      ...input.data,
    };

    wishlist[productIndex] = updateProduct;

    return updateProduct;
  }
}
