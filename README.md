# KickNoSub 🔓

> **Kick Subscriber-Only VOD Unlocker** — A powerful, lightweight Chrome / Chromium browser extension that unlocks and plays subscriber-only VODs and past broadcasts on **Kick.com** seamlessly inside your browser.

---

## ✨ Features

- **Instant Paywall Bypass:** Automatically detects and removes subscriber-only overlay paywalls on Kick VODs.
- **Embedded HLS Player:** High-performance video player powered by `hls.js`, supporting multi-quality playback (1080p60, 720p, 480p, 360p, Auto).
- **Full Player Controls:** Smooth scrubbing timeline, volume slider, keyboard shortcuts (Space, F for fullscreen, M for mute, arrow keys for seeking).
- **Direct Stream Extraction:** Quick-action button to copy the direct `.m3u8` master manifest URL for VLC, mpv, or external downloading.
- **Background Service Worker Pipeline:** Efficient stream resolution and session minting without compromising browser performance.

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
| `M` | Mute / Unmute |
| `←` / `→` | Seek 5 seconds backward / forward |
| `J` / `L` | Seek 10 seconds backward / forward |
| `↑` / `↓` | Volume Up / Down (10%) |
| `0` - `9` | Jump to 0% - 90% of the video duration |

---

## ⚠️ Disclaimer

This project is created strictly for **educational and research purposes**. It demonstrates how HTTP Live Streaming (HLS) manifests, browser extensions, and web APIs function. Please support creators and subscribe to their channels.
