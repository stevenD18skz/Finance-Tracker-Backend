import { createApp } from "./src/app.js";
import { ProductModel } from "./src/models/sqLite/productModel.js";

createApp({ productModel: ProductModel });
