import Database from '@tauri-apps/plugin-sql';

export async function crearTablaUsuarios() {
  const db = await Database.load('sqlite:db_biblioteca.db');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      rol TEXT NOT NULL CHECK(rol IN ('admin', 'operador'))
    );
  `);

  // Crear usuarios por defecto si no existen
  const existentes = await db.select<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM usuarios;'
  );

  if (existentes[0].count === 0) {
    // Por simplicidad inicial, usar contraseñas en texto plano para depurar
    // TODO: Cambiar a bcrypt más adelante
    await db.execute(
      `INSERT INTO usuarios (nombre, password_hash, rol) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
      [
        'admin',
        'admin123',
        'admin',
        'operador_matutino',
        'operador1',
        'operador',
        'operador_vespertino',
        'operador2',
        'operador',
      ]
    );
  }
}
