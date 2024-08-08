import express from "express";
import { corsMiddlewares } from "./middlewares/cors.js";
import { productRouter } from "./Routes/productRouter.js";

const app = express();
const port = 3000;
app.disable("x-powered-by");

//MIDDLEWARES DE LA API
app.use(corsMiddlewares());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json()); //parser del body de json a objeto js

//RUTA PRINCIAPL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//CONSUMIR EL ROUTER PARA "WISHLIST"
app.use("/wishlist", productRouter);

//COMENZAR LA API
app.listen(port, () =>
  console.log(`Example app listening on port https://${port}!`)
);
