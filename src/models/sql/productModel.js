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
      `SELECT title, precio, note, BIN_TO_UUID(id) AS id
       FROM product
       WHERE precio >= ? AND precio <= ?`,
      [min || 0, max || 10000]
    );
    return products;
  }

  static async getById({ id }) {
    const [product] = await connection.query(
      `SELECT title, precio, note, BIN_TO_UUID(id) AS id
       FROM product
       WHERE id = UUID_TO_BIN(?);`,
      [id]
    );
    return product;
  }

  static async create({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      );
    } catch (e) {
      // puede enviarle información sensible
      throw new Error("Error creating movie");
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    );

    return movies[0];
  }

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
