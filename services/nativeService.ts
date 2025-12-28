import { AppSettings } from '../types';

export const nativeService = {
    setWindowOpacity: (opacity: number) => {
        if (window.electron) {
            window.electron.setOpacity(opacity);
        } else {
            console.log(`[Mock] setWindowOpacity: ${opacity}`);
        }
    },

    setIgnoreMouseEvents: (ignore: boolean) => {
        if (window.electron) {
            window.electron.setIgnoreMouseEvents(ignore, { forward: true });
        } else {
            console.log(`[Mock] setIgnoreMouseEvents: ${ignore}`);
        }
    },

    setStealthMode: (enabled: boolean) => {
        // In real app, stealth mode is always on via setContentProtection inside main.ts
        // But we can log or trigger specific behavior if needed.
        if (window.electron) {
            // We could expose a specific toggler, but main process forces it.
            // For MVP, we assume it's always protected.
            // However, if we wanted to toggle, we'd add an IPC handler.
        } else {
            console.log(`[Mock] setStealthMode: ${enabled}`);
        }
    },

    toggleAlwaysOnTop: (enabled: boolean) => {
        if (window.electron) {
            window.electron.setAlwaysOnTop(enabled);
        } else {
            console.log(`[Mock] toggleAlwaysOnTop: ${enabled}`);
        }
    },

    closeApp: () => {
        if (window.electron) {
            window.electron.closeApp();
        }
    }
};
