use tauri_plugin_sql::{Migration, MigrationKind};

mod pdf_generator;
use pdf_generator::{CredentialData, BookData, generate_credential_pdf, generate_book_label_pdf};

// Comando simple para crear usuarios por defecto
#[tauri::command]
async fn crear_usuarios_defecto() -> Result<(), String> {
    use bcrypt::{hash, DEFAULT_COST};
    let usuarios = vec![
        ("admin", "admin123", "admin"),
        ("operador_matutino", "operador1", "operador"),
        ("operador_vespertino", "operador2", "operador"),
        ("bibliotecario_matutino", "operador1", "bibliotecario"),
        ("bibliotecario_vespertino", "operador2", "bibliotecario")
    ];
    for (usuario, password, rol) in usuarios {
        let hash_pw = hash(password, DEFAULT_COST).map_err(|e| e.to_string())?;
        // La lógica de inserción debe hacerse desde el frontend usando el plugin SQL
    }
    Ok(())
}

// Comando para validar login
#[tauri::command]
async fn validar_login(usuario: String, password: String) -> Result<serde_json::Value, String> {
    use bcrypt::{verify};
    // La consulta SQL debe hacerse desde el frontend usando el plugin SQL
    Ok(serde_json::json!({
        "success": false,
        "message": "Implementar consulta desde el frontend"
    }))
}

// Comando para verificar sanciones activas
#[tauri::command]
async fn verificar_sanciones_activas(id_ppl: String) -> Result<bool, String> {
    
    let _ = id_ppl;
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
    let _ = tipo_sancion;
    let _ = id_admin_autoriza;
    if id_ppl.is_empty() || fecha_inicio.is_empty() || fecha_fin.is_empty() || motivo.is_empty() {
        return Err("Todos los campos obligatorios deben estar completos".to_string());
    }
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
    let _ = id_sancion;
    let _ = id_admin;
    if rol_usuario != "admin" {
        return Err("Solo los administradores pueden anular sanciones".to_string());
    }
    if observaciones.is_empty() {
        return Err("Las observaciones son obligatorias para anular una sanción".to_string());
    }
    Ok(true)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Comando para generar PDF de credencial
#[tauri::command]
async fn generar_credencial_pdf(credential: CredentialData, output_path: String) -> Result<String, String> {
    generate_credential_pdf(credential, &output_path)?;
    Ok(format!("Credencial PDF generada en: {}", output_path))
}

// Comando para generar PDF de etiqueta de libro
#[tauri::command]
async fn generar_etiqueta_libro_pdf(book: BookData, output_path: String) -> Result<String, String> {
    generate_book_label_pdf(book, &output_path)?;
    Ok(format!("Etiqueta de libro PDF generada en: {}", output_path))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:biblioteca.db", vec![
                Migration {
                    version: 1,
                    description: "create_usuarios_table",
                    sql: "CREATE TABLE IF NOT EXISTS usuarios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        usuario TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        rol TEXT NOT NULL CHECK(rol IN ('admin', 'operador', 'bibliotecario')),
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
                        id TEXT PRIMARY KEY,
                        nombre TEXT NOT NULL,
                        dormitorio TEXT NOT NULL,
                        seccion TEXT NOT NULL,
                        estancia TEXT NOT NULL,
                        consecutivo INTEGER NOT NULL,
                        activo BOOLEAN DEFAULT 1,
                        codigo_barras TEXT,
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
            generar_credencial_pdf,
            generar_etiqueta_libro_pdf,
            verificar_sanciones_activas,
            crear_sancion,
            anular_sancion
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
