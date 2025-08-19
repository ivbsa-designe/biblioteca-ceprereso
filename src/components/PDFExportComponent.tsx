import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Snackbar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  PictureAsPdf,
  Badge,
  LocalLibrary
} from '@mui/icons-material';
import { generateCredentialPDF, generateBookLabelPDF, CredentialData, BookData } from '../pdf/pdfExport';

const PDFExportComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estados para credencial de prueba
  const [credentialData, setCredentialData] = useState<CredentialData>({
    id: 'A1-B2-C3-001',
    nombre: 'Juan Carlos',
    apellido: 'Pérez González',
    foto_path: undefined
  });

  // Estados para etiqueta de libro de prueba
  const [bookData, setBookData] = useState<BookData>({
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    ubicacion: 'Estante 1-A'
  });

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleGenerateCredentialPDF = async () => {
    setLoading(true);
    try {
      const result = await generateCredentialPDF(credentialData);
      showAlert(result, 'success');
    } catch (error) {
      showAlert(`Error: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBookLabelPDF = async () => {
    setLoading(true);
    try {
      const result = await generateBookLabelPDF(bookData);
      showAlert(result, 'success');
    } catch (error) {
      showAlert(`Error: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: '#1f2937',
        fontWeight: 'bold',
        mb: 3
      }}>
        <PictureAsPdf sx={{ mr: 2, verticalAlign: 'middle' }} />
        Exportación de PDFs
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Sección Credenciales */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#374151',
                mb: 2
              }}>
                <Badge sx={{ mr: 1 }} />
                Credenciales PPL
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="ID PPL"
                  value={credentialData.id}
                  onChange={(e) => setCredentialData({ ...credentialData, id: e.target.value })}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Nombre"
                  value={credentialData.nombre}
                  onChange={(e) => setCredentialData({ ...credentialData, nombre: e.target.value })}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  value={credentialData.apellido}
                  onChange={(e) => setCredentialData({ ...credentialData, apellido: e.target.value })}
                  margin="normal"
                  size="small"
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateCredentialPDF}
                disabled={loading}
                sx={{
                  backgroundColor: '#dc2626',
                  '&:hover': {
                    backgroundColor: '#b91c1c'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generar Credencial PDF'}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Genera una credencial en PDF con:
                • Nombre completo y ID del PPL
                • Código de barras Code128
                • Espacio para foto
                • Fecha de emisión
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Sección Etiquetas de Libros */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#374151',
                mb: 2
              }}>
                <LocalLibrary sx={{ mr: 1 }} />
                Etiquetas de Libros
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="ID Libro"
                  type="number"
                  value={bookData.id}
                  onChange={(e) => setBookData({ ...bookData, id: parseInt(e.target.value) || 1 })}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Título"
                  value={bookData.titulo}
                  onChange={(e) => setBookData({ ...bookData, titulo: e.target.value })}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Autor"
                  value={bookData.autor}
                  onChange={(e) => setBookData({ ...bookData, autor: e.target.value })}
                  margin="normal"
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Ubicación"
                  value={bookData.ubicacion}
                  onChange={(e) => setBookData({ ...bookData, ubicacion: e.target.value })}
                  margin="normal"
                  size="small"
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateBookLabelPDF}
                disabled={loading}
                sx={{
                  backgroundColor: '#7c3aed',
                  '&:hover': {
                    backgroundColor: '#6d28d9'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generar Etiqueta PDF'}
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Genera una etiqueta en PDF con:
                • Título y autor del libro
                • ID y ubicación
                • Código de barras Code128
                • Formato compacto para imprimir
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Información adicional */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información sobre códigos de barras
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los PDFs generados incluyen códigos de barras en formato Code128, que son escaneables con cualquier lector 
            de códigos de barras estándar. Los códigos contienen el ID del PPL para credenciales y el ID del libro para etiquetas.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Los archivos se guardan en la ubicación que selecciones usando el diálogo de archivos del sistema.
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar para alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PDFExportComponent;