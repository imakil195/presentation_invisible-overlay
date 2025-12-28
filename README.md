# Invisible Presenter Overlay (GhostDeck)

**A System-Level Desktop Application for Private Presentation Notes.**
*Completely invisible to audience during screen sharing.*

## 🚀 Core Features & Architecture

*   **Platform**: Electron (Windows & macOS).
*   **Invisibility Tech**:
    *   **Windows**: Uses `SetWindowDisplayAffinity` (via Electron `contentProtection`) to remove the window from DWM capture. **100% Invisible** in all screen sharing modes.
    *   **macOS**: Uses `NSWindowSharingTypeNone`. **Invisible** when sharing specific windows. *Note (OS Limitation): Shows as a black box if sharing the entire desktop screen.*
*   **Mode**: Always-on-top, click-through capable, keyboard-first.
*   **Stack**: React + TypeScript + Vite + TailwindCSS.

## 🛠 Project Structure

```
/
├── electron/
│   ├── main.ts           # Main Process (Window Mgmt, Native APIs)
│   └── preload.ts        # Secure IPC Bridge
├── src/
│   ├── components/       # React UI (Overlay, Controls)
│   ├── services/         # Native Integration Service
│   └── types/            # TypeScript Definitions
├── dist-electron/        # Compiled Main Process
├── packge.json           # Config & Scripts
└── vite.config.ts        # Build Configuration
```

## 🔧 Build & Run

### Prerequisites
*   Node.js 18+
*   npm

### Installation
```bash
npm install
```

### Development Mode
Runs the React renderer and Electron main process with HMR.
```bash
npm run dev
```

### Production Build
Compiles TypeScript, builds the renderer, builds the main process, and packages the app.
```bash
npm run build
```
*Output will happen in `release/` directory (e.g., `.dmg` for macOS, `.exe` for Windows).*

## 🏗 System Architecture

### 1. Invisibility Mechanism
The core requirement is met using the `setContentProtection` API in `electron/main.ts`:

```typescript
// Critical for invisibility
win.setContentProtection(true);
```
*   **Windows**: Maps to `SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)`. Use Windows 10 Version 2004 or later for best results.
*   **macOS**: Maps to `NSWindow.sharingType = NSWindowSharingTypeNone`.

### 2. IPC & Native Service
We use a mock-fallback strategy. The React app checks for `window.electron`.
*   **Development (Browser)**: Uses `mockNativeService` (simulated logs).
*   **Production (Electron)**: Uses real `ipcRenderer.invoke` calls to the Main process to control opacity, window level, and ignore mouse events.

### 3. Drag & Drop
*   **Native Drag**: Uses `-webkit-app-region: drag` on the handle for performance and system-window movement.
*   **Fallback**: Standard DOM event dragging for testing in browser.

## 🧠 Why This Is Hard (Technical Deep Dive)

Most "always-on-top" utilities fail at privacy because they are essentially just regular windows forcing themselves to the front (`HWND_TOPMOST`). Screen sharing software simply captures the entire framebuffer, including your "private" notes.

**GhostDeck is different because it intervenes at the OS Compositor level:**
1.  **Kernel/DWM Usage**: We instruct the OS Window Manager (DWM on Windows, WindowServer on macOS) to *exclude* our window's surface from any `BitBlt` or screen recording API calls.
2.  **Event Forwarding**: We implement "Click-Through" (`setIgnoreMouseEvents`) which requires hit-testing transparency pixels—a complex feature to get right across platforms while maintaining drag capability.
3.  **Z-Order Fighting**: Presentation software (Keynote/PowerPoint) often fights for the "topmost" Z-order. We utilize the `screen-saver` level (on macOS) and aggressive focus management to stay visible to *you* but invisible to the *audience*.

## ✅ Verification Checklist

Use this checklist to validate the "Invisibility" before a high-stakes presentation:

1.  **Launch GhostDeck**.
2.  **Toggle Visibility**: Press `Command/Control + Shift + H` to ensure hotkeys work.
3.  **Start a Dummy Meeting**: Open Zoom/Teams/Meet with yourself or a colleague.
4.  **Share Screen**:
    *   **Windows**: Share your "Entire Screen". Verify the overlay is NOT visible on the receiving end.
    *   **macOS**: Share a **Specific Window** (e.g., Chrome). Verify the overlay is NOT visible. *Warning: Sharing "Entire Desktop" on macOS will show a black box where the overlay is.*
5.  **Interaction Test**: Lock the overlay and click through it to change a slide in your deck.

## ⚠️ Known Limitations (macOS)
Due to Apple's security model, `setContentProtection` prevents the window from being captured, but the WindowServer replaces the excluded content with a black box if the *entire screen* is being recorded. To be truly invisible on macOS, you must share **specific application windows** (e.g., Keynote or Chrome) instead of "Whole Desktop".

## 🗺 Roadmap
- [ ] Windows Installer (NSIS) refinement.
- [ ] Auto-updater integration.
- [ ] Advanced "Click-through" that detects transparency.

## 🛡️ Security & Privacy

This application is designed with a "Local-First" and "Privacy-by-Default" architecture.

-   **Zero Network Usage:** The core application runs entirely offline.
-   **Content Protection:** Uses OS-level APIs (`SetWindowDisplayAffinity`, `NSWindowSharingTypeNone`) to prevent screen capture.
-   **Sandboxed Renderer:** The UI runs in a locked-down Electron sandbox with no Node.js access.
-   **Strict CSP:** Content Security Policy restricts resources to local files and specific cached CDNs (Tailwind/Fonts).
-   **Data Privacy:** No user data is collected, stored, or transmitted. All notes are in-memory (or local storage) only.
# presentation_invisible-overlay
