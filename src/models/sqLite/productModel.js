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

      const productAdd = await connection.get(
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
          p.id = ?
        GROUP BY 
          p.id`,
        [myUuid]
      );

      const productsWithTagsArray = {
        ...productAdd,
        tags: productAdd.tags ? productAdd.tags.split(", ") : [],
      };

      return productsWithTagsArray;
    } catch (error) {
      // Revertir transacción en caso de error
      //await connection.run("ROLLBACK");
      console.error("Error creating product:", error);
      throw new Error(error);
    }
  }
  static async update({ id, input }) {
    const { title, amount, note, tags } = input;

    // Verificar si los campos obligatorios están presentes
    if (!title || !amount) {
      throw new Error("Title and amount are required fields");
    }

    try {
      // Iniciar transacción
      await connection.run("BEGIN TRANSACTION");

      // Actualizar el producto
      const result = await connection.run(
        `UPDATE product 
         SET title = ?, amount = ?, note = ? 
         WHERE id = ?`,
        [title, amount, note, id]
      );

      // Si el producto no se actualizó, lanzar un error
      if (result.changes === 0) {
        throw new Error("Product not found or no changes made");
      }

      // Borrar las asociaciones actuales de tags para este producto
      await connection.run(`DELETE FROM product_tag WHERE product_id = ?`, [
        id,
      ]);

      // Insertar los nuevos tags asociados al producto
      if (tags && tags.length > 0) {
        const tagValues = tags
          .map((tag) => `(?, (SELECT id FROM tag WHERE name = ?))`)
          .join(", ");
        const tagParams = tags.reduce(
          (params, tag) => params.concat([id, tag]),
          []
        );

        await connection.run(
          `INSERT INTO product_tag (product_id, tag_id) VALUES ${tagValues}`,
          tagParams
        );
      }

      // Confirmar transacción
      await connection.run("COMMIT");

      return result.changes;
    } catch (error) {
      // Revertir transacción en caso de error
      await connection.run("ROLLBACK");
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }
  }

  static async delete({ id }) {
    const result = await connection.run(`DELETE FROM product WHERE id = ?`, [
      id,
    ]);
    return result;
  }
}
