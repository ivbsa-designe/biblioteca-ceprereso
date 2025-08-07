import { invoke } from '@tauri-apps/api/core';

export async function loginUsuario(usuario: string, password: string) {
  try {
    const result = await invoke('validar_login', { usuario, password });
    
    if (result && typeof result === 'object' && 'success' in result) {
      const response = result as { success: boolean; user?: any; message?: string };
      
      if (response.success && response.user) {
        return { 
          ok: true, 
          usuario: { 
            id: response.user.id, 
            nombre: response.user.usuario, 
            rol: response.user.rol 
          } 
        };
      } else {
        return { 
          ok: false, 
          error: response.message || "Credenciales incorrectas" 
        };
      }
    }
    
    return { ok: false, error: "Error en la respuesta del servidor" };
  } catch (error) {
    console.error('Error durante el login:', error);
    return { ok: false, error: "Error de conexión" };
  }
}
