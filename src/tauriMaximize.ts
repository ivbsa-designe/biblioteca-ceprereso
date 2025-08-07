// @ts-ignore

export async function maximizeWindow() {
  // Solo intenta maximizar si estamos en Tauri
  // @ts-ignore
  const isTauri = '__TAURI__' in window;
  if (!isTauri) return;
  try {
    // Import dinámico solo en Tauri
    const mod = await import('@tauri-apps/api/window');
    // @ts-ignore
    const appWindow = mod['appWindow'];
    if (appWindow && typeof appWindow.maximize === 'function') {
      await appWindow.maximize();
    }
  } catch (e) {
    // Silenciar error si no está en entorno Tauri
  }
}
