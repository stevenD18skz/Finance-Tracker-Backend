import express from "express";
import { productRouter } from "./Routes/products.js";
import { corsMiddlewares } from "./middlewares/cors.js";

const app = express();
const port = 3000;
app.disable("x-powered-by");

app.use(corsMiddlewares());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json()); //parser del body de json a objeto js

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/wishlist", productRouter);

app.listen(port, () =>
  console.log(`Example app listening on port https://${port}!`)
);
