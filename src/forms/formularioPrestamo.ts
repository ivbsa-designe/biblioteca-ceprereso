import { verificarSancionesActivas } from '../apiSanciones';
import Database from "@tauri-apps/plugin-sql";

export function setupFormularioPrestamo() {
  const form = document.querySelector<HTMLFormElement>("#form-prestamo");
  
  if (!form) {
    console.log('Formulario Préstamo - Elemento no encontrado');
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id_ppl = (document.querySelector("#id_ppl_prestamo") as HTMLInputElement)?.value.trim();
    const id_libro = (document.querySelector("#id_libro_prestamo") as HTMLInputElement)?.value.trim();
    
    if (!id_ppl || !id_libro) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    
    try {
      // Verificar si el PPL tiene sanciones activas
      const tieneSanciones = await verificarSancionesActivas(id_ppl);
      
      if (tieneSanciones) {
        alert("No se puede procesar el préstamo. El PPL tiene sanciones activas. Consulte con un administrador.");
        return;
      }
      
      // Proceder con el préstamo si no hay sanciones
      const db = await Database.load("sqlite:db_biblioteca.db");
      
      // Verificar que el PPL existe
      const ppl = await db.select("SELECT id FROM ppl WHERE id = ?", [id_ppl]) as any[];
      if (ppl.length === 0) {
        alert("PPL no encontrado.");
        return;
      }
      
      // Verificar que el libro existe y está disponible
      const libro = await db.select("SELECT id, disponible FROM libros WHERE id = ?", [id_libro]) as any[];
      if (libro.length === 0) {
        alert("Libro no encontrado.");
        return;
      }
      
      if (!libro[0].disponible) {
        alert("El libro no está disponible para préstamo.");
        return;
      }
      
      // Crear el préstamo
      const fecha_prestamo = new Date().toISOString().split('T')[0];
      const fecha_devolucion_esperada = new Date();
      fecha_devolucion_esperada.setDate(fecha_devolucion_esperada.getDate() + 14); // 14 días de préstamo
      const fecha_devolucion = fecha_devolucion_esperada.toISOString().split('T')[0];
      
      const folio = `P-${Date.now()}`;
      
      const resultado = await db.execute(
        `INSERT INTO prestamos (id_ppl, fecha_prestamo, fecha_devolucion, estado, folio)
         VALUES (?, ?, ?, 'activo', ?)`,
        [id_ppl, fecha_prestamo, fecha_devolucion, folio]
      );
      
      // Marcar libro como no disponible
      await db.execute(
        "UPDATE libros SET disponible = 0 WHERE id = ?",
        [id_libro]
      );
      
      // Relacionar préstamo con libro
      await db.execute(
        "INSERT INTO prestamos_libros (id_prestamo, id_libro) VALUES (?, ?)",
        [resultado.lastInsertId, id_libro]
      );
      
      alert(`Préstamo registrado exitosamente. Folio: ${folio}`);
      form.reset();
      
    } catch (error) {
      console.error('Error procesando préstamo:', error);
      alert('Error al procesar el préstamo. Intente nuevamente.');
    }
  });
  
  console.log('Formulario Préstamo configurado con verificación de sanciones');
}
