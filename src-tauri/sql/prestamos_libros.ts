import Database from '@tauri-apps/plugin-sql';

export async function crearTablaPrestamosLibros() {
  const db = await Database.load('sqlite:db_biblioteca.db');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS prestamos_libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_prestamo INTEGER NOT NULL,
      id_libro INTEGER NOT NULL,
      FOREIGN KEY(id_prestamo) REFERENCES prestamos(id),
      FOREIGN KEY(id_libro) REFERENCES libros(id)
    );
  `);
}
