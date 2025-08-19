import Database from "@tauri-apps/plugin-sql";

export async function crearTablaSanciones() {
  const db = await Database.load("sqlite:db_biblioteca.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sanciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_ppl TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT NOT NULL,
      motivo TEXT NOT NULL,
      tipo_sancion TEXT DEFAULT 'devolución_tardía',
      activo INTEGER DEFAULT 1,
      id_admin_autoriza TEXT,
      fecha_anulacion TEXT,
      observaciones_anulacion TEXT,
      fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(id_ppl) REFERENCES ppl(id)
    );
  `);
}

// Crear una nueva sanción
export async function crearSancion(
  id_ppl: string,
  fecha_inicio: string,
  fecha_fin: string,
  motivo: string,
  tipo_sancion: string = 'devolución_tardía',
  id_admin_autoriza?: string
) {
  const db = await Database.load("sqlite:db_biblioteca.db");
  
  const result = await db.execute(
    `INSERT INTO sanciones (id_ppl, fecha_inicio, fecha_fin, motivo, tipo_sancion, id_admin_autoriza, activo)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [id_ppl, fecha_inicio, fecha_fin, motivo, tipo_sancion, id_admin_autoriza || null]
  );
  
  return result;
}

// Verificar si un PPL tiene sanciones activas
export async function verificarSancionesActivas(id_ppl: string): Promise<boolean> {
  const db = await Database.load("sqlite:db_biblioteca.db");
  
  const sanciones = await db.select(
    `SELECT COUNT(*) as count FROM sanciones 
     WHERE id_ppl = ? AND activo = 1 AND date('now') BETWEEN fecha_inicio AND fecha_fin`,
    [id_ppl]
  );
  
  return (sanciones[0] as any).count > 0;
}

// Obtener sanciones activas de un PPL
export async function obtenerSancionesActivas(id_ppl: string) {
  const db = await Database.load("sqlite:db_biblioteca.db");
  
  return await db.select(
    `SELECT * FROM sanciones 
     WHERE id_ppl = ? AND activo = 1 AND date('now') BETWEEN fecha_inicio AND fecha_fin
     ORDER BY fecha_inicio DESC`,
    [id_ppl]
  );
}

// Anular una sanción (solo administradores)
export async function anularSancion(
  id_sancion: number,
  id_admin: string,
  observaciones: string
) {
  const db = await Database.load("sqlite:db_biblioteca.db");
  
  const fecha_anulacion = new Date().toISOString().split('T')[0];
  
  return await db.execute(
    `UPDATE sanciones 
     SET activo = 0, fecha_anulacion = ?, observaciones_anulacion = ?, id_admin_autoriza = ?
     WHERE id = ? AND activo = 1`,
    [fecha_anulacion, observaciones, id_admin, id_sancion]
  );
}

// Obtener todas las sanciones (con filtros opcionales)
export async function obtenerSanciones(activo?: boolean) {
  const db = await Database.load("sqlite:db_biblioteca.db");
  
  let query = `
    SELECT s.*, p.nombre as nombre_ppl 
    FROM sanciones s 
    LEFT JOIN ppl p ON s.id_ppl = p.id
  `;
  
  const params: any[] = [];
  
  if (activo !== undefined) {
    query += ` WHERE s.activo = ?`;
    params.push(activo ? 1 : 0);
  }
  
  query += ` ORDER BY s.fecha_creacion DESC`;
  
  return await db.select(query, params);
}

// Crear sanción automática por devolución tardía
export async function crearSancionAutomatica(
  id_ppl: string,
  id_prestamo: number,
  dias_retraso: number
) {
  const fecha_inicio = new Date().toISOString().split('T')[0];
  const fecha_fin_date = new Date();
  fecha_fin_date.setDate(fecha_fin_date.getDate() + Math.min(dias_retraso * 2, 30)); // Máximo 30 días
  const fecha_fin = fecha_fin_date.toISOString().split('T')[0];
  
  const motivo = `Devolución tardía de ${dias_retraso} día(s) - Préstamo #${id_prestamo}`;
  
  return await crearSancion(id_ppl, fecha_inicio, fecha_fin, motivo, 'devolución_tardía');
}
