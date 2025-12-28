import { AppSettings } from '../types';

/**
 * In the real Electron app, these functions would emit events via ipcRenderer.send()
 * and listen for responses. Here we simulate the state changes locally.
 */

class MockNativeService {
  private settings: AppSettings;

  constructor() {
    this.settings = {
      opacity: 0.9,
      isLocked: false,
      fontSize: 14,
      alwaysOnTop: true,
      stealthMode: true
    };
  }

  async setWindowOpacity(opacity: number): Promise<void> {
    console.log(`[Native IPC] Setting window opacity to ${opacity}`);
    this.settings.opacity = opacity;
  }

  async setIgnoreMouseEvents(ignore: boolean): Promise<void> {
    // In Electron: win.setIgnoreMouseEvents(ignore, { forward: true })
    console.log(`[Native IPC] Mouse events ignored: ${ignore}`);
    this.settings.isLocked = ignore;
  }

  async setStealthMode(enabled: boolean): Promise<void> {
    // In Electron Main Process: 
    // win.setContentProtection(enabled);
    //
    // Platform specifics:
    // - Windows: Calls SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
    // - macOS: Sets NSWindowSharingTypeNone
    console.log(`[Native IPC] Stealth Mode (Capture Exclusion): ${enabled ? 'ENABLED' : 'DISABLED'}`);
    this.settings.stealthMode = enabled;
  }

  async toggleAlwaysOnTop(enabled: boolean): Promise<void> {
    console.log(`[Native IPC] Always On Top: ${enabled}`);
    this.settings.alwaysOnTop = enabled;
  }
}

export const nativeService = new MockNativeService();