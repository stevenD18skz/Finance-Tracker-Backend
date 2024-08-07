import express, { request } from "express";
import { readJSON } from "./utils/read.js";
import { valideProduct, validePartialProduct } from "./schemas/product.js";

const app = express();
const port = 3000;

const wishlist = readJSON("./list.json");

app.disable("x-powered-by");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pasa el control al siguiente middleware
});

app.use(express.json()); //parser del body de json a objeto js

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/wishlist", (req, res) => {
  const min = req.query.min;
  const max = req.query.max;

  const filteredWishlist = wishlist.filter((item) => {
    return (!min || item.precio >= min) && (!max || item.precio <= max);
  });

  res.json(filteredWishlist);
});

app.get("/wishlist/:producto", (req, res) => {
  const producto = req.params.producto;
  return res.json(wishlist.find((current) => current.title === producto));
});

app.post("/wishlist", function (req, res) {
  const result = valideProduct(req.body);

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error),
    });
  }

  const newProduct = {
    ...result.data,
  };

  wishlist.push(newProduct);
  return res.json({ message: "el obejeto ah sido agregado", data: newProduct });
});

app.patch("/wishlist/:id", (req, res) => {
  const result = validePartialProduct(req.body);
  if (!result.success) {
    return res.status(404).json({ message: "no se encontro la pelicula" });
  }

  const productTile = req.params.id;
  const productIndex = wishlist.findIndex((c) => c.title === productTile);
  if (productIndex === -1) {
    return res.status(404).json({ message: "no se encontro la pelicula" });
  }

  const updateProduct = {
    ...wishlist[productIndex],
    ...result.data,
  };

  wishlist[productIndex] = updateProduct;

  return res.json({
    message: "el obejeto ah sido modificado",
    data: updateProduct,
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port https://${port}!`)
);
