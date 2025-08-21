# 📘 Análisis de Requerimientos – Sistema de Biblioteca CEPRERESO

Este documento consolida el **contexto del cliente**, el **funcionamiento esperado del sistema** y la **implementación avanzada de sanciones**, para que cualquier desarrollador nuevo pueda comprender rápidamente el problema y lo que se espera lograr, incluso si no está familiarizado con el entorno penitenciario.

---

## 🎯 Objetivo de Negocio
La biblioteca del CEPRERESO necesita un sistema de gestión integral que permita:
- Control de inventario de libros.
- Gestión de PPL (Personas Privadas de la Libertad).
- Administración de préstamos, devoluciones y sanciones.
- Generación de credenciales y etiquetas con códigos de barras.
- Reportes estadísticos para seguimiento y auditoría.
- Funcionamiento 100% local, con base de datos embebida y opción de respaldos.

---

## 👥 Usuarios / Roles

1. **Administrador**
   - Alta/baja/edición de libros y PPL.
   - Generación de credenciales y etiquetas.
   - Aplicación y levantamiento de sanciones.
   - Generación y exportación de reportes.
   - Configuración de parámetros del sistema.
   - Gestión de respaldos.

2. **Bibliotecario**
   - Registrar préstamos y devoluciones.
   - Consultar catálogos.
   - Generar reportes para consulta (no exportación).
   - No puede dar de alta/baja libros o PPL.
   - No puede aplicar ni anular sanciones.

---

## 📦 Restricciones y condiciones de operación
- **Operación offline**: Todo el sistema debe funcionar en local, sin dependencia de internet.
- **Base de datos embebida**: Uso de SQLite.
- **Respaldo y restauración**: Exportar/Importar archivos de base de datos.
- **Formato de impresión**: PDF en papel **US Letter (8.5 x 11 pulgadas)**.
- **Impresión múltiple**: Planillas que acomoden varias credenciales o etiquetas por página.

---

## 🗂️ Modelos de Identificación

### PPL
- ID automático en formato `{Dormitorio}-{Sección}-{Estancia}-{Consecutivo}`.
- Ejemplo: `1H63` → Dormitorio 1, Sección H, Estancia 6, PPL 3.
- ID convertido a **código de barras**.

### Libros
- Identificación por ubicación física: Estante + Nivel + Posición.
- Ejemplo: `C434` → Estante C, Nivel 4, Posición 34.
- Al dar de baja un libro, su espacio queda marcado como **vacante**.
- ID convertido a **código de barras**.

---

## 🆔 Credenciales y Etiquetas

### Credenciales PPL
- Tamaño tarjeta estándar (85 x 54 mm).
- Datos: nombre completo, ID, dormitorio, sección, estancia, fecha de emisión.
- Foto (marco de integración futura).
- Código de barras Code128.
- Impresión en planilla US Letter (una o varias por hoja).

### Etiquetas de Libros
- **Etiqueta completa**: título, ID, ubicación, código de barras.
- **Etiqueta de lomo**: más delgada, solo código de barras y número consecutivo legible.
- Impresión en planilla US Letter.

---

## 🔄 Flujo de Operaciones

### Registro de Libros
- Alta manual por administrador.
- Asignación de ubicación única.
- Generación de etiquetas (completa + lomo).

### Registro de PPL
- Alta manual por administrador.
- Generación automática de ID.
- Emisión de credencial con código de barras.

### Préstamos
- Bibliotecario registra préstamo.
- Validación de sanciones activas (si existen, préstamo bloqueado).
- Generación de folio con fecha de devolución calculada (días configurables, excluyendo fines de semana).
- Estado del libro cambia a **prestado**.

### Devoluciones
- Bibliotecario registra devolución.
- Si es en tiempo → libro vuelve a estar disponible.
- Si es tarde → sanción automática.
- Si el libro está dañado → sanción manual (requiere autorización de admin).

---

## ⚠️ Sistema de Sanciones (Implementación avanzada)

### Tipos de sanciones
- **Automáticas por devolución tardía**:
  - Calculadas en base a días de retraso.
  - Duración proporcional (hasta 2x días de retraso, máx. 30 días).
- **Manuales por maltrato u otras faltas**:
  - Creadas desde formulario de sanciones.
  - Requieren motivo, tipo y duración.
  - Requieren autorización del administrador.

### Reglas clave
- Un PPL con sanción activa **no puede solicitar préstamos**.
- Solo administradores pueden **anular/modificar sanciones**.
- Todas las sanciones quedan registradas con:
  - Fecha de inicio y fin.
  - Motivo.
  - Tipo (automática o manual).
  - Estado (activa/anulada).
  - Admin responsable de autorizar o anular.
- Historial completo de sanciones y anulaciones.

### BD: Tabla `sanciones`
```sql
CREATE TABLE sanciones (
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
```

---

## 📊 Reportes esperados
- Top 10 libros más leídos.
- Top 10 PPL lectores.
- PPL sin actividad.
- Libros prestados actualmente.
- Libros con devoluciones vencidas.
- Top 3 dormitorios, secciones y estancias más activas.
- Reporte de espacios vacantes.
- Reporte de libros dañados/maltratados.

---

## 🔒 Seguridad y reglas de acceso
- Validación estricta de roles (admin vs bibliotecario).
- Autenticación de usuarios con contraseña.
- Solo administradores pueden aplicar/anular sanciones y gestionar respaldos.
- Trazabilidad completa de operaciones (quién hizo qué y cuándo).

---

## ✅ Éxito medible (KPIs)
- Reducción de errores manuales en préstamos/devoluciones (>80%).
- Trazabilidad total de sanciones y préstamos.
- Reportes generados en < 5 segundos.
- Backup y restauración funcional en < 2 minutos.

---

## 📌 MoSCoW (priorización)
- **Must**: Registro de PPL/libros, préstamos/devoluciones, sanciones, credenciales, etiquetas, reportes básicos.
- **Should**: Reportes avanzados, configuración flexible de parámetros, planillas de impresión.
- **Could**: Integración con escáneres externos, foto en credencial.
- **Won’t (ahora)**: Integración web, acceso remoto.

---

## 🎯 Criterios de aceptación globales
- IDs automáticos generados para PPL y libros, con validaciones.
- Bloqueo automático de préstamos para PPL sancionados.
- Impresión de credenciales y etiquetas en PDF US Letter.
- Reportes exportables en PDF.
- Backup/restore disponible en menú de admin.
- Sistema operando offline en PCs del CEPRERESO.

---
Este documento unifica el **contexto, requerimientos funcionales y técnicos, sistema de sanciones y reglas operativas**. Con esto, cualquier desarrollador puede incorporarse rápidamente al proyecto y entender tanto el problema como la solución esperada.

