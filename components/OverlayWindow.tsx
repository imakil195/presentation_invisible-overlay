import React, { useRef, useState, useEffect } from 'react';
import { AppSettings, OverlayMode } from '../types';
import { GripHorizontal, X } from 'lucide-react';

interface OverlayWindowProps {
  settings: AppSettings;
  children: React.ReactNode;
  mode: OverlayMode;
}

export const OverlayWindow: React.FC<OverlayWindowProps> = ({ settings, children, mode }) => {
  // Determine if we are running in Electron
  const isElectron = typeof window !== 'undefined' && !!window.electron;

  // Simple custom drag implementation (Browser Fallback)
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isElectron || settings.isLocked) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Dynamic styles
  const containerStyle: React.CSSProperties = isElectron ? {
    width: '100%',
    height: '100%',
    opacity: settings.opacity,
  } : {
    left: position.x,
    top: position.y,
    opacity: settings.opacity,
    position: 'absolute',
    width: mode === OverlayMode.TIMER ? '300px' : '400px',
    height: mode === OverlayMode.TIMER ? '150px' : '500px',
  };

  return (
    <div
      ref={windowRef}
      style={containerStyle}
      className={`
        flex flex-col
        rounded-xl 
        border border-hud-border 
        bg-hud-bg 
        text-white 
        shadow-[0_0_15px_rgba(0,0,0,0.5)] 
        transition-opacity duration-200
        ${settings.isLocked ? 'pointer-events-none' : 'pointer-events-auto'}
        ${isElectron ? 'h-full w-full' : ''}
      `}
    >
      {/* Drag Handle */}
      {!settings.isLocked && (
        <div
          onMouseDown={handleMouseDown}
          style={isElectron ? { WebkitAppRegion: 'drag' } as any : undefined}
          className="h-6 w-full bg-gradient-to-r from-hud-bg via-gray-900 to-hud-bg cursor-move flex items-center justify-center rounded-t-xl hover:bg-white/5 transition-colors group relative"
        >
          <GripHorizontal size={16} className="text-gray-600 group-hover:text-gray-400" />
        </div>
      )}

      {/* Close Button (Absolute Positioned and OUTSIDE drag region) */}
      {!settings.isLocked && (
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.electron) {
              window.electron.closeApp();
            }
          }}
          className="absolute top-1 right-2 p-1 text-gray-500 hover:text-red-500 transition-colors z-[100] cursor-pointer"
          style={isElectron ? { WebkitAppRegion: 'no-drag' } as any : undefined}
          title="Close"
        >
          <X size={14} />
        </button>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Resize Handle Simulation (Visual Only for MVP) */}
      {!settings.isLocked && !isElectron && (
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-600 rounded-br cursor-se-resize opacity-50 hover:opacity-100" />
      )}
    </div>
  );
};