# Sistema de Gestión de Biblioteca CEPRERESO

Sistema de gestión bibliotecaria desarrollado con tecnologías modernas para el manejo integral de prestamos, devoluciones, credenciales y gestión de personas privadas de libertad (PPL).

## ¿Qué es este proyecto?

**Biblioteca CEPRERESO** es una aplicación de escritorio multiplataforma que permite:

- **Gestión de PPL**: Registro y administración de personas privadas de libertad con información de dormitorio, sección y estancia
- **Sistema de Credenciales**: Emisión y gestión de credenciales con fotografía para PPL
- **Gestión de Biblioteca**: Catálogo completo de libros con sistema de búsqueda
- **Préstamos y Devoluciones**: Control de préstamos con seguimiento de fechas y estado
- **Sistema de Sanciones**: Registro y gestión de sanciones por incumplimientos
- **Autenticación de Usuarios**: Sistema de login con roles (admin/operador)

## Tecnologías Utilizadas

### Frontend

- **React 19** con **TypeScript** - Framework principal de UI
- **Material-UI (MUI)** - Componentes y sistema de diseño
- **Vite** - Herramienta de build y desarrollo
- **Emotion** - Librería CSS-in-JS para estilos

### Backend

- **Rust** - Lenguaje de programación del backend
- **Tauri 2** - Framework para aplicaciones de escritorio multiplataforma
- **SQLite** - Base de datos embebida

### Herramientas y Dependencias

- **bcryptjs** - Encriptación de contraseñas
- **@tauri-apps/plugin-sql** - Plugin para manejo de base de datos
- **@tauri-apps/plugin-opener** - Plugin para abrir archivos/URLs

## Base de Datos

El sistema utiliza **SQLite** como base de datos embebida con las siguientes tablas:

- **ppl**: Personas privadas de libertad (ID, nombre, dormitorio, sección, estancia)
- **credenciales**: Credenciales con foto vinculadas a PPL
- **libros**: Catálogo de libros de la biblioteca
- **prestamos**: Registro de préstamos con fechas y estado
- **prestamos_libros**: Relación many-to-many entre préstamos y libros
- **sanciones**: Sistema de sanciones por incumplimientos
- **usuarios**: Usuarios del sistema con autenticación

## Configuración y Desarrollo

### Requisitos Previos

- Node.js (v18 o superior)
- Rust (última versión estable)
- Visual Studio Code (recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/PakoOlivo/biblioteca-ceprereso.git
cd biblioteca-ceprereso

# Instalar dependencias
npm install
```

### Desarrollo Local

```bash
# Ejecutar en modo desarrollo (frontend + backend)
npm run tauri dev
```

### Build de Producción

```bash
# Generar binarios multiplataforma
npm run tauri build
```

## Entorno de Desarrollo Recomendado

- **[VS Code](https://code.visualstudio.com/)** + [Extensión Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Arquitectura del Proyecto

```
├── src/                           # Frontend React + TypeScript
│   ├── App.tsx                   # Componente principal con login
│   ├── Dashboard.tsx             # Panel principal del sistema
│   ├── main.tsx                  # Punto de entrada React
│   ├── styles.css                # Estilos globales modernos
│   ├── forms/                    # Formularios de gestión
│   │   ├── formularioPPL.ts      # Registro de PPL
│   │   ├── formularioLibro.ts    # Gestión de libros
│   │   ├── formularioPrestamo.ts # Préstamos
│   │   ├── formularioDevolucion.ts # Devoluciones
│   │   ├── formularioCredencial.ts # Credenciales
│   │   └── formularioSancion.ts  # Sanciones
│   └── assets/                   # Recursos estáticos
│
├── src-tauri/                    # Backend Rust + Tauri
│   ├── src/
│   │   ├── main.rs              # Punto de entrada Rust
│   │   └── lib.rs               # Comandos Tauri (validar_login, etc)
│   ├── sql/                     # Módulos de base de datos
│   │   ├── init.ts              # Inicialización de tablas
│   │   ├── usuarios.ts          # Gestión de usuarios
│   │   ├── ppl.ts               # PPL
│   │   ├── libros.ts            # Libros
│   │   ├── prestamos.ts         # Préstamos
│   │   ├── prestamos_libros.ts  # Relación préstamos-libros
│   │   ├── credenciales.ts      # Credenciales
│   │   └── sanciones.ts         # Sanciones
│   ├── Cargo.toml               # Dependencias Rust
│   └── tauri.conf.json          # Configuración Tauri
│
├── package.json                 # Dependencias Node.js
├── vite.config.ts              # Configuración Vite
└── tsconfig.json               # Configuración TypeScript
```

## Características Principales

### 🔐 Sistema de Autenticación

- Login con usuarios predefinidos (admin/operadores)
- Roles diferenciados con permisos específicos
- Sesión persistente durante el uso

### 👥 Gestión de PPL

- Registro automático con IDs únicos por ubicación
- Formato: `{dormitorio}-{sección}-{estancia}-{consecutivo}`
- Validación de duplicados por ubicación

### 📚 Sistema de Biblioteca

- Catálogo completo de libros
- Sistema de búsqueda y filtros
- Control de inventario

### 📋 Préstamos y Devoluciones

- Seguimiento completo de préstamos
- Control de fechas de vencimiento
- Historial de transacciones
- Estados: activo, devuelto, vencido

### 🆔 Sistema de Credenciales

- Emisión de credenciales con fotografía
- Vinculación directa con PPL
- Control de fechas de emisión

### ⚠️ Sistema de Sanciones

- Registro de incumplimientos
- Seguimiento de sanciones por PPL
- Historial completo de infracciones

## Scripts Disponibles

### Desarrollo y Build

```bash
npm run dev          # Servidor de desarrollo Vite
npm run build        # Build de producción (TS + Vite)
npm run preview      # Preview del build
npm run tauri dev    # Desarrollo completo (frontend + backend)
npm run tauri build  # Build de aplicación nativa
```

### Linting y Formato

```bash
# Frontend (TypeScript/React)
npm run lint         # Lint con ESLint
npm run lint:fix     # Autofix de problemas de lint
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato

# Backend (Rust)
npm run rust:fmt         # Formatear código Rust
npm run rust:fmt:check   # Verificar formato Rust
npm run rust:clippy      # Lint Rust con Clippy
```

## CI/CD y Releases

Este proyecto incluye automatización completa con GitHub Actions:

### 🚀 Pipeline Automático

- **Trigger**: Push a la rama `main`
- **Lint**: ESLint + Prettier (frontend) + rustfmt + clippy (backend)
- **Build**: Multiplataforma (Windows + Linux)
- **Release**: Beta automático en GitHub Releases

### 📦 Binarios Generados

- **Windows**: `.msi` installer (auto-contenido)
- **Linux**: `.AppImage` (portable, sin dependencias)

### 🔄 Gestión de Releases Beta

- Máximo 3 releases beta conservados
- Limpieza automática de versiones antiguas
- Nombrado: `v{VERSION}-beta`

---

## Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
