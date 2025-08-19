import { checkUserPermissions, showPermissionDeniedMessage } from '../permissions';

export function setupFormularioLibro() {
  // Verificar permisos antes de configurar el formulario
  if (!checkUserPermissions('book_management')) {
    showPermissionDeniedMessage('gestionar libros');
    return;
  }
  
  console.log('Formulario Libro listo');

import Database from "@tauri-apps/plugin-sql";

/**
 * Genera un ID único para un libro basado en Estante + Nivel + Posición
 * Formato: {Estante}{Nivel}{Posición} (ej: C434)
 */
async function generarIdLibro(estante: string, nivel: number, posicion?: number): Promise<string> {
  const db = await Database.load('sqlite:db_biblioteca.db');
  
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
async function listarEspaciosVacantes(estante?: string, nivel?: number): Promise<Array<{
  estante: string;
  nivel: number;
  posicion: number;
  id: string;
}>> {
  const db = await Database.load('sqlite:db_biblioteca.db');
  
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
async function registrarLibro(datos: {
  titulo: string;
  autor: string;
  genero: string;
  estante: string;
  nivel: number;
  posicion?: number;
}): Promise<string> {
  const db = await Database.load('sqlite:db_biblioteca.db');
  
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

/**
 * Da de baja un libro, liberando su espacio
 */
async function darDeBajaLibro(id: string): Promise<void> {
  const db = await Database.load('sqlite:db_biblioteca.db');
  
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

export function setupFormularioLibro() {
  const form = document.querySelector<HTMLFormElement>("#form-libro");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = (document.querySelector("#titulo") as HTMLInputElement).value.trim();
    const autor = (document.querySelector("#autor") as HTMLInputElement).value.trim();
    const genero = (document.querySelector("#genero") as HTMLInputElement).value.trim();
    const estante = (document.querySelector("#estante") as HTMLInputElement).value.trim().toUpperCase();
    const nivel = parseInt((document.querySelector("#nivel") as HTMLInputElement).value);
    const posicionInput = (document.querySelector("#posicion") as HTMLInputElement).value.trim();

    if (!titulo || !autor || !estante || !nivel) {
      alert("Los campos Título, Autor, Estante y Nivel son obligatorios.");
      return;
    }

    if (!/^[A-Z]$/.test(estante)) {
      alert("El estante debe ser una sola letra (A-Z).");
      return;
    }

    if (nivel < 1 || nivel > 99) {
      alert("El nivel debe estar entre 1 y 99.");
      return;
    }

    try {
      const posicion = posicionInput ? parseInt(posicionInput) : undefined;
      
      if (posicion !== undefined && (posicion < 1 || posicion > 99)) {
        alert("La posición debe estar entre 1 y 99.");
        return;
      }

      // Registrar el libro
      const idGenerado = await registrarLibro({
        titulo,
        autor,
        genero,
        estante,
        nivel,
        posicion
      });

      alert(`Libro registrado correctamente con ID: ${idGenerado}`);
      form.reset();
      
      // Actualizar la lista de espacios vacantes si existe
      await actualizarListaEspaciosVacantes();
      
    } catch (error: any) {
      alert(`Error al registrar el libro: ${error?.message || error}`);
    }
  });

  // Configurar botón para listar espacios vacantes
  const btnEspaciosVacantes = document.querySelector("#btn-espacios-vacantes");
  if (btnEspaciosVacantes) {
    btnEspaciosVacantes.addEventListener("click", async () => {
      await mostrarEspaciosVacantes();
    });
  }

  // Configurar botón para dar de baja libro
  const formBaja = document.querySelector<HTMLFormElement>("#form-baja-libro");
  if (formBaja) {
    formBaja.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const idLibro = (document.querySelector("#id-libro-baja") as HTMLInputElement).value.trim();
      
      if (!idLibro) {
        alert("Debe especificar el ID del libro a dar de baja.");
        return;
      }

      try {
        await darDeBajaLibro(idLibro);
        alert(`Libro ${idLibro} dado de baja correctamente. El espacio queda disponible.`);
        formBaja.reset();
        
        // Actualizar la lista de espacios vacantes
        await actualizarListaEspaciosVacantes();
        
      } catch (error: any) {
        alert(`Error al dar de baja el libro: ${error?.message || error}`);
      }
    });
  }
}

/**
 * Muestra todos los espacios vacantes disponibles
 */
async function mostrarEspaciosVacantes() {
  try {
    const espaciosVacantes = await listarEspaciosVacantes();
    
    if (espaciosVacantes.length === 0) {
      alert("No hay espacios vacantes disponibles.");
      return;
    }

    const listaEspacios = espaciosVacantes
      .map(espacio => `${espacio.id} - Estante ${espacio.estante}, Nivel ${espacio.nivel}, Posición ${espacio.posicion}`)
      .join('\n');
    
    alert(`Espacios vacantes disponibles:\n\n${listaEspacios}`);
    
  } catch (error: any) {
    alert(`Error al obtener espacios vacantes: ${error?.message || error}`);
  }
}

/**
 * Actualiza la lista visual de espacios vacantes si existe en el DOM
 */
async function actualizarListaEspaciosVacantes() {
  const listaElemento = document.querySelector("#lista-espacios-vacantes");
  if (!listaElemento) return;

  try {
    const espaciosVacantes = await listarEspaciosVacantes();
    
    if (espaciosVacantes.length === 0) {
      listaElemento.innerHTML = '<p>No hay espacios vacantes disponibles.</p>';
      return;
    }

    const htmlLista = espaciosVacantes
      .map(espacio => 
        `<div class="espacio-vacante">
          <strong>${espacio.id}</strong> - 
          Estante ${espacio.estante}, Nivel ${espacio.nivel}, Posición ${espacio.posicion}
        </div>`
      )
      .join('');
    
    listaElemento.innerHTML = `
      <h4>Espacios Vacantes (${espaciosVacantes.length})</h4>
      ${htmlLista}
    `;
    
  } catch (error: any) {
    listaElemento.innerHTML = `<p>Error al cargar espacios vacantes: ${error?.message || error}</p>`;
  }
}

/**
 * Genera un código de barras simple para un ID de libro
 * Esta es una implementación básica que puede expandirse con librerías específicas
 */
export function generarCodigoBarras(idLibro: string): string {
  // Implementación básica de código de barras en formato Code 128
  // En una implementación real, se usaría una librería como JsBarcode
  
  // Por ahora, retornamos una representación simple
  const barras = idLibro
    .split('')
    .map(char => {
      // Convertir cada carácter a una representación de barras
      const codigo = char.charCodeAt(0);
      return '|'.repeat(codigo % 5 + 1) + ' '.repeat(2);
    })
    .join('');
  
  return `|||| ${barras} ||||`;
}

/**
 * Exporta la información de un libro como código de barras
 */
export async function exportarCodigoBarrasLibro(idLibro: string): Promise<string> {
  try {
    const db = await Database.load("sqlite:db_biblioteca.db");
    
    // Verificar que el libro existe
    const libro = await db.select<{
      id: string;
      titulo: string;
      autor: string;
    }[]>('SELECT id, titulo, autor FROM libros WHERE id = ?', [idLibro]);
    
    if (libro.length === 0) {
      throw new Error(`No se encontró el libro con ID: ${idLibro}`);
    }
    
    const codigoBarras = generarCodigoBarras(idLibro);
    
    // Retornar información completa para la etiqueta
    return `
ID: ${idLibro}
Título: ${libro[0].titulo}
Autor: ${libro[0].autor}

${codigoBarras}
    `.trim();
    
  } catch (error: any) {
    throw new Error(`Error al generar código de barras: ${error?.message || error}`);
  }
}
