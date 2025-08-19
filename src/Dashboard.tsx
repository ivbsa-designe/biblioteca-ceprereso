import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  LibraryBooks,
  Assignment,
  KeyboardReturn,
  Search,
  Settings,
  Person,
  TrendingUp,
  Logout,
  Dashboard as DashboardIcon,
  AccessTime,
  PictureAsPdf
} from '@mui/icons-material';

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface DashboardProps {
  usuario: Usuario;
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ usuario, onLogout, onNavigate }) => {
  // Opciones para operadores
  const operatorOptions = [
    { 
      title: 'Préstamos', 
      description: 'Gestionar préstamos de libros',
      icon: <Assignment sx={{ fontSize: 40 }} />, 
      color: '#06b6d4',
      section: 'prestamos'
    },
    { 
      title: 'Devoluciones', 
      description: 'Procesar devoluciones',
      icon: <KeyboardReturn sx={{ fontSize: 40 }} />, 
      color: '#10b981',
      section: 'devoluciones'
    },
    { 
      title: 'Consultas', 
      description: 'Buscar libros y usuarios',
      icon: <Search sx={{ fontSize: 40 }} />, 
      color: '#f59e0b',
      section: 'consultas'
    }
  ];
const Dashboard: React.FC<DashboardProps> = ({
  usuario,
  onLogout,
  onNavigate,
}) => {
  const isAdmin = usuario.rol === 'admin';

  // Opciones para administrador
  const adminOptions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      section: 'usuarios',
    },
    {
      title: 'Gestión de Libros',
      description: 'Agregar, editar y eliminar libros',
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      section: 'libros',
    },
    {
      title: 'Préstamos',
      description: 'Gestionar préstamos de libros',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#06b6d4',
      section: 'prestamos',
    },
    {
      title: 'Devoluciones',
      description: 'Procesar devoluciones',
      icon: <KeyboardReturn sx={{ fontSize: 40 }} />,
      color: '#10b981',
      section: 'devoluciones',
    },
    {
      title: 'Consultas',
      description: 'Buscar libros y usuarios',
      icon: <Search sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      section: 'consultas',
    },
    {
      title: 'Reportes',
      description: 'Estadísticas y reportes',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#ef4444',
      section: 'reportes',
    },
    { 
      title: 'Imprimir PDFs', 
      description: 'Credenciales y etiquetas en PDF',
      icon: <PictureAsPdf sx={{ fontSize: 40 }} />, 
      color: '#dc2626',
      section: 'pdfs'
    },
    { 
      title: 'Configuración del sistema', 
    {
      title: 'Configuración',
      description: 'Configuración del sistema',
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: '#64748b',
      section: 'configuracion',
    },
  ];

  // Opciones para operadores
  const operatorOptions = [
    {
      title: 'Préstamos',
      description: 'Gestionar préstamos de libros',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#06b6d4',
      section: 'prestamos',
    },
    {
      title: 'Devoluciones',
      description: 'Procesar devoluciones',
      icon: <KeyboardReturn sx={{ fontSize: 40 }} />,
      color: '#10b981',
      section: 'devoluciones',
    },
    {
      title: 'Consultas',
      description: 'Buscar libros y usuarios',
      icon: <Search sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      section: 'consultas',
    },
  ];

  const options = isAdmin ? adminOptions : operatorOptions;

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        p: 0,
        m: 0,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1f1f1f 50%, #2a2a2a 75%, #1a1a1a 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, #ff6b35 0%, transparent 50%), 
                      radial-gradient(circle at 80% 20%, #20d4d4 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, #ff8c42 0%, transparent 50%)`,
          opacity: 0.08,
          zIndex: 1,
        },
      }}
      className="dashboard-bg"
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          m: 3,
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
          0 0 40px rgba(255, 107, 53, 0.2),
          0 0 80px rgba(32, 212, 212, 0.15),
          0 8px 32px rgba(0, 0, 0, 0.3)
        `,
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #20d4d4 100%)',
                width: 64,
                height: 64,
                fontSize: '1.8rem',
                fontWeight: 700,
                boxShadow: `
                0 0 30px rgba(255, 107, 53, 0.4),
                0 0 60px rgba(32, 212, 212, 0.3),
                0 8px 16px rgba(0, 0, 0, 0.3)
              `,
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {usuario.nombre.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  mb: 1,
                }}
              >
                ¡Bienvenido, {usuario.nombre}!
              </Typography>
              <Chip
                label={isAdmin ? 'Administrador' : 'Operador'}
                sx={{
                  background: isAdmin
                    ? 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                    : 'linear-gradient(135deg, #20d4d4 0%, #48beb3 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: isAdmin
                    ? '0 4px 16px rgba(255, 107, 53, 0.3)'
                    : '0 4px 16px rgba(32, 212, 212, 0.3)',
                  border: 'none',
                }}
              />
            </Box>
          </Box>

          {/* Time Card - Estilo inspirado en tus capturas */}
          <Card
            sx={{
              background:
                'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #20d4d4 100%)',
              color: 'white',
              minWidth: 220,
              borderRadius: '20px',
              position: 'relative',
              boxShadow: `
              0 0 30px rgba(255, 107, 53, 0.4),
              0 0 60px rgba(32, 212, 212, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.3)
            `,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AccessTime sx={{ fontSize: 24, mb: 1, opacity: 0.9 }} />
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                {getCurrentTime()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  textTransform: 'capitalize',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                {getCurrentDate()}
              </Typography>
            </CardContent>
          </Card>

          <IconButton
            onClick={onLogout}
            sx={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
              color: '#ef4444',
              width: 56,
              height: 56,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.2) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 24px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Paper>

      {/* Welcome Message */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          m: 3,
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
          0 0 40px rgba(255, 107, 53, 0.2),
          0 0 80px rgba(32, 212, 212, 0.15),
          0 8px 32px rgba(0, 0, 0, 0.3)
        `,
          textAlign: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            mb: 1,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          sistema de biblioteca
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            background:
              'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2,
            textShadow:
              '0 0 30px rgba(255, 107, 53, 0.5), 0 0 60px rgba(255, 140, 66, 0.3)',
            mb: 3,
            fontFamily: 'Inter, sans-serif',
            fontSize: { xs: '2.5rem', sm: '3.5rem' },
            filter: 'drop-shadow(0 4px 8px rgba(255, 107, 53, 0.3))',
          }}
        >
          CEPRERESO
        </Typography>
        <DashboardIcon
          sx={{
            fontSize: 56,
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 2,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: 600,
            mx: 'auto',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Selecciona una opción para comenzar a trabajar con el sistema de
          gestión bibliotecaria
        </Typography>
      </Paper>

      {/* Options Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          p: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {options.map((option, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              borderRadius: '24px',
              background:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `
                0 4px 20px rgba(0, 0, 0, 0.1),
                0 1px 3px rgba(0, 0, 0, 0.1)
              `,
              '&:hover': {
                transform: 'translateY(-8px)',
                background:
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                boxShadow: `
                  0 0 40px ${option.color}40,
                  0 12px 48px rgba(0, 0, 0, 0.15),
                  0 4px 16px rgba(0, 0, 0, 0.1)
                `,
              },
            }}
            onClick={() => onNavigate(option.section)}
          >
            <CardContent
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${option.color}30, ${option.color}15)`,
                  border: `2px solid ${option.color}40`,
                  mb: 3,
                  color: option.color,
                  boxShadow: `
                    0 0 20px ${option.color}30,
                    0 8px 16px rgba(0, 0, 0, 0.1)
                  `,
                  mx: 'auto',
                }}
              >
                {option.icon}
              </Box>
              <Typography
                variant="h6"
                fontWeight="700"
                sx={{
                  mb: 2,
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {option.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5,
                }}
              >
                {option.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer Stats - Estilo minimalista */}
      <Paper
        elevation={0}
        sx={{
          m: 3,
          p: 4,
          borderRadius: '24px',
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
          0 0 40px rgba(255, 107, 53, 0.2),
          0 0 80px rgba(32, 212, 212, 0.15),
          0 8px 32px rgba(0, 0, 0, 0.3)
        `,
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, sans-serif',
                mb: 1,
              }}
            >
              1,247
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Libros Registrados
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{
                background: 'linear-gradient(135deg, #20d4d4 0%, #48beb3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, sans-serif',
                mb: 1,
              }}
            >
              89
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Préstamos Activos
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              fontWeight="800"
              sx={{
                background: 'linear-gradient(135deg, #ffa726 0%, #ff8c42 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, sans-serif',
                mb: 1,
              }}
            >
              156
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              Usuarios Registrados
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
