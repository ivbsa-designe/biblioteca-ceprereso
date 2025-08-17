import { checkUserPermissions, showPermissionDeniedMessage } from '../permissions';

export function setupFormularioCredencial() {
  // Verificar permisos antes de configurar el formulario
  // Las credenciales están vinculadas a PPL, por lo que requieren permisos de PPL
  if (!checkUserPermissions('ppl_management')) {
    showPermissionDeniedMessage('gestionar credenciales');
    return;
  }
  
  console.log('Formulario de credenciales listo');
}
