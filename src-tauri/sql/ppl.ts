import Database from "@tauri-apps/plugin-sql";

export async function crearTablaPPL() {
  const db = await Database.load("sqlite:db_biblioteca.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ppl (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      dormitorio TEXT NOT NULL,
      seccion TEXT NOT NULL,
      estancia TEXT NOT NULL,
      consecutivo INTEGER NOT NULL,
      activo BOOLEAN DEFAULT 1
    );
  `);
}
