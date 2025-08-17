use printpdf::*;
use std::fs::File;
use std::io::BufWriter;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CredentialData {
    pub id: String,
    pub nombre: String,
    pub apellido: String,
    pub foto_path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BookData {
    pub id: i32,
    pub titulo: String,
    pub autor: String,
    pub ubicacion: String,
}

// Simple barcode simulation function (creates a visual pattern)
fn draw_simple_barcode(layer: &PdfLayerReference, data: &str, x: Mm, y: Mm, width: Mm, height: Mm) {
    // Create a simple pattern based on the string data
    let mut current_x = x;
    let bar_width = Mm(1.0);
    
    for (i, ch) in data.chars().enumerate() {
        if i as f64 * bar_width.0 as f64 > width.0 as f64 { break; }
        
        // Use character value to determine bar pattern
        let char_value = ch as u32;
        if char_value % 2 == 0 {
            // Draw a simple vertical line to represent a bar
            let line = Line {
                points: vec![
                    (Point::new(current_x, y), false),
                    (Point::new(current_x, y + height), false),
                ],
                is_closed: false,
            };
            layer.add_line(line);
        }
        current_x = current_x + bar_width;
    }
}

pub fn generate_credential_pdf(credential: CredentialData, output_path: &str) -> Result<(), String> {
    let (doc, page1, layer1) = PdfDocument::new("Credencial PPL", Mm(85.0), Mm(54.0), "Layer 1");
    
    // Get layer reference
    let layer = doc.get_page(page1).get_layer(layer1);
    
    // Add title
    let font = doc.add_builtin_font(BuiltinFont::HelveticaBold).map_err(|e| e.to_string())?;
    layer.use_text("CREDENCIAL PPL", 12.0, Mm(5.0), Mm(45.0), &font);
    
    // Add name
    layer.use_text(format!("{} {}", credential.nombre, credential.apellido), 10.0, Mm(5.0), Mm(38.0), &font);
    
    // Add ID
    layer.use_text(format!("ID: {}", credential.id), 8.0, Mm(5.0), Mm(32.0), &font);
    
    // Generate simple barcode for ID
    layer.use_text("Código de barras:", 6.0, Mm(5.0), Mm(26.0), &font);
    draw_simple_barcode(&layer, &credential.id, Mm(5.0), Mm(22.0), Mm(40.0), Mm(3.0));
    layer.use_text(&format!("CODE128: {}", credential.id), 6.0, Mm(5.0), Mm(18.0), &font);
    
    // Add photo placeholder
    let font_regular = doc.add_builtin_font(BuiltinFont::Helvetica).map_err(|e| e.to_string())?;
    
    // Draw photo frame
    let photo_frame = Line {
        points: vec![
            (Point::new(Mm(55.0), Mm(25.0)), false),
            (Point::new(Mm(75.0), Mm(25.0)), false),
            (Point::new(Mm(75.0), Mm(40.0)), false),
            (Point::new(Mm(55.0), Mm(40.0)), false),
        ],
        is_closed: true,
    };
    layer.add_line(photo_frame);
    layer.use_text("FOTO", 8.0, Mm(60.0), Mm(32.0), &font_regular);
    
    // Add date
    layer.use_text(format!("Emisión: {}", chrono::Utc::now().format("%Y-%m-%d")), 6.0, Mm(5.0), Mm(5.0), &font_regular);
    
    // Save document
    doc.save(&mut BufWriter::new(File::create(output_path).map_err(|e| e.to_string())?))
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

pub fn generate_book_label_pdf(book: BookData, output_path: &str) -> Result<(), String> {
    let (doc, page1, layer1) = PdfDocument::new("Etiqueta Libro", Mm(70.0), Mm(30.0), "Layer 1");
    
    // Get layer reference
    let layer = doc.get_page(page1).get_layer(layer1);
    
    // Add title
    let font = doc.add_builtin_font(BuiltinFont::HelveticaBold).map_err(|e| e.to_string())?;
    layer.use_text(&book.titulo, 10.0, Mm(2.0), Mm(26.0), &font);
    
    // Add author
    let font_regular = doc.add_builtin_font(BuiltinFont::Helvetica).map_err(|e| e.to_string())?;
    layer.use_text(&book.autor, 8.0, Mm(2.0), Mm(22.0), &font_regular);
    
    // Add ID
    layer.use_text(&format!("ID: {}", book.id), 8.0, Mm(2.0), Mm(18.0), &font_regular);
    
    // Add location
    layer.use_text(&format!("Ubicación: {}", book.ubicacion), 7.0, Mm(2.0), Mm(14.0), &font_regular);
    
    // Generate simple barcode for book ID
    layer.use_text("Código de barras:", 6.0, Mm(2.0), Mm(10.0), &font_regular);
    draw_simple_barcode(&layer, &book.id.to_string(), Mm(2.0), Mm(6.0), Mm(50.0), Mm(3.0));
    layer.use_text(&format!("CODE128: {}", book.id), 6.0, Mm(2.0), Mm(2.0), &font_regular);
    
    // Save document
    doc.save(&mut BufWriter::new(File::create(output_path).map_err(|e| e.to_string())?))
        .map_err(|e| e.to_string())?;
    
    Ok(())
}