import express from "express";
import { corsMiddlewares } from "./middlewares/cors.js";
import { createMovieRouter } from "./Routes/productRouter.js";
import { json } from "express";

// después
export const createApp = ({ productModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddlewares());
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  //RUTA PRINCIAPL
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/wishlist", createMovieRouter({ productModel: productModel }));

  const PORT = process.env.PORT ?? 3000;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
