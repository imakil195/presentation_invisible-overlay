import React, { useState } from 'react';
import { AppSettings, OverlayMode } from '../types';
import { Settings, Eye, EyeOff, Type, CheckSquare, Clock, Power } from 'lucide-react';

interface ControlPanelProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  currentMode: OverlayMode;
  setMode: (mode: OverlayMode) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  updateSettings,
  currentMode,
  setMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-hud-accent/20 transition-colors z-50 backdrop-blur-sm"
        title="Open Controls"
      >
        <Settings size={16} />
      </button>
    );
  }

  return (
    <div className="absolute top-2 right-2 w-64 bg-hud-bg/95 border border-hud-border rounded-lg shadow-2xl z-50 p-4 text-xs text-gray-300 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white uppercase tracking-wider">Overlay Controls</h3>
        <button onClick={() => setIsOpen(false)} className="hover:text-white">✕</button>
      </div>

      {/* Modes */}
      <div className="flex gap-2 mb-4 bg-black/40 p-1 rounded-md">
        <button
          onClick={() => setMode(OverlayMode.NOTES)}
          className={`flex-1 flex justify-center py-1 rounded ${currentMode === OverlayMode.NOTES ? 'bg-hud-border text-white' : 'hover:bg-white/5'}`}
        >
          <Type size={14} />
        </button>
        <button
          onClick={() => setMode(OverlayMode.CHECKLIST)}
          className={`flex-1 flex justify-center py-1 rounded ${currentMode === OverlayMode.CHECKLIST ? 'bg-hud-border text-white' : 'hover:bg-white/5'}`}
        >
          <CheckSquare size={14} />
        </button>
        <button
          onClick={() => setMode(OverlayMode.TIMER)}
          className={`flex-1 flex justify-center py-1 rounded ${currentMode === OverlayMode.TIMER ? 'bg-hud-border text-white' : 'hover:bg-white/5'}`}
        >
          <Clock size={14} />
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-4">

        {/* Opacity */}
        <div>
          <label className="block mb-1 text-gray-500">Opacity: {Math.round(settings.opacity * 100)}%</label>
          <input
            type="range"
            min="20"
            max="100"
            value={settings.opacity * 100}
            onChange={(e) => updateSettings({ opacity: Number(e.target.value) / 100 })}
            className="w-full accent-hud-accent h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block mb-1 text-gray-500">Font Size: {settings.fontSize}px</label>
          <input
            type="range"
            min="10"
            max="32"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
            className="w-full accent-hud-accent h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div>
          <button
            onClick={() => updateSettings({ stealthMode: !settings.stealthMode })}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded border ${settings.stealthMode ? 'border-hud-success text-hud-success bg-hud-success/10' : 'border-gray-700 text-gray-500'}`}
          >
            {settings.stealthMode ? <EyeOff size={14} /> : <Eye size={14} />}
            {settings.stealthMode ? 'Stealth ON' : 'Visible'}
          </button>
        </div>



        {/* Quit Application */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.electron) {
              window.electron.closeApp();
            }
          }}
          className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors text-xs uppercase tracking-widest"
        >
          <Power size={14} />
          Quit App
        </button>

      </div>
    </div>
  );
};