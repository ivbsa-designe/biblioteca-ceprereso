import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';

export interface CredentialData {
  id: string;
  nombre: string;
  apellido: string;
  foto_path?: string;
}

export interface BookData {
  id: number;
  titulo: string;
  autor: string;
  ubicacion: string;
}

/**
 * Genera un PDF de credencial para PPL con foto y código de barras
 * @param credential Datos de la credencial
 * @returns Mensaje de confirmación con la ruta del archivo
 */
export async function generateCredentialPDF(credential: CredentialData): Promise<string> {
  try {
    // Abrir diálogo para seleccionar dónde guardar el archivo
    const filePath = await save({
      filters: [{
        name: 'PDF',
        extensions: ['pdf']
      }],
      defaultPath: `credencial_${credential.id}.pdf`
    });

    if (!filePath) {
      throw new Error('No se seleccionó ubicación para guardar el archivo');
    }

    // Llamar al comando Rust para generar el PDF
    const result = await invoke<string>('generar_credencial_pdf', {
      credential,
      outputPath: filePath
    });

    return result;
  } catch (error) {
    console.error('Error generando PDF de credencial:', error);
    throw error;
  }
}

/**
 * Genera un PDF de etiqueta para libro con código de barras
 * @param book Datos del libro
 * @returns Mensaje de confirmación con la ruta del archivo
 */
export async function generateBookLabelPDF(book: BookData): Promise<string> {
  try {
    // Abrir diálogo para seleccionar dónde guardar el archivo
    const filePath = await save({
      filters: [{
        name: 'PDF',
        extensions: ['pdf']
      }],
      defaultPath: `etiqueta_libro_${book.id}.pdf`
    });

    if (!filePath) {
      throw new Error('No se seleccionó ubicación para guardar el archivo');
    }

    // Llamar al comando Rust para generar el PDF
    const result = await invoke<string>('generar_etiqueta_libro_pdf', {
      book,
      outputPath: filePath
    });

    return result;
  } catch (error) {
    console.error('Error generando PDF de etiqueta de libro:', error);
    throw error;
  }
}

/**
 * Genera múltiples etiquetas de libros en un solo PDF
 * @param books Array de libros
 * @returns Mensaje de confirmación con la ruta del archivo
 */
export async function generateMultipleBookLabelsPDF(books: BookData[]): Promise<string[]> {
  const results: string[] = [];
  
  for (const book of books) {
    try {
      const result = await generateBookLabelPDF(book);
      results.push(result);
    } catch (error) {
      console.error(`Error generando PDF para libro ${book.id}:`, error);
      results.push(`Error para libro ${book.id}: ${error}`);
    }
  }
  
  return results;
}

/**
 * Genera múltiples credenciales en PDFs separados
 * @param credentials Array de credenciales
 * @returns Array de mensajes de confirmación
 */
export async function generateMultipleCredentialsPDF(credentials: CredentialData[]): Promise<string[]> {
  const results: string[] = [];
  
  for (const credential of credentials) {
    try {
      const result = await generateCredentialPDF(credential);
      results.push(result);
    } catch (error) {
      console.error(`Error generando PDF para credencial ${credential.id}:`, error);
      results.push(`Error para credencial ${credential.id}: ${error}`);
    }
  }
  
  return results;
}