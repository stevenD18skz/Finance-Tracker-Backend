import connection from "../../config/database.js";

export class ProductModel {
  static async getAll({ min, max }) {
    const products = await connection.all(
      `SELECT id, title, precio, note
       FROM product
       WHERE precio >= ? AND precio <= ?`,
      [min || 0, max || 10000]
    );
    return products;
  }

  static async getById({ id }) {
    const product = await connection.get(
      `SELECT id, title, precio, note
       FROM product
       WHERE id = ?;`,
      [id]
    );
    return product;
  }

  static async create({ input }) {
    const { title, precio, note } = input;
    const result = await connection.run(
      `INSERT INTO product (title, precio, note) VALUES (?, ?, ?)`,
      [title, precio, note]
    );
    return result.lastID;
  }

  static async update({ id, input }) {
    const { title, precio, note } = input;
    const result = await connection.run(
      `UPDATE product SET title = ?, precio = ?, note = ? WHERE id = ?`,
      [title, precio, note, id]
    );
    return result.changes;
  }

  static async delete({ id }) {
    const result = await connection.run(`DELETE FROM product WHERE id = ?`, [
      id,
    ]);
    return result.changes;
  }
}
