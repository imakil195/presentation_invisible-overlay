import { app, BrowserWindow, ipcMain, screen, globalShortcut, Menu } from 'electron';
import path from 'path';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Renderer
//
process.env.DIST_ELECTRON = path.join(__dirname, '..');
process.env.DIST = path.join(process.env.DIST_ELECTRON, 'dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, 'public')
  : process.env.DIST;

let win: BrowserWindow | null = null;
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  win = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 450,
    y: 50,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'), // scalable-placeholder
    frame: false,
    // transparent: false,
    // backgroundColor: '#FFFFFF',
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true, // Don't show in taskbar for stealth
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true, // HARDENING: Enable Sandbox
    },
  });

  // Open DevTools for debugging
  // win.webContents.openDevTools();

  // --------------------------------------------------
  // HARDENING: Navigation Blocking
  // --------------------------------------------------
  // Prevent any new windows from being created (e.g. target="_blank")
  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs (e.g. drag & drop, accidental links)
  win.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
  });

  // --------------------------------------------------
  // CORE INVISIBILITY FEATURE
  // --------------------------------------------------
  // Windows: WDA_EXCLUDEFROMCAPTURE (Total invisibility)
  // macOS: NSWindowSharingTypeNone (Invisible unless whole screen shared)
  win.setContentProtection(true);

  // Set level to floating or screen-saver to be above Keynote/PPT
  win.setAlwaysOnTop(true, 'screen-saver');

  // Make click-through by default? No, start interactable.
  win.setIgnoreMouseEvents(false);

  // Test actively pushing to top
  // setInterval(() => {
  //   if (win) win.moveTop();
  // }, 2000);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  win = null;
  // Don't quit on macOS
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus if user tries to open again
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});


app.whenReady().then(() => {
  createWindow();

  // Register Global Shortcut to toggle visibility/focus
  // CommandOrControl+Shift+H
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    }
  });
});


// --------------------------------------------------
// IPC HANDLERS (HARDENED)
// --------------------------------------------------

ipcMain.handle('set-ignore-mouse-events', (event, ignore, options) => {
  // HARDENING: Input Validation
  if (typeof ignore !== 'boolean') return;

  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  win.setIgnoreMouseEvents(ignore, options);
});

ipcMain.handle('set-always-on-top', (event, flag) => {
  // HARDENING: Input Validation
  if (typeof flag !== 'boolean') return;

  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  win.setAlwaysOnTop(flag, 'screen-saver');
});

ipcMain.handle('set-opacity', (event, opacity) => {
  // HARDENING: Input Validation
  if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) return;

  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  win.setOpacity(opacity);
});

ipcMain.handle('close-app', () => {
  app.quit();
});
