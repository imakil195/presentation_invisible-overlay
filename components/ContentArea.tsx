import React, { useState, useEffect } from 'react';
import { AppSettings, OverlayMode, NoteItem } from '../types';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface ContentAreaProps {
  mode: OverlayMode;
  settings: AppSettings;
  notes: string;
  setNotes: (s: string) => void;
  checklist: NoteItem[];
  setChecklist: (items: NoteItem[]) => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  mode,
  settings,
  notes,
  setNotes,
  checklist,
  setChecklist
}) => {
  // Timer State
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Logic for Checklist
  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const addChecklistItem = () => {
    const newItem: NoteItem = {
      id: Date.now().toString(),
      content: 'New presentation cue',
      checked: false
    };
    setChecklist([...checklist, newItem]);
  };

  // ---- RENDERERS ----

  if (mode === OverlayMode.TIMER) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="text-6xl font-mono font-bold tracking-widest text-hud-accent drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
          {formatTime(time)}
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => { setIsRunning(false); setTime(0); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (mode === OverlayMode.CHECKLIST) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cues</h2>
          <button onClick={addChecklistItem} className="text-hud-accent hover:text-white transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto hud-scroll space-y-2">
          {checklist.length === 0 && (
            <div className="text-center text-gray-600 italic mt-8 text-xs">No cues. Use AI to generate or add manually.</div>
          )}
          {checklist.map(item => (
            <div key={item.id} className="flex items-center gap-3 group">
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-hud-success border-hud-success' : 'border-gray-600 hover:border-gray-400'}`}
              >
                {item.checked && <div className="w-2 h-2 bg-black rounded-[1px]" />}
              </button>
              <input
                value={item.content}
                onChange={(e) => setChecklist(checklist.map(i => i.id === item.id ? { ...i, content: e.target.value } : i))}
                className={`flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-sans ${item.checked ? 'text-gray-600 line-through' : 'text-gray-200'}`}
                style={{ fontSize: `${settings.fontSize}px` }}
              />
              <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT: NOTES MODE
  return (
    <div className="h-full relative flex flex-col">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-full bg-transparent resize-none border-none focus:ring-0 p-4 font-mono text-gray-200 outline-none leading-relaxed"
        placeholder="# Presentation Outline..."
        style={{ fontSize: `${settings.fontSize}px` }}
        spellCheck={false}
      />
    </div>
  );
};