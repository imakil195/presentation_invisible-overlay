export enum OverlayMode {
  NOTES = 'NOTES',
  CHECKLIST = 'CHECKLIST',
  TIMER = 'TIMER'
}

export interface AppSettings {
  opacity: number;
  isLocked: boolean;
  fontSize: number;
  alwaysOnTop: boolean;
  stealthMode: boolean; // Simulates the WDA_EXCLUDEFROMCAPTURE
}

export interface NoteItem {
  id: string;
  content: string;
  checked?: boolean;
}

export interface GeminiConfig {
  apiKey: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  opacity: 0.85,
  isLocked: false,
  fontSize: 14,
  alwaysOnTop: true,
  stealthMode: true
};