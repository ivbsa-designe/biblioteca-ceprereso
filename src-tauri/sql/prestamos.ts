import Database from "@tauri-apps/plugin-sql";

export async function crearTablaPrestamos() {
  const db = await Database.load("sqlite:db_biblioteca.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS prestamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_ppl TEXT NOT NULL,
      fecha_prestamo TEXT,
      fecha_devolucion TEXT,
      estado TEXT DEFAULT 'activo',
      observaciones TEXT,
      folio TEXT,
      FOREIGN KEY(id_ppl) REFERENCES ppl(id)
    );
  `);
}
