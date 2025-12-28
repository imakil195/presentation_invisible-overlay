import React, { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS, OverlayMode, NoteItem } from './types';
import { OverlayWindow } from './components/OverlayWindow';
import { ControlPanel } from './components/ControlPanel';
import { ContentArea } from './components/ContentArea';
import { nativeService } from './services/nativeService';

const App: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<OverlayMode>(OverlayMode.NOTES);
  const [notes, setNotes] = useState<string>(`# Presentation Notes
 
 **Toggle Visibility:** Command+Shift+H
 
 - [ ] Point 1
 - [ ] Point 2
 `);
  const [checklist, setChecklist] = useState<NoteItem[]>([
    { id: '1', content: 'Intro: Welcome everyone', checked: false },
    { id: '2', content: 'Slide 1: Market Analysis', checked: false },
    { id: '3', content: 'Slide 2: Q3 Revenue', checked: false },
    { id: '4', content: 'Closing: Call to Action', checked: false },
  ]);

  // Sync settings with "native" service
  useEffect(() => {
    nativeService.setWindowOpacity(settings.opacity);
    nativeService.setIgnoreMouseEvents(settings.isLocked);
    nativeService.setStealthMode(settings.stealthMode);
    nativeService.toggleAlwaysOnTop(settings.alwaysOnTop);
  }, [settings]);

  return (
    <div className="w-full h-screen relative overflow-hidden">

      {/* Background info removed for Production Build */}

      {/* The Actual Application Overlay */}
      <OverlayWindow settings={settings} mode={mode}>
        <ControlPanel
          settings={settings}
          updateSettings={(newS) => setSettings({ ...settings, ...newS })}
          currentMode={mode}
          setMode={setMode}
        />
        <ContentArea
          mode={mode}
          settings={settings}
          notes={notes}
          setNotes={setNotes}
          checklist={checklist}
          setChecklist={setChecklist}
        />
      </OverlayWindow>
    </div>
  );
};

export default App;