// Utilidad para manejo de permisos de usuario

export type UserAction = 'book_management' | 'ppl_management' | 'sanctions' | 'reports_export';

export interface Usuario {
  id: number;
  nombre: string;
  rol: 'admin' | 'bibliotecario';
}

// Función para verificar permisos de usuario
export function checkUserPermissions(action: UserAction): boolean {
  try {
    // Obtener el usuario actual del session storage
    const currentUserData = sessionStorage.getItem('currentUser');
    if (!currentUserData) {
      return false;
    }
    
    const currentUser: Usuario = JSON.parse(currentUserData);
    
    if (currentUser.rol === 'admin') {
      return true; // Admin puede hacer todo
    }
    
    if (currentUser.rol === 'bibliotecario') {
      // Bibliotecario NO puede:
      // - Gestionar libros (registrar/eliminar)
      // - Gestionar PPL (registrar/eliminar)  
      // - Aplicar sanciones
      // - Exportar reportes
      switch (action) {
        case 'book_management':
        case 'ppl_management':
        case 'sanctions':
        case 'reports_export':
          return false;
        default:
          return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return false;
  }
}

// Función para obtener el usuario actual
export function getCurrentUser(): Usuario | null {
  try {
    const currentUserData = sessionStorage.getItem('currentUser');
    if (!currentUserData) {
      return null;
    }
    return JSON.parse(currentUserData);
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
}

// Función para mostrar mensaje de permisos insuficientes
export function showPermissionDeniedMessage(action: string): void {
  alert(`No tienes permisos para ${action}. Solo los administradores pueden realizar esta acción.`);
}