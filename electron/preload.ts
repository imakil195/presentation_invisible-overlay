import { ipcRenderer, contextBridge } from 'electron';

// --------------------------------------------------
// EXPOSED API
// --------------------------------------------------

contextBridge.exposeInMainWorld('electron', {
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
        ipcRenderer.invoke('set-ignore-mouse-events', ignore, options),

    setAlwaysOnTop: (flag: boolean) =>
        ipcRenderer.invoke('set-always-on-top', flag),

    setOpacity: (opacity: number) =>
        ipcRenderer.invoke('set-opacity', opacity),

    closeApp: () =>
        ipcRenderer.invoke('close-app'),

    // Additional utilities
    platform: process.platform,
});
