import Database from '@tauri-apps/plugin-sql';

export async function crearTablaSanciones() {
  const db = await Database.load('sqlite:db_biblioteca.db');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sanciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_ppl TEXT NOT NULL,
      fecha_inicio TEXT,
      fecha_fin TEXT,
      motivo TEXT,
      FOREIGN KEY(id_ppl) REFERENCES ppl(id)
    );
  `);
}
