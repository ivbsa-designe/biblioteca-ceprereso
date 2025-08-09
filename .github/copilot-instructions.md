# Copilot Coding Agent Instructions for biblioteca-ceprereso

## Arquitectura General
- Proyecto híbrido: **Frontend** en React + TypeScript (Vite) en `src/` y **backend** en Rust (Tauri) en `src-tauri/`.
- El frontend consume funcionalidades nativas expuestas por Tauri y accede a la base de datos mediante módulos TypeScript en `src/sql/`.
- Formularios y flujos principales están en `src/forms/` y vistas clave como `App.tsx` y `Dashboard.tsx`.
- Los módulos de Rust (`src-tauri/src/`) implementan la lógica nativa y exponen comandos a JS/TS.

## Flujos de desarrollo
- **Desarrollo local:**
  - Instala dependencias: `npm install`
  - Ejecuta la app: `npm run tauri dev` (levanta frontend y backend Tauri)
- **Build:**
  - `npm run tauri build` genera binarios multiplataforma.
- **Tests:**
  - No hay tests automatizados detectados; verifica manualmente la funcionalidad.

## Convenciones y patrones
- **Módulos SQL:** Cada archivo en `src/sql/` representa una tabla o entidad (ej: `usuarios.ts`, `libros.ts`).
- **Formularios:** Cada flujo de UI tiene su propio archivo en `src/forms/`.
- **Estilos:** Centralizados en `src/styles.css`.
- **Assets:** Imágenes y SVG en `src/assets/`.
- **Integración Tauri:** Usa `@tauri-apps/api` para comunicación JS <-> Rust.
- **No usar rutas absolutas** en imports, usa rutas relativas desde `src/`.

## Dependencias y herramientas
- **Frontend:** React, TypeScript, Vite.
- **Backend:** Rust, Tauri.
- **IDE recomendado:** VS Code + extensiones Tauri y rust-analyzer.

## Ejemplos de patrones clave
- Para agregar una nueva entidad:
  1. Crea archivo en `src/sql/` para lógica de datos.
  2. Crea formulario en `src/forms/`.
  3. Expón comandos en Rust si se requiere lógica nativa.
- Para comunicación JS <-> Rust:
  ```ts
  import { invoke } from '@tauri-apps/api/tauri';
  invoke('nombre_comando', { param1: valor1 });
  ```

## Archivos y directorios clave
- `src/App.tsx`, `src/Dashboard.tsx`: Vistas principales.
- `src/forms/`: Formularios de UI.
- `src/sql/`: Acceso a datos.
- `src-tauri/src/`: Lógica Rust y comandos nativos.
- `vite.config.ts`, `tauri.conf.json`: Configuración de build.

---

Actualiza este archivo si cambian los flujos, convenciones o arquitectura. Consulta el README para detalles visuales o de diseño.
