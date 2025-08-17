import { crearSancion } from '../apiSanciones';
import Database from "@tauri-apps/plugin-sql";

export function setupFormularioDevolucion() {
  const form = document.querySelector<HTMLFormElement>("#form-devolucion");
  
  if (!form) {
    console.log('Formulario Devolución - Elemento no encontrado');
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const folio = (document.querySelector("#folio_devolucion") as HTMLInputElement)?.value.trim();
    
    if (!folio) {
      alert("El folio del préstamo es obligatorio.");
      return;
    }
    
    try {
      const db = await Database.load("sqlite:db_biblioteca.db");
      
      // Buscar el préstamo por folio
      const prestamos = await db.select(`
        SELECT p.*, pl.id_libro 
        FROM prestamos p 
        LEFT JOIN prestamos_libros pl ON p.id = pl.id_prestamo
        WHERE p.folio = ? AND p.estado = 'activo'
      `, [folio]) as any[];
      
      if (prestamos.length === 0) {
        alert("No se encontró un préstamo activo con ese folio.");
        return;
      }
      
      const prestamo = prestamos[0];
      const fecha_actual = new Date();
      const fecha_devolucion_esperada = new Date(prestamo.fecha_devolucion);
      
      // Calcular días de retraso
      const dias_retraso = Math.max(0, Math.ceil((fecha_actual.getTime() - fecha_devolucion_esperada.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Marcar préstamo como devuelto
      await db.execute(
        "UPDATE prestamos SET estado = 'devuelto', fecha_devolucion = ? WHERE id = ?",
        [fecha_actual.toISOString().split('T')[0], prestamo.id]
      );
      
      // Marcar libro como disponible
      if (prestamo.id_libro) {
        await db.execute(
          "UPDATE libros SET disponible = 1 WHERE id = ?",
          [prestamo.id_libro]
        );
      }
      
      // Si hay retraso, crear sanción automática
      if (dias_retraso > 0) {
        const fecha_inicio = fecha_actual.toISOString().split('T')[0];
        const fecha_fin_date = new Date(fecha_actual);
        fecha_fin_date.setDate(fecha_fin_date.getDate() + Math.min(dias_retraso * 2, 30)); // Máximo 30 días
        const fecha_fin = fecha_fin_date.toISOString().split('T')[0];
        
        const motivo = `Devolución tardía de ${dias_retraso} día(s) - Folio: ${folio}`;
        
        const resultado = await crearSancion(
          prestamo.id_ppl,
          fecha_inicio,
          fecha_fin,
          motivo,
          'devolución_tardía'
        );
        
        if (resultado.ok) {
          alert(`Devolución procesada. ATENCIÓN: Se aplicó una sanción de ${fecha_fin_date.getDate() - fecha_actual.getDate()} días por devolución tardía.`);
        } else {
          alert(`Devolución procesada, pero hubo un error al aplicar la sanción automática: ${resultado.error}`);
        }
      } else {
        alert("Devolución procesada exitosamente. Sin retrasos.");
      }
      
      form.reset();
      
    } catch (error) {
      console.error('Error procesando devolución:', error);
      alert('Error al procesar la devolución. Intente nuevamente.');
    }
  });
  
  console.log('Formulario Devolución configurado con sanciones automáticas');
}
