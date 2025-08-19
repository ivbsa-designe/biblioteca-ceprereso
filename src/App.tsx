import * as React from 'react';
import { loginUsuario } from './apiUsuarios';
import Dashboard from './Dashboard';
import PDFExportComponent from './components/PDFExportComponent';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

export default function App() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState<string>('dashboard');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const usuarioInput = data.get('usuario') as string;
    const password = data.get('password') as string;
    const res = await loginUsuario(usuarioInput, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Error desconocido');
    } else if (res.usuario) {
      setUsuario(res.usuario);
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleBackToDashboard = () => {
    setCurrentSection('dashboard');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'pdfs':
        return (
          <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <IconButton onClick={handleBackToDashboard} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Volver al Dashboard
              </Typography>
            </Box>
            <PDFExportComponent />
          </Box>
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            usuario={usuario!}
            onLogout={() => setUsuario(null)}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (usuario) {
    return renderCurrentSection();
    return (
      <Dashboard
        usuario={usuario}
        onLogout={() => setUsuario(null)}
        onNavigate={() => {}}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        p: 0,
        m: 0,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1f1f1f 50%, #2a2a2a 75%, #1a1a1a 100%)`,
        backgroundSize: 'cover',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, #2c81b3ff 0%, transparent 30%), 
                      radial-gradient(circle at 90% 30%, #20d4d4 0%, transparent 70%),
                      radial-gradient(circle at 30% 30%, #2b14b1ff 0%, transparent 20%)`,
          opacity: 0.1,
          zIndex: 1,
        },
      }}
    >
      <CssBaseline />
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          border: 'none',
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          boxShadow: `
          0 0 60px rgba(48, 250, 240, 0.19),
          0 0 100px rgba(32, 212, 212, 0.2),
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
          backdropFilter: 'blur(20px) saturate(1.8)',
          minWidth: 380,
          maxWidth: 420,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          zIndex: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background:
              'linear-gradient(45deg, #242eb67c, #20d4d4a4, #20d4d4, #3936ee7e)',
            borderRadius: '26px',
            zIndex: -1,
            opacity: 0.8,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            mb: -1,
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
              'linear-gradient(135deg, #081642ff 0%, #275ac9ff 25%, #1645c7ff 50%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2,
            textShadow:
              '0 0 30px rgba(67, 176, 209, 0.5), 0 0 60px rgba(22, 99, 172, 0.3)',
            mb: 2,
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            fontSize: { xs: '2.5rem', sm: '3rem' },
            filter: 'drop-shadow(0 4px 8px rgba(114, 53, 255, 0.3))',
          }}
        >
          CEPRERESO
        </Typography>
        <Avatar
          sx={{
            m: 2,
            background: 'linear-gradient(120deg, #5beffa69 20%, #20d4d4c5 80%)',
            width: 80,
            height: 80,
            boxShadow: `
            0 0 80px rgba(32, 40, 161, 0.4),
            0 0 80px rgba(32, 212, 212, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.3)
          `,
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <LockOutlinedIcon
            sx={{
              fontSize: 40,
              color: '#fff',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            }}
          />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: 1,
            mb: 3,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Iniciar sesión
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="usuario"
            label="Usuario"
            name="usuario"
            autoComplete="username"
            autoFocus
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                background:
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                boxShadow: `
                  0 4px 20px rgba(0, 0, 0, 0.1),
                  0 1px 3px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.5)
                `,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: `
                    0 6px 30px rgba(53, 107, 255, 0.15),
                    0 2px 6px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6)
                  `,
                  '& fieldset': {
                    borderColor: 'rgba(56, 29, 156, 0.5)',
                  },
                },
                '&.Mui-focused': {
                  boxShadow: `
                    0 8px 40px rgba(97, 53, 255, 0.25),
                    0 3px 8px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.7)
                  `,
                  '& fieldset': {
                    borderColor: '#3d149cff',
                    borderWidth: '2px',
                  },
                },
                '& fieldset': {
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& input': {
                  color: '#2d2d2d',
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(45, 45, 45, 0.7)',
                fontFamily: 'Inter, sans-serif',
                '&.Mui-focused': {
                  color: '#2731c4ff',
                },
              },
              mb: 2,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                background:
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                boxShadow: `
                  0 4px 20px rgba(0, 0, 0, 0.1),
                  0 1px 3px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.5)
                `,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: `
                    0 6px 30px rgba(53, 255, 255, 0.15),
                    0 2px 6px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6)
                  `,
                  '& fieldset': {
                    borderColor: 'rgba(31, 178, 214, 0.5)',
                  },
                },
                '&.Mui-focused': {
                  boxShadow: `
                    0 8px 40px rgba(70, 217, 236, 0.25),
                    0 3px 8px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.7)
                  `,
                  '& fieldset': {
                    borderColor: '#69bbf1ff',
                    borderWidth: '2px',
                  },
                },
                '& fieldset': {
                  borderRadius: '16px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& input': {
                  color: '#3d3c3fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(103, 88, 119, 0.7)',
                fontFamily: 'Inter, sans-serif',
                '&.Mui-focused': {
                  color: '#45d6f0ff',
                },
              },
              mb: 3,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    tabIndex={-1}
                    sx={{
                      color: 'rgba(37, 46, 87, 0.6)',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#37b2bbff',
                        backgroundColor: 'rgba(53, 181, 255, 0.69)',
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography
              color="error"
              sx={{
                mt: 2,
                mb: 2,
                fontWeight: 600,
                textAlign: 'center',
                color: '#23bda8ff',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(18, 9, 68, 0.1)',
                border: '1px solid rgba(8, 94, 151, 0.3)',
              }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontFamily: 'Inter, sans-serif',
              color: '#fff',
              background:
                'linear-gradient(135deg, #1b2d928e 0%, #3a6edfff 50%, #20d4d4 100%)',
              boxShadow: `
                0 8px 24px rgba(51, 214, 236, 0.22),
                0 4px 16px rgba(32, 212, 212, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
              padding: '16px 32px',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                background:
                  'linear-gradient(135deg, #1caabd7a 0%, #38c5e9ff 50%, #1fb3b3 100%)',
                boxShadow: `
                  0 12px 48px rgba(34, 110, 223, 0.5),
                  0 6px 24px rgba(32, 212, 212, 0.4),
                  0 3px 12px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              '&:disabled': {
                background:
                  'linear-gradient(135deg, rgba(24, 123, 180, 0.5) 0%, rgba(87, 142, 224, 0.5) 50%, rgba(32, 212, 212, 0.5) 100%)',
                boxShadow: `
                  0 4px 16px rgba(79, 171, 224, 0.2),
                  0 2px 8px rgba(47, 120, 204, 0.1)
                `,
                transform: 'none',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
