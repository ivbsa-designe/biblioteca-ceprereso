import { invoke } from '@tauri-apps/api/core';

export interface Sancion {
  id: number;
  id_ppl: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
  tipo_sancion: string;
  activo: boolean;
  id_admin_autoriza?: string;
  fecha_anulacion?: string;
  observaciones_anulacion?: string;
  fecha_creacion: string;
  nombre_ppl?: string;
}

export async function verificarSancionesActivas(id_ppl: string): Promise<boolean> {
  try {
    const result = await invoke('verificar_sanciones_activas', { idPpl: id_ppl });
    return result as boolean;
  } catch (error) {
    console.error('Error verificando sanciones activas:', error);
    return false;
  }
}

export async function crearSancion(
  id_ppl: string,
  fecha_inicio: string,
  fecha_fin: string,
  motivo: string,
  tipo_sancion: string = 'manual',
  id_admin_autoriza?: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await invoke('crear_sancion', {
      idPpl: id_ppl,
      fechaInicio: fecha_inicio,
      fechaFin: fecha_fin,
      motivo,
      tipoSancion: tipo_sancion,
      idAdminAutoriza: id_admin_autoriza
    });
    
    return { ok: result as boolean };
  } catch (error) {
    console.error('Error creando sanción:', error);
    return { ok: false, error: error as string };
  }
}

export async function anularSancion(
  id_sancion: number,
  id_admin: string,
  observaciones: string,
  rol_usuario: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await invoke('anular_sancion', {
      idSancion: id_sancion,
      idAdmin: id_admin,
      observaciones,
      rolUsuario: rol_usuario
    });
    
    return { ok: result as boolean };
  } catch (error) {
    console.error('Error anulando sanción:', error);
    return { ok: false, error: error as string };
  }
}