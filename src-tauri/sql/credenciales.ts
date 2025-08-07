import Database from "@tauri-apps/plugin-sql";

export async function crearTablaCredenciales() {
  const db = await Database.load("sqlite:db_biblioteca.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS credenciales (
      id TEXT PRIMARY KEY,
      id_ppl TEXT NOT NULL,
      foto TEXT,
      fecha_emision TEXT,
      FOREIGN KEY(id_ppl) REFERENCES ppl(id)
    );
  `);
}
