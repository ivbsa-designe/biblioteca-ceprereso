/**
 * Test script for Barcode Generation
 */

// Simple barcode generation function
function generarCodigoBarras(idLibro) {
  // Implementación básica de código de barras en formato Code 128
  // En una implementación real, se usaría una librería como JsBarcode
  
  // Por ahora, retornamos una representación simple
  const barras = idLibro
    .split('')
    .map(char => {
      // Convertir cada carácter a una representación de barras
      const codigo = char.charCodeAt(0);
      return '|'.repeat(codigo % 5 + 1) + ' '.repeat(2);
    })
    .join('');
  
  return `|||| ${barras} ||||`;
}

async function exportarCodigoBarrasLibro(idLibro) {
  try {
    // Simular datos del libro
    const libro = {
      id: idLibro,
      titulo: 'Libro de Prueba',
      autor: 'Autor de Prueba'
    };
    
    const codigoBarras = generarCodigoBarras(idLibro);
    
    // Retornar información completa para la etiqueta
    return `
ID: ${idLibro}
Título: ${libro.titulo}
Autor: ${libro.autor}

${codigoBarras}
    `.trim();
    
  } catch (error) {
    throw new Error(`Error al generar código de barras: ${error?.message || error}`);
  }
}

// Test de generación de códigos de barras
async function testBarcode() {
  console.log('📊 Probando generación de códigos de barras\n');
  
  const idsEjemplo = ['A101', 'B205', 'C434', 'D199', 'Z999'];
  
  for (const id of idsEjemplo) {
    console.log(`📋 Generando código de barras para: ${id}`);
    try {
      const etiqueta = await exportarCodigoBarrasLibro(id);
      console.log('📄 Etiqueta generada:');
      console.log('┌' + '─'.repeat(50) + '┐');
      etiqueta.split('\n').forEach(linea => {
        console.log('│ ' + linea.padEnd(48) + ' │');
      });
      console.log('└' + '─'.repeat(50) + '┘\n');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('✅ Prueba de códigos de barras completada!');
}

// Ejecutar test
testBarcode();