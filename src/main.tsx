import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { invoke } from '@tauri-apps/api/core';
import { maximizeWindow } from './tauriMaximize';
import Database from "@tauri-apps/plugin-sql";

async function initDatabase() {
  try {
    console.log('Inicializando usuarios por defecto...');

    // Crear usuarios por defecto usando el comando disponible
    await invoke('crear_usuarios_defecto');
    console.log('Usuarios por defecto creados correctamente');
    
    // Inicializar tabla de libros con el nuevo esquema
    console.log('Inicializando tabla de libros...');
    const db = await Database.load('sqlite:db_biblioteca.db');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS libros (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        autor TEXT,
        genero TEXT,
        estante TEXT NOT NULL,
        nivel INTEGER NOT NULL,
        posicion INTEGER NOT NULL,
        ubicacion TEXT,
        estado TEXT DEFAULT 'disponible',
        fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insertar libro de ejemplo si no hay libros
    const existentes = await db.select<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM libros;'
    );
    
    if (existentes[0].count === 0) {
      // Generar un ID de ejemplo: C101 (Estante C, Nivel 1, Posición 01)
      const ejemploId = 'C101';
      await db.execute(
        `INSERT INTO libros (id, titulo, autor, genero, estante, nivel, posicion, ubicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ejemploId, 'Cien años de soledad', 'Gabriel García Márquez', 'Realismo mágico', 'C', 1, 1, 'Estante C-1-01']
      );
      console.log('Libro de ejemplo creado con ID:', ejemploId);
    }
    
    console.log('Tabla de libros inicializada correctamente');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

// Maximizar ventana y luego inicializar la base de datos y renderizar la app
const root = document.getElementById('root');
if (root) {
  maximizeWindow().finally(() => {
    initDatabase()
      .then(() => {
        ReactDOM.createRoot(root).render(<App />);
      })
      .catch((error) => {
        console.error('Error durante la inicialización:', error);
        ReactDOM.createRoot(root).render(<App />);
      });
  });
} else {
  console.error("No se encontró el elemento 'root'");
}
