import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';

// Simulación de consulta a la BD (reemplazar por fetch real)
const fetchMetricas = async () => {
  // Aquí deberías consultar la BD real
  return [
    { label: 'Libros', value: 1200 },
    { label: 'Usuarios', value: 350 },
    { label: 'Préstamos activos', value: 45 },
    { label: 'Sanciones', value: 7 },
  ];
};

const fetchUsuario = async () => {
  // Aquí deberías consultar la sesión/usuario real
  return {
    nombre: 'Juan Pérez',
    rol: 'Administrador',
    correo: 'juan.perez@ceprereso.mx',
  };
};

const Dashboard: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [metricas, setMetricas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUsuario(), fetchMetricas()]).then(([u, m]) => {
      setUsuario(u);
      setMetricas(m);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    // Aquí iría la lógica real de logout
    alert('Sesión cerrada');
  };

  const handleNavigate = (ruta: string) => {
    // Aquí iría la navegación real
    alert(`Navegar a: ${ruta}`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, background: '#f5f6fa', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ width: 64, height: 64 }}>
              {usuario.nombre[0]}
            </Avatar>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Bienvenido, {usuario.nombre}</Typography>
            <Typography color="text.secondary">Rol: {usuario.rol}</Typography>
            <Typography color="text.secondary">Correo: {usuario.correo}</Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {metricas.map((m) => (
          <Grid item xs={12} sm={6} md={3} key={m.label}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{m.label}</Typography>
              <Typography variant="h4" color="primary">{m.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>Acciones rápidas</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" onClick={() => handleNavigate('libros')}>Libros</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" onClick={() => handleNavigate('usuarios')}>Usuarios</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" onClick={() => handleNavigate('prestamos')}>Préstamos</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" onClick={() => handleNavigate('sanciones')}>Sanciones</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
