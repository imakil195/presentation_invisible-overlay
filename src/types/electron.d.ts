export interface ElectronAPI {
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => Promise<void>;
    setAlwaysOnTop: (flag: boolean) => Promise<void>;
    setOpacity: (opacity: number) => Promise<void>;
    closeApp: () => Promise<void>;
    platform: string;
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
