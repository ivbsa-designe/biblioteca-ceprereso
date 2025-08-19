/**
 * Test script for Book ID Generation System
 * This tests the core logic without requiring Tauri
 */

// Mock Database class for testing
class MockDatabase {
  constructor() {
    this.libros = [
      { id: 'A101', estante: 'A', nivel: 1, posicion: 1, estado: 'disponible' },
      { id: 'A102', estante: 'A', nivel: 1, posicion: 2, estado: 'disponible' },
      { id: 'A103', estante: 'A', nivel: 1, posicion: 3, estado: 'dado_de_baja' },
      { id: 'B201', estante: 'B', nivel: 2, posicion: 1, estado: 'disponible' },
      { id: 'C301', estante: 'C', nivel: 3, posicion: 1, estado: 'dado_de_baja' },
    ];
  }

  async select(query, params = []) {
    console.log(`🔍 Query: ${query}`);
    console.log(`📋 Params:`, params);
    
    if (query.includes('COUNT(*)')) {
      return [{ count: this.libros.length }];
    }
    
    if (query.includes('SELECT posicion FROM libros WHERE estante')) {
      const [estante, nivel, estado] = params;
      const ocupadas = this.libros
        .filter(libro => libro.estante === estante && libro.nivel === nivel && libro.estado !== estado)
        .map(libro => ({ posicion: libro.posicion }));
      return ocupadas;
    }
    
    if (query.includes('SELECT id FROM libros WHERE estante')) {
      const [estante, nivel, posicion, estado] = params;
      const existe = this.libros
        .filter(libro => 
          libro.estante === estante && 
          libro.nivel === nivel && 
          libro.posicion === posicion && 
          libro.estado !== estado
        );
      return existe;
    }
    
    if (query.includes('SELECT DISTINCT estante, nivel, posicion, id')) {
      let filtered = this.libros.filter(libro => libro.estado === 'dado_de_baja');
      if (params[0]) { // estante filter
        filtered = filtered.filter(libro => libro.estante === params[0]);
      }
      if (params[1] !== undefined) { // nivel filter
        filtered = filtered.filter(libro => libro.nivel === params[1]);
      }
      return filtered;
    }

    if (query.includes('SELECT id, titulo, autor FROM libros WHERE id')) {
      const libro = this.libros.find(l => l.id === params[0]);
      return libro ? [{ id: libro.id, titulo: 'Test Book', autor: 'Test Author' }] : [];
    }
    
    return this.libros;
  }

  async execute(query, params = []) {
    console.log(`✏️ Execute: ${query}`);
    console.log(`📋 Params:`, params);
    
    if (query.includes('INSERT INTO libros')) {
      const [id, titulo, autor, genero, estante, nivel, posicion, ubicacion] = params;
      this.libros.push({
        id, 
        titulo, 
        autor, 
        genero, 
        estante, 
        nivel, 
        posicion, 
        ubicacion,
        estado: 'disponible'
      });
      console.log(`✅ Libro insertado: ${id}`);
    } else if (query.includes('UPDATE libros SET estado')) {
      const [estado, id] = params;
      const libro = this.libros.find(l => l.id === id);
      if (libro) {
        libro.estado = estado;
        console.log(`📝 Estado actualizado para ${id}: ${estado}`);
      }
    }
    return { changes: 1 };
  }

  static async load(dbPath) {
    console.log(`📂 Loading database: ${dbPath}`);
    return new MockDatabase();
  }
}

// Book ID generation functions (adapted from the main code)
async function generarIdLibro(estante, nivel, posicion) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  // Si no se especifica posición, buscar la primera posición disponible
  if (posicion === undefined) {
    // Buscar todas las posiciones ocupadas para este estante y nivel
    const ocupadas = await db.select(
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
  const yaExiste = await db.select(
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

async function listarEspaciosVacantes(estante, nivel) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  let query = `
    SELECT DISTINCT estante, nivel, posicion, id
    FROM libros 
    WHERE estado = 'dado_de_baja'
  `;
  const params = [];
  
  if (estante) {
    query += ' AND estante = ?';
    params.push(estante.toUpperCase());
  }
  
  if (nivel !== undefined) {
    query += ' AND nivel = ?';
    params.push(nivel);
  }
  
  query += ' ORDER BY estante, nivel, posicion';
  
  const espaciosVacantes = await db.select(query, params);
  return espaciosVacantes;
}

async function registrarLibro(datos) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  // Generar ID único
  const id = await generarIdLibro(datos.estante, datos.nivel, datos.posicion);
  const posicionFinal = parseInt(id.slice(-2));
  const ubicacion = `Estante ${datos.estante.toUpperCase()}-${datos.nivel}-${posicionFinal.toString().padStart(2, '0')}`;
  
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
      posicionFinal,
      ubicacion
    ]
  );
  
  return id;
}

async function darDeBajaLibro(id) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  // Verificar que el libro existe
  const libro = await db.select(
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

// Test cases
async function runTests() {
  console.log('🧪 Iniciando pruebas del sistema de IDs de libros\n');
  
  try {
    // Test 1: Generar ID automático para nueva posición
    console.log('📋 Test 1: Generar ID automático');
    const id1 = await generarIdLibro('A', 1); // Debería ser A104 (siguiente disponible)
    console.log(`✅ ID generado: ${id1}\n`);
    
    // Test 2: Generar ID con posición específica
    console.log('📋 Test 2: Generar ID con posición específica');
    const id2 = await generarIdLibro('D', 2, 5); // Debería ser D205
    console.log(`✅ ID generado: ${id2}\n`);
    
    // Test 3: Registrar libro completo
    console.log('📋 Test 3: Registrar libro completo');
    const idLibro = await registrarLibro({
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      genero: 'Clásico',
      estante: 'E',
      nivel: 1
    });
    console.log(`✅ Libro registrado con ID: ${idLibro}\n`);
    
    // Test 4: Listar espacios vacantes
    console.log('📋 Test 4: Listar espacios vacantes');
    const espacios = await listarEspaciosVacantes();
    console.log(`✅ Espacios vacantes encontrados:`, espacios, '\n');
    
    // Test 5: Dar de baja libro
    console.log('📋 Test 5: Dar de baja libro');
    await darDeBajaLibro('A102');
    console.log(`✅ Libro A102 dado de baja\n`);
    
    // Test 6: Listar espacios vacantes después de dar de baja
    console.log('📋 Test 6: Espacios vacantes después de dar de baja');
    const espaciosDespues = await listarEspaciosVacantes();
    console.log(`✅ Espacios vacantes:`, espaciosDespues, '\n');
    
    // Test 7: Probar ocupar espacio vacante
    console.log('📋 Test 7: Ocupar espacio vacante (A103)');
    const idVacante = await generarIdLibro('A', 1, 3); // Debería reutilizar A103
    console.log(`✅ ID generado para espacio vacante: ${idVacante}\n`);
    
    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
runTests();