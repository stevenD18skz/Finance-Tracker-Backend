import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura la conexión a la base de datos SQLite
const dbPath = path.resolve(__dirname, "productsDB.sqlite");

const connection = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

export default connection;
