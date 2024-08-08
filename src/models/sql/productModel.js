import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "123456789",
  database: "productsBD",
};

const connection = await mysql.createConnection(config);

export class ProductModel {
  static async getAll({ min, max }) {
    const [products] = await connection.query(
      `SELECT title, precio, note, BIN_TO_UUID(id) 
       FROM product
       WHERE precio >= ? AND precio <= ?`,
      [min || 0, max || 10000]
    );
    return products;
  }

  static async getById({ id }) {
    const [products] = await connection.query(
      `SELECT title, precio, note, BIN_TO_UUID(id) 
       FROM product
       WHERE id = UUID_TO_BIN(?);`,
      [id]
    );
    console.log(products);
    return products;
  }

  static async create({ input }) {}

  static async update({ id, input }) {}

  static async delete({ id }) {
    console.log(id);
    const [product] = await connection.query(
      `DELETE FROM product WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    return product;
  }
}
