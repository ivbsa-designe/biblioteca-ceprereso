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
            validar_login
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
