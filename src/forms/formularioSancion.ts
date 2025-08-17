import { checkUserPermissions, showPermissionDeniedMessage } from '../permissions';

export function setupFormularioSancion() {
  // Verificar permisos antes de configurar el formulario
  if (!checkUserPermissions('sanctions')) {
    showPermissionDeniedMessage('gestionar sanciones');
    return;
  }
  
  console.log('Formulario de sanciones listo');
}
