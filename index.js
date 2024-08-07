import express from "express";
import { readJSON } from "./utils.js";

const app = express();
const port = 3000;

const wishlist = readJSON("./list.json");

app.get("/", (req, res) => {
  console.log("ola");
  res.send("Hello World! dfdffd dfdfdfa");
});

app.get("/wishlist", (req, res) => {
  console.log(wishlist);
  res.json(wishlist);
});

app.listen(port, () =>
  console.log(`Example app listening on port https://${port}!`)
);
