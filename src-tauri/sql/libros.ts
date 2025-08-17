import sql from '@tauri-apps/plugin-sql';

export async function crearTablaLibros() {
  const db = await sql.load('sqlite:db_biblioteca.db');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT,
      genero TEXT,
      ubicacion TEXT,
      estado TEXT DEFAULT 'disponible'
    );
  `);

  const existentes = await db.select<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM libros;'
  );

  if (existentes[0].count === 0) {
    await db.execute(
      `INSERT INTO libros (titulo, autor, genero, ubicacion) VALUES (?, ?, ?, ?)`,
      [
        'Cien años de soledad',
        'Gabriel García Márquez',
        'Realismo mágico',
        'Estante 1-A',
      ]
    );
  }

  const libros = await db.select<{
    id: number;
    titulo: string;
    autor: string;
    genero: string;
    ubicacion: string;
    estado: string;
  }>('SELECT * FROM libros');

  console.log('Libros encontrados:', libros);
}
