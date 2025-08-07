// src-tauri/sql/init.ts
import { crearTablaPPL } from "./ppl";
import { crearTablaLibros } from "./libros";
import { crearTablaPrestamos } from "./prestamos";
import { crearTablaPrestamosLibros } from "./prestamos_libros";
import { crearTablaCredenciales } from "./credenciales";

import { crearTablaSanciones } from "./sanciones";
import { crearTablaUsuarios } from "./usuarios";

export async function inicializarBaseDeDatos() {
  await crearTablaPPL();
  await crearTablaLibros();
  await crearTablaPrestamos();
  await crearTablaPrestamosLibros();
  await crearTablaCredenciales();
  await crearTablaSanciones();
  await crearTablaUsuarios();
}
