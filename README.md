# KickNoSub 🔓

> **Kick Subscriber-Only VOD Unlocker** — A powerful, lightweight Chrome / Chromium browser extension that unlocks and plays subscriber-only VODs and past broadcasts on **Kick.com** seamlessly inside your browser.

---

## ✨ Features

- **Instant Paywall Bypass:** Zero-delay detection via targeted container scanning and SPA route hooks (`pushState`/`replaceState`).
- **Seamless Theater Mode:** Immersive edge-to-edge layout with video and synchronized chat side-by-side, without black screen issues.
- **Picture-in-Picture (PiP):** Detach and pop out the video to watch while browsing other tabs or apps.
- **Continuous VOD Chat Replay:** Continuous, real-time synchronized VOD chat stream using Kick's official history timeline API, preventing chat freezes or dropouts.
- **Collapsible Replay Chat:** Synchronized VOD chat replay with toggle control and responsive font sizing.
- **Quick Seek Buttons:** Dedicated 10-second rewind & forward buttons alongside visual seek indicators.
- **Speed Controls & Hotkeys:** Cycle speeds from 0.5x up to 2.0x via on-screen menu or instant `<` and `>` keyboard shortcuts.
- **Toast Notifications:** Modern floating toasts confirming player actions, speed adjustments, and mode toggles.
- **Embedded HLS Player:** High-performance video player powered by `hls.js`, supporting multi-quality playback (1080p60, 720p, 480p, 360p, Auto).
- **Direct Stream Extraction:** Quick-action button to copy the direct `.m3u8` master manifest URL for VLC, mpv, or external downloading.
- **Background Service Worker Pipeline:** Parallel stream resolution and session minting without compromising browser performance.

---

## 🚀 How to Install & Use (Step-by-Step)

### Option 1: Direct Download (Easiest)

1. Click the green **Code** button at the top of this repository, then select **Download ZIP**.
2. Extract the downloaded ZIP file to any folder on your computer.
3. Open your browser:
   - **Google Chrome:** go to `chrome://extensions`
   - **Microsoft Edge:** go to `edge://extensions`
   - **Brave Browser:** go to `brave://extensions`
   - **Opera / Other Chromium browsers:** go to your extensions settings.
4. Enable **Developer mode** by toggling the switch in the top-right corner.
5. Click the **Load unpacked** button in the top-left corner.
6. Select the extracted `KickNoSub` folder (the folder containing `manifest.json`).
7. **Done!** The extension is now installed.

### Option 2: Clone with Git

```bash
git clone https://github.com/2saleh1/KickNoSub.git
```
Then load the folder via `chrome://extensions` as shown above.

---

## 🎬 How to Use

1. Navigate to **[Kick.com](https://kick.com)** and find any channel.
2. Go to the **Videos** tab and open any subscriber-only past broadcast / VOD.
3. The extension will automatically detect the restricted broadcast, unlock the stream, and replace the paywall with the high-definition player.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` or `K` | Play / Pause |
| `F` | Toggle Fullscreen |
| `T` or `Alt+T` | Toggle Theater Mode |
| `P` | Toggle Picture-in-Picture (PiP) |
| `C` | Toggle Chat (Collapse / Expand) |
| `>` or `.` | Increase Playback Speed |
| `<` or `,` | Decrease Playback Speed |
| `Esc` | Exit Theater Mode / Fullscreen |
| `M` | Mute / Unmute |
| `←` / `→` | Seek 5 seconds backward / forward |
| `J` / `L` | Seek 10 seconds backward / forward |
| `↑` / `↓` | Volume Up / Down (10%) |
| `0` - `9` | Jump to 0% - 90% of the video duration |

---

## ⚠️ Disclaimer

This project is created strictly for **educational and research purposes**. It demonstrates how HTTP Live Streaming (HLS) manifests, browser extensions, and web APIs function. Please support creators and subscribe to their channels.
