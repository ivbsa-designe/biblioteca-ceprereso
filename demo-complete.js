/**
 * DEMOSTRACIÓN COMPLETA DEL SISTEMA DE IDs AUTOMÁTICOS PARA LIBROS
 * 
 * Este script demuestra todas las características implementadas:
 * ✅ Generación automática de IDs en formato Estante+Nivel+Posición
 * ✅ Detección y reutilización de espacios vacantes
 * ✅ Gestión de estados (disponible/dado_de_baja)
 * ✅ Generación de códigos de barras para etiquetas
 * ✅ Listado de espacios vacantes
 */

// Mock Database (simulación para demo) - Singleton
class MockDatabase {
  constructor() {
    if (MockDatabase.instance) {
      return MockDatabase.instance;
    }
    
    this.libros = [
      { id: 'A101', titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', estante: 'A', nivel: 1, posicion: 1, estado: 'disponible' },
      { id: 'A102', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', estante: 'A', nivel: 1, posicion: 2, estado: 'disponible' },
      { id: 'A104', titulo: 'Don Quijote', autor: 'Miguel de Cervantes', estante: 'A', nivel: 1, posicion: 4, estado: 'disponible' },
      { id: 'B201', titulo: 'La Odisea', autor: 'Homero', estante: 'B', nivel: 2, posicion: 1, estado: 'dado_de_baja' },
      { id: 'C301', titulo: 'Romeo y Julieta', autor: 'William Shakespeare', estante: 'C', nivel: 3, posicion: 1, estado: 'dado_de_baja' },
    ];
    
    MockDatabase.instance = this;
    console.log('📚 Base de datos inicializada con libros de ejemplo\n');
  }

  async select(query, params = []) {
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
      if (params[0]) filtered = filtered.filter(libro => libro.estante === params[0]);
      if (params[1] !== undefined) filtered = filtered.filter(libro => libro.nivel === params[1]);
      return filtered;
    }

    if (query.includes('SELECT id, titulo, autor FROM libros WHERE id')) {
      const libro = this.libros.find(l => l.id === params[0]);
      return libro ? [{ id: libro.id, titulo: libro.titulo, autor: libro.autor }] : [];
    }
    
    return this.libros;
  }

  async execute(query, params = []) {
    if (query.includes('INSERT INTO libros')) {
      const [id, titulo, autor, genero, estante, nivel, posicion, ubicacion] = params;
      this.libros.push({
        id, titulo, autor, genero, estante, nivel, posicion, ubicacion, estado: 'disponible'
      });
    } else if (query.includes('UPDATE libros SET estado')) {
      const [estado, id] = params;
      const libro = this.libros.find(l => l.id === id);
      if (libro) libro.estado = estado;
    }
    return { changes: 1 };
  }

  static async load(dbPath) {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }
}

// Funciones del sistema de IDs (versión demo)
async function generarIdLibro(estante, nivel, posicion) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  if (posicion === undefined) {
    const ocupadas = await db.select(
      'SELECT posicion FROM libros WHERE estante = ? AND nivel = ? AND estado != ? ORDER BY posicion',
      [estante.toUpperCase(), nivel, 'dado_de_baja']
    );
    
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
  
  const yaExiste = await db.select(
    'SELECT id FROM libros WHERE estante = ? AND nivel = ? AND posicion = ? AND estado != ?',
    [estante.toUpperCase(), nivel, posicion, 'dado_de_baja']
  );
  
  if (yaExiste.length > 0) {
    throw new Error(`La posición ${estante.toUpperCase()}${nivel}${posicion.toString().padStart(2, '0')} ya está ocupada`);
  }
  
  const id = `${estante.toUpperCase()}${nivel}${posicion.toString().padStart(2, '0')}`;
  return id;
}

async function listarEspaciosVacantes(estante, nivel) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  
  let query = `SELECT DISTINCT estante, nivel, posicion, id FROM libros WHERE estado = 'dado_de_baja'`;
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
  
  return await db.select(query, params);
}

async function registrarLibro(datos) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  const id = await generarIdLibro(datos.estante, datos.nivel, datos.posicion);
  const posicionFinal = parseInt(id.slice(-2));
  const ubicacion = `Estante ${datos.estante.toUpperCase()}-${datos.nivel}-${posicionFinal.toString().padStart(2, '0')}`;
  
  await db.execute(
    `INSERT INTO libros (id, titulo, autor, genero, estante, nivel, posicion, ubicacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'disponible')`,
    [id, datos.titulo, datos.autor || '', datos.genero || '', datos.estante.toUpperCase(), datos.nivel, posicionFinal, ubicacion]
  );
  
  return id;
}

async function darDeBajaLibro(id) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  const libro = await db.select('SELECT id, estado FROM libros WHERE id = ?', [id]);
  
  if (libro.length === 0) {
    throw new Error(`No se encontró el libro con ID: ${id}`);
  }
  
  if (libro[0].estado === 'dado_de_baja') {
    throw new Error(`El libro con ID: ${id} ya está dado de baja`);
  }
  
  await db.execute('UPDATE libros SET estado = ? WHERE id = ?', ['dado_de_baja', id]);
}

function generarCodigoBarras(idLibro) {
  const barras = idLibro
    .split('')
    .map(char => {
      const codigo = char.charCodeAt(0);
      return '|'.repeat(codigo % 5 + 1) + ' '.repeat(2);
    })
    .join('');
  
  return `|||| ${barras} ||||`;
}

async function exportarCodigoBarrasLibro(idLibro) {
  const db = await MockDatabase.load('sqlite:db_biblioteca.db');
  const libro = await db.select('SELECT id, titulo, autor FROM libros WHERE id = ?', [idLibro]);
  
  if (libro.length === 0) {
    throw new Error(`No se encontró el libro con ID: ${idLibro}`);
  }
  
  const codigoBarras = generarCodigoBarras(idLibro);
  
  return `
ID: ${idLibro}
Título: ${libro[0].titulo}
Autor: ${libro[0].autor}

${codigoBarras}
  `.trim();
}

// DEMOSTRACIÓN COMPLETA
async function demoCompleto() {
  console.log('🎯 DEMOSTRACIÓN COMPLETA - SISTEMA DE IDs AUTOMÁTICOS PARA LIBROS');
  console.log('═'.repeat(70));
  console.log('');
  
  try {
    // 1. Estado inicial
    console.log('📊 1. ESTADO INICIAL DEL SISTEMA');
    console.log('─'.repeat(40));
    const db = await MockDatabase.load('sqlite:db_biblioteca.db');
    const librosIniciales = await db.select('SELECT * FROM libros');
    console.log('Libros registrados:');
    librosIniciales.forEach(libro => {
      const estado = libro.estado === 'disponible' ? '✅' : '❌';
      console.log(`  ${estado} ${libro.id} - ${libro.titulo} (${libro.autor})`);
    });
    
    // 2. Mostrar espacios vacantes iniciales
    console.log('\n🔍 2. ESPACIOS VACANTES DETECTADOS');
    console.log('─'.repeat(40));
    const espaciosIniciales = await listarEspaciosVacantes();
    if (espaciosIniciales.length > 0) {
      espaciosIniciales.forEach(espacio => {
        console.log(`  📦 ${espacio.id} - Estante ${espacio.estante}, Nivel ${espacio.nivel}, Posición ${espacio.posicion}`);
      });
    } else {
      console.log('  ℹ️  No hay espacios vacantes disponibles');
    }
    
    // 3. Registrar nuevo libro - ID automático
    console.log('\n📚 3. REGISTRO DE LIBRO CON ID AUTOMÁTICO');
    console.log('─'.repeat(40));
    console.log('Registrando: "1984" por George Orwell en Estante A, Nivel 1...');
    const id1 = await registrarLibro({
      titulo: '1984',
      autor: 'George Orwell',
      genero: 'Distopía',
      estante: 'A',
      nivel: 1
      // No especificamos posición - debe ser automática
    });
    console.log(`✅ Libro registrado con ID: ${id1} (posición detectada automáticamente)`);
    
    // 4. Registrar libro en espacio vacante
    console.log('\n♻️  4. REUTILIZACIÓN DE ESPACIO VACANTE');
    console.log('─'.repeat(40));
    console.log('Registrando libro en espacio vacante B201...');
    const id2 = await registrarLibro({
      titulo: 'Moby Dick',
      autor: 'Herman Melville',
      genero: 'Aventura',
      estante: 'B',
      nivel: 2,
      posicion: 1 // Reutilizar el espacio B201 que estaba dado de baja
    });
    console.log(`✅ Libro registrado con ID: ${id2} (reutilizó espacio vacante)`);
    
    // 5. Dar de baja un libro
    console.log('\n❌ 5. PROCESO DE BAJA DE LIBRO');
    console.log('─'.repeat(40));
    console.log('Dando de baja el libro A102...');
    await darDeBajaLibro('A102');
    console.log('✅ Libro A102 dado de baja - espacio ahora disponible');
    
    // 6. Mostrar espacios vacantes actualizados
    console.log('\n🔄 6. ESPACIOS VACANTES ACTUALIZADOS');
    console.log('─'.repeat(40));
    const espaciosActualizados = await listarEspaciosVacantes();
    espaciosActualizados.forEach(espacio => {
      console.log(`  📦 ${espacio.id} - Estante ${espacio.estante}, Nivel ${espacio.nivel}, Posición ${espacio.posicion}`);
    });
    
    // 7. Generar códigos de barras
    console.log('\n📊 7. GENERACIÓN DE CÓDIGOS DE BARRAS');
    console.log('─'.repeat(40));
    const librosActivos = [id1, id2, 'A101'];
    for (const idLibro of librosActivos) {
      console.log(`\nCódigo de barras para ${idLibro}:`);
      const etiqueta = await exportarCodigoBarrasLibro(idLibro);
      console.log('┌' + '─'.repeat(40) + '┐');
      etiqueta.split('\n').forEach(linea => {
        console.log('│ ' + linea.padEnd(38) + ' │');
      });
      console.log('└' + '─'.repeat(40) + '┘');
    }
    
    // 8. Resumen final
    console.log('\n📋 8. RESUMEN FINAL');
    console.log('─'.repeat(40));
    const librosFinales = await db.select('SELECT * FROM libros');
    const disponibles = librosFinales.filter(l => l.estado === 'disponible').length;
    const dadosDeBaja = librosFinales.filter(l => l.estado === 'dado_de_baja').length;
    
    console.log(`📚 Total de libros: ${librosFinales.length}`);
    console.log(`✅ Libros disponibles: ${disponibles}`);
    console.log(`❌ Libros dados de baja: ${dadosDeBaja}`);
    console.log(`📦 Espacios vacantes: ${espaciosActualizados.length}`);
    
    console.log('\n🎉 DEMOSTRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('═'.repeat(70));
    
    console.log('\n✨ CARACTERÍSTICAS IMPLEMENTADAS:');
    console.log('  ✅ Generación automática de IDs (formato: EstanteNivelPosición)');
    console.log('  ✅ Detección inteligente de espacios vacantes');
    console.log('  ✅ Reutilización automática de posiciones liberadas');
    console.log('  ✅ Gestión de estados de libros (disponible/dado_de_baja)');
    console.log('  ✅ Generación de códigos de barras para etiquetas');
    console.log('  ✅ Listado y consulta de espacios disponibles');
    console.log('  ✅ Validación y prevención de duplicados');
    
  } catch (error) {
    console.error('❌ Error en la demostración:', error.message);
  }
}

// Ejecutar demostración
demoCompleto();