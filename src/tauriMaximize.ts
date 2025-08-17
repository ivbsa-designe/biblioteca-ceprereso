export async function maximizeWindow() {
  // Solo intenta maximizar si estamos en Tauri
  // @ts-expect-error - __TAURI__ is injected by Tauri runtime
  const isTauri = '__TAURI__' in window;
  if (!isTauri) return;
  try {
    // Import dinámico solo en Tauri
    const mod = await import('@tauri-apps/api/window');
    // @ts-expect-error - Dynamic import from Tauri API
    const appWindow = mod['appWindow'];
    if (appWindow && typeof appWindow.maximize === 'function') {
      await appWindow.maximize();
    }
  } catch {
    // Silenciar error si no está en entorno Tauri
  }
}
