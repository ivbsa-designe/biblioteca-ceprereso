import sql from '@tauri-apps/plugin-sql';

/**
 * Genera un ID único para un libro basado en Estante + Nivel + Posición
 * Formato: {Estante}{Nivel}{Posición} (ej: C434)
 */
export async function generarIdLibro(estante: string, nivel: number, posicion?: number): Promise<string> {
  const db = await sql.load('sqlite:db_biblioteca.db');
  
  // Si no se especifica posición, buscar la primera posición disponible
  if (posicion === undefined) {
    // Buscar todas las posiciones ocupadas para este estante y nivel
    const ocupadas = await db.select<{ posicion: number }[]>(
      'SELECT posicion FROM libros WHERE estante = ? AND nivel = ? AND estado != ? ORDER BY posicion',
      [estante.toUpperCase(), nivel, 'dado_de_baja']
    );
    
    // Encontrar el primer hueco disponible
    let posicionDisponible = 1;
    const posicionesOcupadas = ocupadas.map(row => row.posicion).sort((a, b) => a - b);
    
    for (const pos of posicionesOcupadas) {
      if (pos === posicionDisponible) {
        posicionDisponible++;
      } else {
        break;
      }
    }
    
    posicion = posicionDisponible;
  }
  
  // Verificar que la posición no esté ocupada
  const yaExiste = await db.select<{ id: string }[]>(
    'SELECT id FROM libros WHERE estante = ? AND nivel = ? AND posicion = ? AND estado != ?',
    [estante.toUpperCase(), nivel, posicion, 'dado_de_baja']
  );
  
  if (yaExiste.length > 0) {
    throw new Error(`La posición ${estante.toUpperCase()}${nivel}${posicion.toString().padStart(2, '0')} ya está ocupada`);
  }
  
  // Generar el ID con formato: Estante + Nivel + Posición (con padding)
  const id = `${estante.toUpperCase()}${nivel}${posicion.toString().padStart(2, '0')}`;
  return id;
}

/**
 * Lista todos los espacios vacantes disponibles para un estante y nivel específico
 */
export async function listarEspaciosVacantes(estante?: string, nivel?: number): Promise<Array<{
  estante: string;
  nivel: number;
  posicion: number;
  id: string;
}>> {
  const db = await sql.load('sqlite:db_biblioteca.db');
  
  let query = `
    SELECT DISTINCT estante, nivel, posicion, id
    FROM libros 
    WHERE estado = 'dado_de_baja'
  `;
  const params: any[] = [];
  
  if (estante) {
    query += ' AND estante = ?';
    params.push(estante.toUpperCase());
  }
  
  if (nivel !== undefined) {
    query += ' AND nivel = ?';
    params.push(nivel);
  }
  
  query += ' ORDER BY estante, nivel, posicion';
  
  const espaciosVacantes = await db.select<{
    estante: string;
    nivel: number;
    posicion: number;
    id: string;
  }[]>(query, params);
  
  return espaciosVacantes;
}

/**
 * Registra un nuevo libro con ID generado automáticamente
 */
export async function registrarLibro(datos: {
  titulo: string;
  autor: string;
  genero: string;
  estante: string;
  nivel: number;
  posicion?: number;
}): Promise<string> {
  const db = await sql.load('sqlite:db_biblioteca.db');
  
  // Generar ID único
  const id = await generarIdLibro(datos.estante, datos.nivel, datos.posicion);
  const ubicacion = `Estante ${datos.estante.toUpperCase()}-${datos.nivel}-${datos.posicion?.toString().padStart(2, '0') || '01'}`;
  
  // Insertar el libro
  await db.execute(
    `INSERT INTO libros (id, titulo, autor, genero, estante, nivel, posicion, ubicacion, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'disponible')`,
    [
      id,
      datos.titulo,
      datos.autor || '',
      datos.genero || '',
      datos.estante.toUpperCase(),
      datos.nivel,
      parseInt(id.slice(-2)), // Extraer posición del ID
      ubicacion
    ]
  );
  
  return id;
}

/**
 * Da de baja un libro, liberando su espacio
 */
export async function darDeBajaLibro(id: string): Promise<void> {
  const db = await sql.load('sqlite:db_biblioteca.db');
  
  // Verificar que el libro existe
  const libro = await db.select<{ id: string; estado: string }[]>(
    'SELECT id, estado FROM libros WHERE id = ?',
    [id]
  );
  
  if (libro.length === 0) {
    throw new Error(`No se encontró el libro con ID: ${id}`);
  }
  
  if (libro[0].estado === 'dado_de_baja') {
    throw new Error(`El libro con ID: ${id} ya está dado de baja`);
  }
  
  // Cambiar estado a dado de baja
  await db.execute(
    'UPDATE libros SET estado = ? WHERE id = ?',
    ['dado_de_baja', id]
  );
}

/**
 * Reactiva un libro que estaba dado de baja
 */
export async function reactivarLibro(id: string): Promise<void> {
  const db = await sql.load('sqlite:db_biblioteca.db');
  
  // Verificar que el libro existe y está dado de baja
  const libro = await db.select<{ id: string; estado: string }[]>(
    'SELECT id, estado FROM libros WHERE id = ?',
    [id]
  );
  
  if (libro.length === 0) {
    throw new Error(`No se encontró el libro con ID: ${id}`);
  }
  
  if (libro[0].estado !== 'dado_de_baja') {
    throw new Error(`El libro con ID: ${id} no está dado de baja`);
  }
  
  // Cambiar estado a disponible
  await db.execute(
    'UPDATE libros SET estado = ? WHERE id = ?',
    ['disponible', id]
  );
}

export async function crearTablaLibros() {
  const db = await sql.load('sqlite:db_biblioteca.db');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS libros (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      autor TEXT,
      genero TEXT,
      estante TEXT NOT NULL,
      nivel INTEGER NOT NULL,
      posicion INTEGER NOT NULL,
      ubicacion TEXT,
      estado TEXT DEFAULT 'disponible',
      fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const existentes = await db.select<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM libros;'
  );

  if (existentes[0].count === 0) {
  // Generar un ID de ejemplo: C101 (Estante C, Nivel 1, Posición 01)
  const ejemploId = 'C101';
  await db.execute(
    `INSERT INTO libros (id, titulo, autor, genero, estante, nivel, posicion, ubicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ejemploId, 'Cien años de soledad', 'Gabriel García Márquez', 'Realismo mágico', 'C', 1, 1, 'Estante C-1-01']
  );
}

  const libros = await db.select<{
    id: string;
    titulo: string;
    autor: string;
    genero: string;
    estante: string;
    nivel: number;
    posicion: number;
    ubicacion: string;
    estado: string;
    fecha_ingreso: string;
  }>('SELECT * FROM libros');

  console.log('Libros encontrados:', libros);
}
