import connection from "../../config/database.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export class ProductModel {
  static async getAll({ min, max }) {
    const max_price = await connection.all(
      `SELECT max(amount) as mx
       FROM product`
    );

    const products = await connection.all(
      `SELECT 
          p.id, 
          p.title, 
          p.amount, 
          GROUP_CONCAT(t.name, ', ') AS tags,
          p.note
       FROM 
          product p
       LEFT JOIN 
          product_tag pt ON p.id = pt.product_id
       LEFT JOIN 
          tag t ON pt.tag_id = t.id
       WHERE 
          p.amount >= ? AND p.amount <= ?
       GROUP BY 
          p.id`,
      [min || 0, max || max_price[0].mx]
    );

    // Convertir la columna 'tags' en una lista
    const productsWithTagsArray = products.map((product) => ({
      ...product,
      tags: product.tags ? product.tags.split(", ") : [],
    }));

    return productsWithTagsArray;
  }

  static async getById({ id }) {
    const product = await connection.get(
      `SELECT id, title, amount, note
       FROM product
       WHERE id = ?;`,
      [id]
    );
    return product;
  }

  static async create({ input }) {
    const { title, amount, note, tags } = input;

    // Generar UUID
    const myUuid = uuidv4();
    const idcryptp = crypto.randomUUID();

    try {
      // Iniciar transacción
      await connection.run("BEGIN TRANSACTION");

      // Insertar producto
      await connection.run(
        `INSERT INTO product (id, title, amount, note) VALUES (?, ?, ?, ?)`,
        [myUuid, title, amount, note]
      );

      // Insertar tags asociados al producto
      if (tags.length > 0) {
        const tagValues = tags
          .map((tag) => `(?, (SELECT id FROM tag WHERE name = ?))`)
          .join(", ");
        const tagParams = tags.reduce(
          (params, tag) => params.concat([myUuid, tag]),
          []
        );

        await connection.run(
          `INSERT INTO product_tag (product_id, tag_id) VALUES ${tagValues}`,
          tagParams
        );
      }

      // Confirmar transacción
      await connection.run("COMMIT");

      return 2000;
    } catch (error) {
      // Revertir transacción en caso de error
      await connection.run("ROLLBACK");
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }
  }

  static async update({ id, input }) {
    const { title, amount, note } = input;
    const result = await connection.run(
      `UPDATE product SET title = ?, amount = ?, note = ? WHERE id = ?`,
      [title, amount, note, id]
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
