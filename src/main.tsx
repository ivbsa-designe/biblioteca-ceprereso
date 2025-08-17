import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { invoke } from '@tauri-apps/api/core';
import { maximizeWindow } from './tauriMaximize';

async function initDatabase() {
  try {
    console.log('Inicializando usuarios por defecto...');

    // Crear usuarios por defecto usando el comando disponible
    await invoke('crear_usuarios_defecto');
    console.log('Usuarios por defecto creados correctamente');
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
