use tauri_plugin_sql::{Migration, MigrationKind};

// Comando simple para crear usuarios por defecto
#[tauri::command]
async fn crear_usuarios_defecto() -> Result<(), String> {
    Ok(())
}

// Comando para validar login
#[tauri::command]
async fn validar_login(usuario: String, password: String) -> Result<serde_json::Value, String> {
    // Validación hardcodeada por ahora para probar
    if (usuario == "admin" && password == "admin123") ||
       (usuario == "operador_matutino" && password == "operador1") ||
       (usuario == "operador_vespertino" && password == "operador2") {
        Ok(serde_json::json!({
            "success": true,
            "user": {
                "id": 1,
                "usuario": usuario,
                "rol": if usuario == "admin" { "admin" } else { "operador" }
            }
        }))
    } else {
        Ok(serde_json::json!({
            "success": false,
            "message": "Usuario o contraseña incorrectos"
        }))
    }
}

// Comando para verificar sanciones activas
#[tauri::command]
async fn verificar_sanciones_activas(id_ppl: String) -> Result<bool, String> {
    use tauri_plugin_sql::{Database, Manager};
    
    // Este sería el comando real usando la base de datos
    // Por ahora devolvemos false para testing
    Ok(false)
}

// Comando para crear sanción
#[tauri::command]
async fn crear_sancion(
    id_ppl: String,
    fecha_inicio: String,
    fecha_fin: String,
    motivo: String,
    tipo_sancion: String,
    id_admin_autoriza: Option<String>
) -> Result<bool, String> {
    // Validación básica
    if id_ppl.is_empty() || fecha_inicio.is_empty() || fecha_fin.is_empty() || motivo.is_empty() {
        return Err("Todos los campos obligatorios deben estar completos".to_string());
    }
    
    // Por ahora devolvemos éxito para testing
    Ok(true)
}

// Comando para anular sanción (solo admin)
#[tauri::command]
async fn anular_sancion(
    id_sancion: i32,
    id_admin: String,
    observaciones: String,
    rol_usuario: String
) -> Result<bool, String> {
    // Verificar que solo admin puede anular sanciones
    if rol_usuario != "admin" {
        return Err("Solo los administradores pueden anular sanciones".to_string());
    }
    
    if observaciones.is_empty() {
        return Err("Las observaciones son obligatorias para anular una sanción".to_string());
    }
    
    // Por ahora devolvemos éxito para testing
    Ok(true)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:biblioteca.db", vec![
                Migration {
                    version: 1,
                    description: "create_usuarios_table",
                    sql: "CREATE TABLE IF NOT EXISTS usuarios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        usuario TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        rol TEXT NOT NULL CHECK(rol IN ('admin', 'operador')),
                        activo INTEGER DEFAULT 1,
                        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                    );",
                    kind: MigrationKind::Up,
                },
                Migration {
                    version: 2,
                    description: "create_other_tables",
                    sql: "
                    CREATE TABLE IF NOT EXISTS ppl (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT NOT NULL,
                        apellido TEXT NOT NULL,
                        email TEXT UNIQUE,
                        telefono TEXT,
                        direccion TEXT,
                        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    
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
                    ",
                    kind: MigrationKind::Up,
                },
            ])
            .build())
        .invoke_handler(tauri::generate_handler![
            greet,
            crear_usuarios_defecto,
            validar_login,
            verificar_sanciones_activas,
            crear_sancion,
            anular_sancion
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
