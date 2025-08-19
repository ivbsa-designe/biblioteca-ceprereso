
import Database from "@tauri-apps/plugin-sql";
import { checkUserPermissions, showPermissionDeniedMessage } from '../permissions';

export function setupFormularioPPL() {
  // Verificar permisos antes de configurar el formulario
  if (!checkUserPermissions('ppl_management')) {
    showPermissionDeniedMessage('gestionar PPL');
    return;
  }

  const form = document.querySelector<HTMLFormElement>("#form-ppl");

import Database from '@tauri-apps/plugin-sql';

export function setupFormularioPPL() {
  const form = document.querySelector<HTMLFormElement>('#form-ppl');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = (
      document.querySelector('#nombre') as HTMLInputElement
    ).value.trim();
    const dormitorio = (
      document.querySelector('#dormitorio') as HTMLInputElement
    ).value.trim();
    const seccion = (
      document.querySelector('#seccion') as HTMLInputElement
    ).value
      .trim()
      .toUpperCase();
    const estancia = (
      document.querySelector('#estancia') as HTMLInputElement
    ).value.trim();

    if (!nombre || !dormitorio || !seccion || !estancia) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const db = await Database.load('sqlite:db_biblioteca.db');

    // Buscar cuántos PPL existen ya en esa misma ubicación
    const coincidencias = await db.select<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM ppl
       WHERE dormitorio = ? AND seccion = ? AND estancia = ?`,
      [dormitorio, seccion, estancia]
    );

    const consecutivo = (coincidencias[0]?.count || 0) + 1;
    const id = `${dormitorio}-${seccion}-${estancia}-${consecutivo}`;

    // Verificar si el ID ya existe
    const yaExiste = await db.select<{ id: string }[]>(
      'SELECT id FROM ppl WHERE id = ?',
      [id]
    );

    if (yaExiste.length > 0) {
      alert('Ya existe un PPL registrado con esa ubicación e ID.');
      return;
    }

    // Insertar el nuevo PPL
    await db.execute(
      `INSERT INTO ppl (id, nombre, dormitorio, seccion, estancia)
       VALUES (?, ?, ?, ?, ?)`,
      [id, nombre, dormitorio, seccion, estancia]
    );

    alert('PPL registrado correctamente.');
    form.reset();
  });
}
