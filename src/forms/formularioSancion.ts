import { checkUserPermissions, showPermissionDeniedMessage } from '../permissions';

export function setupFormularioSancion() {
  // Verificar permisos antes de configurar el formulario
  if (!checkUserPermissions('sanctions')) {
    showPermissionDeniedMessage('gestionar sanciones');
    return;
  }
  
  console.log('Formulario de sanciones listo');
}

import { crearSancion, anularSancion } from '../apiSanciones';
import Database from "@tauri-apps/plugin-sql";

export function setupFormularioSancion() {
  setupFormularioCrearSancion();
  setupFormularioAnularSancion();
  cargarSancionesActivas();
}

function setupFormularioCrearSancion() {
  const form = document.querySelector<HTMLFormElement>("#form-crear-sancion");
  
  if (!form) {
    console.log('Formulario Crear Sanción - Elemento no encontrado');
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id_ppl = (document.querySelector("#id_ppl_sancion") as HTMLInputElement)?.value.trim();
    const motivo = (document.querySelector("#motivo_sancion") as HTMLTextAreaElement)?.value.trim();
    const tipo_sancion = (document.querySelector("#tipo_sancion") as HTMLSelectElement)?.value;
    const dias_sancion = parseInt((document.querySelector("#dias_sancion") as HTMLInputElement)?.value || "7");
    
    if (!id_ppl || !motivo || !tipo_sancion) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    
    try {
      // Verificar que el PPL existe
      const db = await Database.load("sqlite:db_biblioteca.db");
      const ppl = await db.select("SELECT id, nombre FROM ppl WHERE id = ?", [id_ppl]) as any[];
      
      if (ppl.length === 0) {
        alert("PPL no encontrado.");
        return;
      }
      
      // Calcular fechas
      const fecha_inicio = new Date().toISOString().split('T')[0];
      const fecha_fin_date = new Date();
      fecha_fin_date.setDate(fecha_fin_date.getDate() + dias_sancion);
      const fecha_fin = fecha_fin_date.toISOString().split('T')[0];
      
      // Obtener usuario admin actual (simulado)
      const usuario_actual = sessionStorage.getItem('usuario_actual');
      const admin_data = usuario_actual ? JSON.parse(usuario_actual) : null;
      const id_admin = admin_data?.rol === 'admin' ? admin_data.nombre : undefined;
      
      const resultado = await crearSancion(
        id_ppl,
        fecha_inicio,
        fecha_fin,
        motivo,
        tipo_sancion,
        id_admin
      );
      
      if (resultado.ok) {
        alert(`Sanción aplicada exitosamente al PPL: ${ppl[0].nombre}`);
        form.reset();
        cargarSancionesActivas(); // Recargar la lista
      } else {
        alert(`Error: ${resultado.error}`);
      }
      
    } catch (error) {
      console.error('Error creando sanción:', error);
      alert('Error al crear la sanción. Intente nuevamente.');
    }
  });
}

function setupFormularioAnularSancion() {
  const form = document.querySelector<HTMLFormElement>("#form-anular-sancion");
  
  if (!form) {
    console.log('Formulario Anular Sanción - Elemento no encontrado');
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id_sancion = parseInt((document.querySelector("#id_sancion_anular") as HTMLInputElement)?.value || "0");
    const observaciones = (document.querySelector("#observaciones_anulacion") as HTMLTextAreaElement)?.value.trim();
    
    if (!id_sancion || !observaciones) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    
    try {
      // Obtener usuario actual
      const usuario_actual = sessionStorage.getItem('usuario_actual');
      const admin_data = usuario_actual ? JSON.parse(usuario_actual) : null;
      
      if (!admin_data || admin_data.rol !== 'admin') {
        alert("Solo los administradores pueden anular sanciones.");
        return;
      }
      
      const resultado = await anularSancion(
        id_sancion,
        admin_data.nombre,
        observaciones,
        admin_data.rol
      );
      
      if (resultado.ok) {
        alert("Sanción anulada exitosamente.");
        form.reset();
        cargarSancionesActivas(); // Recargar la lista
      } else {
        alert(`Error: ${resultado.error}`);
      }
      
    } catch (error) {
      console.error('Error anulando sanción:', error);
      alert('Error al anular la sanción. Intente nuevamente.');
    }
  });
}

async function cargarSancionesActivas() {
  try {
    const db = await Database.load("sqlite:db_biblioteca.db");
    const sanciones = await db.select(`
      SELECT s.*, p.nombre as nombre_ppl 
      FROM sanciones s 
      LEFT JOIN ppl p ON s.id_ppl = p.id
      WHERE s.activo = 1 AND date('now') BETWEEN s.fecha_inicio AND s.fecha_fin
      ORDER BY s.fecha_creacion DESC
    `) as any[];
    
    const container = document.querySelector("#lista-sanciones-activas");
    if (container) {
      container.innerHTML = '';
      
      if (sanciones.length === 0) {
        container.innerHTML = '<p>No hay sanciones activas.</p>';
        return;
      }
      
      sanciones.forEach((sancion: any) => {
        const div = document.createElement('div');
        div.className = 'sancion-item';
        div.innerHTML = `
          <div class="sancion-info">
            <strong>PPL:</strong> ${sancion.nombre_ppl || sancion.id_ppl} <br>
            <strong>Motivo:</strong> ${sancion.motivo} <br>
            <strong>Tipo:</strong> ${sancion.tipo_sancion} <br>
            <strong>Vigencia:</strong> ${sancion.fecha_inicio} - ${sancion.fecha_fin} <br>
            <button onclick="seleccionarSancionParaAnular(${sancion.id})" class="btn-anular">
              Anular Sanción
            </button>
          </div>
        `;
        container.appendChild(div);
      });
    }
    
  } catch (error) {
    console.error('Error cargando sanciones activas:', error);
  }
}

// Función global para seleccionar sanción para anular
(window as any).seleccionarSancionParaAnular = function(id_sancion: number) {
  const input = document.querySelector("#id_sancion_anular") as HTMLInputElement;
  if (input) {
    input.value = id_sancion.toString();
  }
};

console.log('Formulario Sanciones configurado');
