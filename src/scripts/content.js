console.log("Kick Unlocker: Content script loaded (v20.3 - Numerical Channel ID Pipeline)");

let activeHls = null;
let isUnlocking = false;
let latestReleasePromise = null;
let activePlayerUi = null;
let activeChatController = null;
let globalPlayerListenersBound = false;

// --- SVG ICONS ---
const ICONS = {
    play: `<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:white;"><path d="M8 5v14l11-7z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:white;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
    maximize: `<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:white;"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:white;"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L5.09 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6-3.6 3.6z"/></svg>`,
    update: `<svg width="98" height="96" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;"><g clip-path="url(#clip0_730_27136)"><path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="white"/></g><defs><clipPath id="clip0_730_27136"><rect width="98" height="96" fill="white"/></clipPath></defs></svg>`,
    bigPlay: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;width:40px;height:40px;"><path fill="none" d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>`,
    backward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path d="M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z"/><path d="M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z"/></svg>`,
    forward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path d="M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z"/><path d="M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z"/></svg>`,
    volumeHigh: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path fill="none" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6m3.364 3.364a9 9 0 0 0 0-12.728"/></svg>`,
    volumeMedium: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path fill="none" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6"/></svg>`,
    volumeLow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;"><path fill="none" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/></svg>`,
    theater: `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/><rect x="6.5" y="8" width="9" height="8" rx="1" fill="#53fc18"/></svg>`,
    pip: `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/><rect x="12" y="8" width="6" height="4" rx="0.5" fill="#53fc18"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:white;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    rewind10: `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M12.5 3a9 9 0 0 0-8.5 6.1L2.1 7.2A1 1 0 0 0 .7 8.6l3 3a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0-1.4-1.4l-1.8 1.8A7 7 0 1 1 5.5 12a1 1 0 0 0-2 0 9 9 0 1 0 9-9z"/><text x="12" y="15.5" font-size="8" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">10</text></svg>`,
    forward10: `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M11.5 3a9 9 0 0 1 8.5 6.1l1.9-1.9a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4l1.8 1.8A7 7 0 1 0 18.5 12a1 1 0 0 1 2 0 9 9 0 1 1-9-9z"/><text x="12" y="15.5" font-size="8" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">10</text></svg>`
};

function getResumeKey(channelSlug, videoSlug) {
    return `kick_unlocker_resume:${channelSlug}:${videoSlug}`;
}

function getPlayerSettingsKey(channelSlug, videoSlug) {
    return `kick_unlocker_settings:${channelSlug}:${videoSlug}`;
}

function loadPlayerSettings(settingsKey) {
    try {
        const raw = localStorage.getItem(settingsKey);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function savePlayerSettings(settingsKey, partialSettings) {
    const currentSettings = loadPlayerSettings(settingsKey);
    localStorage.setItem(settingsKey, JSON.stringify({
        ...currentSettings,
        ...partialSettings
    }));
}

function normalizeVersion(version) {
    return String(version || '')
        .trim()
        .replace(/^v/i, '')
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map((part) => parseInt(part, 10));
}

function isVersionGreater(candidateVersion, currentVersion) {
    const candidateParts = normalizeVersion(candidateVersion);
    const currentParts = normalizeVersion(currentVersion);
    const maxLength = Math.max(candidateParts.length, currentParts.length);

    for (let index = 0; index < maxLength; index++) {
        const candidate = candidateParts[index] || 0;
        const current = currentParts[index] || 0;
        if (candidate > current) return true;
        if (candidate < current) return false;
    }

    return false;
}

function getLatestReleaseInfo() {
    if (latestReleasePromise) return latestReleasePromise;

    latestReleasePromise = new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'GET_LATEST_RELEASE' }, (response) => {
            if (chrome.runtime.lastError) {
                resolve(null);
                return;
            }

            const release = response?.release;
            const currentVersion = chrome.runtime.getManifest().version;

            if (release?.tagName && release?.htmlUrl && isVersionGreater(release.tagName, currentVersion)) {
                resolve(release);
                return;
            }

            resolve(null);
        });
    });

    return latestReleasePromise;
}

async function fetchJson(url) {
    // 1. Try background service worker first
    try {
        const bgData = await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(undefined), 3000);
            chrome.runtime.sendMessage({ action: "FETCH_JSON", url: url }, (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError || !response) resolve(undefined);
                else resolve(response.data);
            });
        });
        if (bgData !== undefined && bgData !== null) {
            return bgData;
        }
    } catch (e) {}

    // 2. Direct fetch fallback from page
    try {
        const res = await fetch(url, {
            headers: { 'Accept': 'application/json, text/plain, */*' }
        });
        if (res.ok || res.status === 403) {
            return await res.json();
        }
    } catch (e) {}

    return null;
}

function checkStreamUrl(url) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(null), 3000);
        chrome.runtime.sendMessage({ action: "CHECK_STREAM_URL", url: url }, (response) => {
            clearTimeout(timeout);
            if (chrome.runtime.lastError) resolve(null);
            else resolve(response && response.valid ? url : null);
        });
    });
}

function parseUtcDate(value) {
    if (!value) return null;
    let text = String(value).replace(' ', 'T');
    if (!text.endsWith('Z')) text += 'Z';
    const date = new Date(text);
    return isNaN(date.getTime()) ? null : date;
}

function extractIvsIdentifiers(video) {
    const candidates = [];
    if (!video) return candidates;
    const thumbCandidates = [
        video.thumbnail,
        video.thumbnail?.src,
        video.thumbnail?.url,
        video.thumb,
        video.livestream?.thumbnail,
        video.livestream?.thumb,
        video.video?.thumbnail,
        video.video?.thumb
    ];
    for (const item of thumbCandidates) {
        const src = typeof item === 'string' ? item : (item?.src || item?.url || '');
        if (!src) continue;
        const parts = src.split('/');
        const ivsIndex = parts.indexOf('ivs');
        if (ivsIndex !== -1 && parts[ivsIndex + 1] === 'v1' && parts[ivsIndex + 2] && parts[ivsIndex + 3]) {
            candidates.push({ cid: parts[ivsIndex + 2], vid: parts[ivsIndex + 3] });
        }
        const thumbIdx = parts.indexOf('video_thumbnails');
        if (thumbIdx !== -1 && parts[thumbIdx + 1] && parts[thumbIdx + 2]) {
            const cid = parts[thumbIdx + 1];
            const vid = parts[thumbIdx + 2];
            if (/^[0-9A-Za-z_-]{8,}$/.test(cid) && /^[0-9A-Za-z_-]{8,}$/.test(vid)) {
                candidates.push({ cid, vid });
            }
        }
    }
    return candidates.filter((item, index, self) =>
        index === self.findIndex((t) => t.cid === item.cid && t.vid === item.vid)
    );
}

function thumbnailHasIvsPath(video) {
    return extractIvsIdentifiers(video).length > 0;
}

function mintPlaybackUrl(videoId, channelSlug) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(null), 3500);
        chrome.runtime.sendMessage({
            action: 'MINT_PLAYBACK',
            videoId: videoId,
            urlPath: `/${channelSlug || 'channel'}/videos/${videoId}`
        }, (response) => {
            clearTimeout(timeout);
            if (chrome.runtime.lastError || !response) resolve(null);
            else resolve(response.vod || null);
        });
    });
}

function bindGlobalPlayerListeners() {
    if (globalPlayerListenersBound) return;

    document.addEventListener('click', (event) => {
        const qualWrap = activePlayerUi?.qualWrap;
        if (qualWrap && qualWrap.isConnected && !qualWrap.contains(event.target)) {
            qualWrap.classList.remove('open');
        }
        const speedWrap = activePlayerUi?.speedWrap;
        if (speedWrap && speedWrap.isConnected && !speedWrap.contains(event.target)) {
            speedWrap.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (event) => {
        const playerUi = activePlayerUi;
        const videoElement = playerUi?.vid;
        if (!videoElement || !videoElement.isConnected || !isFinite(videoElement.duration)) return;

        const target = event.target;
        const tagName = target?.tagName;
        if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tagName)) return;

        const key = event.key;

        if (key === ' ' || key === 'k' || key === 'K') {
            event.preventDefault();
            playerUi.togglePlay?.();
        } else if (key === 'f' || key === 'F') {
            event.preventDefault();
            playerUi.toggleFullscreen?.();
        } else if (key === 't' || key === 'T' || (event.altKey && (key === 't' || key === 'T'))) {
            event.preventDefault();
            playerUi.toggleTheater?.();
        } else if (key === 'p' || key === 'P') {
            event.preventDefault();
            playerUi.togglePiP?.();
        } else if (key === 'c' || key === 'C') {
            event.preventDefault();
            playerUi.toggleChat?.();
        } else if (key === '<' || key === ',') {
            event.preventDefault();
            playerUi.stepSpeed?.(-1);
        } else if (key === '>' || key === '.') {
            event.preventDefault();
            playerUi.stepSpeed?.(1);
        } else if (key === 'Escape') {
            if (playerUi.isTheaterActive?.() && !document.fullscreenElement) {
                event.preventDefault();
                playerUi.toggleTheater?.(false);
            }
        } else if (key === 'm' || key === 'M') {
            event.preventDefault();
            playerUi.toggleMute?.();
        } else if (key === 'ArrowRight') {
            event.preventDefault();
            videoElement.currentTime = Math.min(videoElement.currentTime + 5, videoElement.duration);
            playerUi.showSeekIndicator('forward');
        } else if (key === 'ArrowLeft') {
            event.preventDefault();
            videoElement.currentTime = Math.max(videoElement.currentTime - 5, 0);
            playerUi.showSeekIndicator('backward');
        } else if (key === 'l' || key === 'L') {
            event.preventDefault();
            videoElement.currentTime = Math.min(videoElement.currentTime + 10, videoElement.duration);
            playerUi.showSeekIndicator('forward');
        } else if (key === 'j' || key === 'J') {
            event.preventDefault();
            videoElement.currentTime = Math.max(videoElement.currentTime - 10, 0);
            playerUi.showSeekIndicator('backward');
        } else if (key === 'ArrowUp') {
            event.preventDefault();
            playerUi.applyVolume?.(Math.min(1, videoElement.volume + 0.1));
        } else if (key === 'ArrowDown') {
            event.preventDefault();
            playerUi.applyVolume?.(Math.max(0, videoElement.volume - 0.1));
        } else if (key >= '0' && key <= '9') {
            event.preventDefault();
            const pct = parseInt(key, 10) / 10;
            videoElement.currentTime = pct * videoElement.duration;
        }
    });

    globalPlayerListenersBound = true;
}

function extractMetadataFromDOM(channelSlug, videoSlug) {
    try {
        // Fast path: Next.js embedded state
        const nextDataEl = document.getElementById('__NEXT_DATA__');
        if (nextDataEl && nextDataEl.textContent) {
            const nextData = JSON.parse(nextDataEl.textContent);
            const pageProps = nextData?.props?.pageProps;
            if (pageProps) {
                const targetSlug = String(videoSlug || '').toLowerCase().trim();
                const vid = pageProps.video || pageProps.livestream || pageProps.initialVideo;
                if (vid) {
                    const s = String(vid.slug || '').toLowerCase();
                    const u = String(vid.uuid || vid.video?.uuid || '').toLowerCase();
                    const i = String(vid.id || '').toLowerCase();
                    if (!targetSlug || s === targetSlug || u === targetSlug || i === targetSlug) {
                        return {
                            video: vid,
                            channelId: vid.channel_id || vid.channel?.id || pageProps.channel?.id || vid.user_id,
                            channelSlug: channelSlug || vid.channel?.slug || pageProps.channel?.slug
                        };
                    }
                }
                const list = pageProps.channel?.previous_livestreams || pageProps.channel?.videos;
                if (Array.isArray(list) && targetSlug) {
                    const matched = list.find(v => {
                        if (!v) return false;
                        return String(v.slug || '').toLowerCase() === targetSlug ||
                               String(v.uuid || v.video?.uuid || '').toLowerCase() === targetSlug ||
                               String(v.id || '').toLowerCase() === targetSlug;
                    });
                    if (matched) {
                        return {
                            video: matched,
                            channelId: pageProps.channel?.id || matched.channel_id,
                            channelSlug: channelSlug || pageProps.channel?.slug
                        };
                    }
                }
            }
        }
    } catch (e) {}

    // Fallback: search other script tags
    try {
        const scripts = document.querySelectorAll('script');
        const targetSlug = String(videoSlug || '').toLowerCase().trim();

        for (const script of scripts) {
            const text = script.textContent || '';
            if (!text || (!text.includes('channel') && !text.includes('livestream') && !text.includes('video'))) continue;

            const matches = text.match(/\{"id":.*?\}/g);
            if (matches) {
                for (const matchStr of matches) {
                    try {
                        const obj = JSON.parse(matchStr);
                        if (obj && (obj.channel_id || obj.id)) {
                            const isMatch = targetSlug && (
                                String(obj.slug || '').toLowerCase() === targetSlug ||
                                String(obj.uuid || obj.video?.uuid || '').toLowerCase() === targetSlug ||
                                String(obj.id || '').toLowerCase() === targetSlug
                            );
                            if (isMatch) {
                                return {
                                    video: obj,
                                    channelId: obj.channel_id || obj.channel?.id || obj.user_id,
                                    channelSlug: channelSlug || obj.channel?.slug
                                };
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    } catch (e) {}
    return null;
}

async function getVideoMetadata(channelSlug, videoSlug) {
    const findVideoInList = (list) => {
        if (!Array.isArray(list) || list.length === 0) return null;
        const target = String(videoSlug || '').toLowerCase().trim();

        let found = list.find(v => {
            if (!v) return false;
            const slug = String(v.slug || '').toLowerCase();
            const uuid = String(v.uuid || v.video?.uuid || '').toLowerCase();
            const id = String(v.id || '').toLowerCase();
            return (target && (slug === target || uuid === target || id === target));
        });

        if (!found && target.length > 5) {
            found = list.find(v => {
                if (!v) return false;
                const jsonStr = JSON.stringify(v).toLowerCase();
                return jsonStr.includes(target);
            });
        }

        if (!found && list.length === 1) {
            found = list[0];
        }

        return found;
    };

    // Step 0: Try DOM Extraction (INSTANT: 0ms)
    const domResult = extractMetadataFromDOM(channelSlug, videoSlug);
    if (domResult && domResult.video && domResult.channelId) {
        return domResult;
    }

    let meta = domResult;

    // Step 1: Direct video endpoints in PARALLEL (FASTEST NETWORK PATH: ~50ms)
    if (!meta && videoSlug) {
        const directEndpoints = [
            `https://web.kick.com/api/v1/video/${videoSlug}`,
            `https://kick.com/api/v1/video/${videoSlug}`,
            `https://web.kick.com/api/v1/videos/${videoSlug}`,
            `https://web.kick.com/api/v1/sub-only-videos/${videoSlug}`
        ];
        const directResults = await Promise.all(directEndpoints.map(url => fetchJson(url)));
        for (const data of directResults) {
            if (data) {
                const vid = data.video || data.data || data;
                if (vid && (vid.id || vid.uuid || vid.start_time || vid.created_at || vid.source)) {
                    meta = {
                        video: vid,
                        channelId: vid.channel_id || vid.channel?.id || vid.livestream?.channel_id || vid.livestream?.channel?.id || vid.user_id,
                        channelSlug: channelSlug || vid.channel?.slug || vid.livestream?.channel?.slug || vid.channel_slug
                    };
                    break;
                }
            }
        }
    }

    // Step 2: Channel details in PARALLEL if needed
    let numericalChannelId = meta?.channelId || null;
    let channelData = null;
    let previousLivestreams = null;

    if (!meta && channelSlug) {
        const chanUrls = [
            `https://web.kick.com/api/v1/channels/${channelSlug}`,
            `https://kick.com/api/v1/channels/${channelSlug}`,
            `https://kick.com/api/v2/channels/${channelSlug}`
        ];
        const chanResults = await Promise.all(chanUrls.map(url => fetchJson(url)));
        for (const resData of chanResults) {
            if (resData && (resData.id || resData.channel_id || resData.user_id)) {
                channelData = resData;
                numericalChannelId = resData.id || resData.channel_id || resData.user_id;
                previousLivestreams = Array.isArray(resData.previous_livestreams)
                    ? resData.previous_livestreams
                    : null;
                break;
            }
        }

        if (channelData) {
            const matched = findVideoInList(previousLivestreams || channelData.videos);
            if (matched) {
                meta = {
                    video: matched,
                    channelId: numericalChannelId,
                    channelSlug: channelSlug
                };
            }
        }
    }

    // Step 3: Candidate video endpoints in PARALLEL if needed
    if (!meta && (channelSlug || numericalChannelId)) {
        const candidateVideoUrls = [];
        if (channelSlug) {
            candidateVideoUrls.push(`https://kick.com/api/v2/channels/${channelSlug}/videos`);
            candidateVideoUrls.push(`https://web.kick.com/api/v1/channels/${channelSlug}/videos`);
        }
        if (numericalChannelId) {
            candidateVideoUrls.push(`https://kick.com/api/v2/channels/${numericalChannelId}/videos`);
            candidateVideoUrls.push(`https://web.kick.com/api/v1/channels/${numericalChannelId}/videos`);
        }

        const videoLists = await Promise.all(candidateVideoUrls.map(url => fetchJson(url)));
        for (const data of videoLists) {
            if (data) {
                const videos = Array.isArray(data) ? data : (data.videos || data.data || data.previous_livestreams || []);
                const matched = findVideoInList(videos);
                if (matched) {
                    meta = {
                        video: matched,
                        channelId: numericalChannelId || matched.channel_id,
                        channelSlug: channelSlug || matched.channel?.slug
                    };
                    break;
                }
            }
        }
    }

    // Step 4: Enrich metadata with channel videos list if source or thumbnail IVS path is missing
    const targetChannelSlug = meta?.channelSlug || channelSlug;
    if (targetChannelSlug && (!meta || !meta.video?.source || !thumbnailHasIvsPath(meta.video))) {
        try {
            const chanVideos = await fetchJson(`https://kick.com/api/v2/channels/${targetChannelSlug}/videos`);
            if (Array.isArray(chanVideos)) {
                const matched = findVideoInList(chanVideos);
                if (matched) {
                    if (!meta) {
                        meta = {
                            video: matched,
                            channelId: matched.channel_id || numericalChannelId,
                            channelSlug: targetChannelSlug
                        };
                    } else {
                        meta.video = {
                            ...matched,
                            ...meta.video,
                            source: meta.video.source || matched.source,
                            thumbnail: meta.video.thumbnail || matched.thumbnail
                        };
                    }
                }
            }
        } catch (e) {}
    }

    if (!meta) {
        if (numericalChannelId && videoSlug) {
            meta = {
                video: {
                    id: videoSlug,
                    uuid: videoSlug,
                    start_time: new Date().toISOString(),
                    thumbnail: { url: "" }
                },
                channelId: numericalChannelId,
                channelSlug: channelSlug
            };
        } else {
            console.error("[Kick Unlocker] Unable to find video metadata");
            return null;
        }
    }

    if (channelSlug && previousLivestreams && meta.video && !thumbnailHasIvsPath(meta.video)) {
        const target = parseUtcDate(meta.video.start_time || meta.video.created_at);
        if (target) {
            const match = previousLivestreams.find(entry => {
                const entryDate = parseUtcDate(entry?.start_time || entry?.created_at);
                return entryDate && entryDate.getTime() === target.getTime();
            });
            if (match?.thumbnail) {
                meta.video = { ...meta.video, thumbnail: match.thumbnail };
            }
        }
    }

    return meta;
}

async function findStreamUrlFromMetadata(metadata) {
    const { video, channelId } = metadata;
    if (!video && !channelId) return null;

    // Priority 1: Check direct stream source from video metadata (FASTEST: 0-50ms)
    const directCandidates = [
        video?.source,
        video?.livestream?.source,
        video?.video?.source,
        video?.stream_url,
        video?.playback_url
    ].filter(s => typeof s === 'string' && (s.includes('.m3u8') || s.includes('/hls/')));

    for (const direct of directCandidates) {
        console.log("[Kick Unlocker] Checking direct stream source:", direct);
        const valid = await checkStreamUrl(direct);
        if (valid) {
            console.log("[Kick Unlocker] Direct stream source verified:", valid);
            return valid;
        }
    }

    // Priority 2: Web stream API playback minting
    const mintVideoId = video?.video?.uuid || video?.uuid || video?.id;
    if (mintVideoId) {
        const minted = await mintPlaybackUrl(String(mintVideoId), metadata.channelSlug);
        if (minted) {
            const valid = await checkStreamUrl(minted);
            if (valid) {
                console.log("[Kick Unlocker] Playback URL minted and verified:", valid);
                return valid;
            }
        }
    }

    // Priority 3: Extract IVS candidate identifiers from thumbnail
    let candidates = extractIvsIdentifiers(video);

    if (candidates.length === 0 && metadata.channelSlug) {
        try {
            const chanVideos = await fetchJson(`https://kick.com/api/v2/channels/${metadata.channelSlug}/videos`);
            if (Array.isArray(chanVideos)) {
                const targetSlug = String(video?.slug || video?.uuid || video?.id || '').toLowerCase();
                const matched = chanVideos.find(v => {
                    if (!v) return false;
                    return String(v.slug || '').toLowerCase() === targetSlug ||
                           String(v.uuid || v.video?.uuid || '').toLowerCase() === targetSlug ||
                           String(v.id || '').toLowerCase() === targetSlug;
                });
                if (matched) {
                    if (matched.source && typeof matched.source === 'string' && matched.source.includes('.m3u8')) {
                        const valid = await checkStreamUrl(matched.source);
                        if (valid) return valid;
                    }
                    candidates = extractIvsIdentifiers(matched);
                }
            }
        } catch (e) {}
    }

    if (candidates.length === 0) {
        console.warn("[Kick Unlocker] No IVS candidate identifiers found for stream");
        return null;
    }

    let startTimeStr = (video?.start_time || video?.created_at || video?.livestream?.start_time || '').replace(' ', 'T');
    if (startTimeStr && !startTimeStr.endsWith('Z')) startTimeStr += 'Z';
    const startTime = startTimeStr ? new Date(startTimeStr) : new Date();

    const baseUrls = [
        "https://stream.kick.com/3c81249a5ce0/ivs/v1/196233775518",
        "https://stream.kick.com/ivs/v1/196233775518",
        "https://stream.kick.com/0f3cb0ebce7/ivs/v1/196233775518"
    ];

    const tasks = [];
    const offsets = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5];

    for (const offset of offsets) {
        const t = new Date(startTime.getTime() + (offset * 60000));
        const y = t.getUTCFullYear();
        const m = t.getUTCMonth() + 1;
        const d = t.getUTCDate();
        const h = t.getUTCHours();
        const min = t.getUTCMinutes();
        for (const candidate of candidates) {
            for (const base of baseUrls) {
                tasks.push(`${base}/${candidate.cid}/${y}/${m}/${d}/${h}/${min}/${candidate.vid}/media/hls/master.m3u8`);
            }
        }
    }

    const CHUNK_SIZE = 10;
    for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
        const chunk = tasks.slice(i, i + CHUNK_SIZE);
        const results = await Promise.all(chunk.map(async (url) => {
            const ok = await checkStreamUrl(url);
            return ok ? url : null;
        }));
        const found = results.find(Boolean);
        if (found) {
            console.log("[Kick Unlocker] Found stream via candidate generator:", found);
            return found;
        }
    }
    return null;
}

class ChatController {
    constructor(channelId, videoStartTime, targetContainers) {
        this.channelId = channelId;
        this.videoStartTime = videoStartTime;
        this.containers = Array.isArray(targetContainers) ? targetContainers : [targetContainers].filter(Boolean);
        this.messages = [];
        this.videoElement = null;
        this.activeSessionId = 0;
        this.seekDebounceTimer = null;
        this.lastRenderedMsgId = null;
        this.syncBadges = [];
        this.chatLists = [];
    }

    destroy() {
        clearTimeout(this.seekDebounceTimer);
        this.activeSessionId = -1;
        this.messages = [];
        this.lastRenderedMsgId = null;
        this.chatLists = [];
        this.syncBadges = [];
        for (const c of this.containers) {
            if (c && c.isConnected) c.innerHTML = '';
        }
    }

    init(initialVideoElement = null) {
        this.chatLists = [];
        this.syncBadges = [];

        for (const c of this.containers) {
            if (!c) continue;
            c.innerHTML = `
                <div class="k-chat-container">
                    <div id="k-chat-sync-badge" class="k-chat-syncing-indicator">⚡ Syncing chat...</div>
                    <div id="kick-unlocker-chat-list">
                        <br><div style="text-align:center;color:#888;font-size:14px;">Connecting to chat...</div>
                    </div>
                </div>`;
            const list = c.querySelector('#kick-unlocker-chat-list');
            const badge = c.querySelector('#k-chat-sync-badge');
            if (list) this.chatLists.push(list);
            if (badge) this.syncBadges.push(badge);
        }

        if (initialVideoElement) this.connectVideo(initialVideoElement);
        this.fetchLoop(this.activeSessionId);
    }

    connectVideo(videoElement) {
        this.videoElement = videoElement;
        videoElement.addEventListener('timeupdate', () => this.updateUI(videoElement.currentTime));

        const handleSeek = () => {
            // Immediately render messages at new position if available in cache
            this.lastRenderedMsgId = null;
            this.updateUI(videoElement.currentTime);

            // Debounce network sync so arrow keys can be tapped rapidly without freezing
            clearTimeout(this.seekDebounceTimer);
            this.seekDebounceTimer = setTimeout(() => {
                this.handleSeekSync(videoElement.currentTime);
            }, 300);
        };

        videoElement.addEventListener('seeking', handleSeek);
        videoElement.addEventListener('seeked', () => {
            this.lastRenderedMsgId = null;
            this.updateUI(videoElement.currentTime);
        });
    }

    handleSeekSync(currentTime) {
        const vidT = this.videoStartTime.getTime() + (currentTime * 1000);

        // Check if currentTime is within already fetched range
        if (this.messages.length > 0) {
            const firstT = new Date(this.messages[0].created_at).getTime();
            const lastT = new Date(this.messages[this.messages.length - 1].created_at).getTime();
            if (vidT >= firstT && vidT <= lastT - 10000) {
                this.updateUI(currentTime);
                return;
            }
        }

        // Outside range, start a fresh fetch session with a 30s buffer
        this.activeSessionId++;
        this.lastRenderedMsgId = null;
        for (const b of this.syncBadges) {
            if (b && b.isConnected) b.classList.add('visible');
        }
        this.fetchLoop(this.activeSessionId, true);
    }

    parseContent(content) {
        if (!content) return "";
        return content.replace(/\[emote:(\d+):([^\]]+)\]/g, (match, id, name) =>
            `<img src="https://files.kick.com/emotes/${id}/fullsize" alt="${name}" title="${name}" style="height:1.45em;vertical-align:-0.25em;display:inline-block;margin:0 2px;">`
        );
    }

    async fetchLoop(sessionId, isSeek = false) {
        let currentCursor = null;
        while (this.activeSessionId === sessionId) {
            try {
                let url = `https://web.kick.com/api/v2/channels/${this.channelId}/messages`;
                if (currentCursor) {
                    url += `?cursor=${currentCursor}`;
                } else {
                    let targetTime = this.videoStartTime;
                    if (this.videoElement) {
                        // 30s buffer before seek time guarantees messages are found even when paused!
                        const bufferedSeconds = Math.max(0, this.videoElement.currentTime - 30);
                        targetTime = new Date(this.videoStartTime.getTime() + (bufferedSeconds * 1000));
                    }
                    url += `?start_time=${targetTime.toISOString()}`;
                }

                let data = await fetchJson(url);
                if (!data) {
                    url = url.replace('web.kick.com', 'kick.com');
                    data = await fetchJson(url);
                }
                if (!data) { await new Promise(r => setTimeout(r, 2000)); continue; }
                if (this.activeSessionId !== sessionId) break;

                const msgs = data.messages || (data.data && data.data.messages) || [];
                if (msgs.length) {
                    if (isSeek && currentCursor === null) {
                        this.messages = msgs;
                    } else {
                        msgs.forEach(msg => {
                            if (!this.messages.some(m => m.id === msg.id)) this.messages.push(msg);
                        });
                    }
                    this.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    for (const b of this.syncBadges) {
                        if (b && b.isConnected) b.classList.remove('visible');
                    }
                    if (this.videoElement) this.updateUI(this.videoElement.currentTime);
                }

                currentCursor = data.cursor || (data.data && data.data.cursor) || data.next_cursor;
                if (!currentCursor) {
                    currentCursor = null;
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    if (this.messages.length && this.videoElement) {
                        const lastT = new Date(this.messages[this.messages.length - 1].created_at).getTime();
                        const vidT = this.videoStartTime.getTime() + (this.videoElement.currentTime * 1000);
                        if (lastT > vidT + 60000) await new Promise(r => setTimeout(r, 1000));
                        else await new Promise(r => setTimeout(r, 50));
                    } else {
                        await new Promise(r => setTimeout(r, 50));
                    }
                }
            } catch (e) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (this.activeSessionId === sessionId) {
            for (const b of this.syncBadges) {
                if (b && b.isConnected) b.classList.remove('visible');
            }
        }
    }

    updateUI(cwdSeconds) {
        if (!this.chatLists.length) return;
        const absTime = this.videoStartTime.getTime() + (cwdSeconds * 1000);
        let limit = -1;
        for (let i = this.messages.length - 1; i >= 0; i--) {
            if (new Date(this.messages[i].created_at).getTime() <= absTime) {
                limit = i;
                break;
            }
        }
        if (limit === -1) {
            return;
        }

        const subset = this.messages.slice(Math.max(0, limit - 75), limit + 1);
        const lastM = subset[subset.length - 1];
        if (!lastM || (this.lastRenderedMsgId === lastM.id && subset.length >= 50)) return;

        const html = subset.map(msg => `
            <div class="k-chat-msg">
                <span class="k-chat-username" style="color:${msg.sender?.identity?.color || '#53fc18'};">${msg.sender?.username || 'User'}:</span>
                <span class="k-chat-text">${this.parseContent(msg.content)}</span>
            </div>`).join('');

        for (const list of this.chatLists) {
            if (list && list.isConnected) {
                list.innerHTML = html;
                list.scrollTop = list.scrollHeight;
            }
        }
        this.lastRenderedMsgId = lastM.id;
    }
}

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}

function getVolumeIcon(volume) {
    if (volume <= 0) return ICONS.volumeMute;
    if (volume < 0.2) return ICONS.volumeLow;
    if (volume < 0.5) return ICONS.volumeMedium;
    return ICONS.volumeHigh;
}

function resolvePlayerContainer(target) {
    // 1. #channel-video-player is the primary Kick video player container
    const mainById = document.querySelector('#channel-video-player');
    if (mainById) return mainById;

    // 2. If target is connected, walk UP to find the topmost video player container
    if (target && target.nodeType === Node.ELEMENT_NODE && target.isConnected) {
        const fromClosestId = target.closest?.('#channel-video-player');
        if (fromClosestId) return fromClosestId;

        const fromClosestAspect = target.closest?.('.aspect-video');
        if (fromClosestAspect) {
            const parentPlayer = fromClosestAspect.closest?.('#channel-video-player') ||
                                 fromClosestAspect.closest?.('[data-testid="video-player"]');
            if (parentPlayer) return parentPlayer;
            return fromClosestAspect;
        }

        const fromClosestTestId = target.closest?.('[data-testid="video-player"]');
        if (fromClosestTestId) return fromClosestTestId;
    }

    return document.querySelector('#channel-video-player') ||
           document.querySelector('[data-testid="video-player"]') ||
           document.querySelector('.aspect-video');
}

async function unlockVideo(triggerElement) {
    if (isUnlocking) return;
    const container = resolvePlayerContainer(triggerElement);
    if (!container) return;

    const pathParts = window.location.pathname.split('/').filter(Boolean);
    let channelSlug = null;
    let videoSlug = null;

    const urlParams = new URLSearchParams(window.location.search);
    const queryVideo = urlParams.get('video');

    if (pathParts.length >= 3 && (pathParts[1] === 'video' || pathParts[1] === 'videos')) {
        channelSlug = pathParts[0];
        videoSlug = pathParts[2];
    } else if (pathParts.length >= 2 && pathParts[0] === 'video') {
        videoSlug = pathParts[1];
    } else if (queryVideo) {
        channelSlug = pathParts[0] || null;
        videoSlug = queryVideo;
    }

    if (!videoSlug) {
        delete container.dataset.kickUnlockerProcessing;
        return;
    }

    // Immediately mark container and hide any Kick paywall overlays or blurred backdrops
    container.dataset.kickUnlockerProcessing = "true";
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.background = '#000';
    container.style.overflow = 'hidden';

    const containerParent = container.parentElement;
    if (containerParent) {
        const paywallSiblings = containerParent.querySelectorAll(
            '[data-testid*="subscriber"], [data-testid*="sub-only"], [data-testid*="paywall"], button[class*="subscribe"], div[class*="blur"], img[class*="blur"]'
        );
        paywallSiblings.forEach(el => {
            if (!container.contains(el)) {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('opacity', '0', 'important');
            }
        });
        if (containerParent.style.filter?.includes('blur') || containerParent.style.backdropFilter?.includes('blur')) {
            containerParent.style.filter = 'none';
            containerParent.style.backdropFilter = 'none';
        }
    }

    const containerRect = container.getBoundingClientRect();
    const computedWidth = containerRect.width > 0 ? containerRect.width : (containerParent?.getBoundingClientRect()?.width || 0);
    const fallbackMinHeight = Math.max(
        Math.round(containerRect.height || 0),
        Math.round(computedWidth * 9 / 16),
        360
    );

    container.style.minHeight = `${fallbackMinHeight}px`;
    container.style.aspectRatio = '16 / 9';

    if (activeChatController) {
        activeChatController.destroy();
        activeChatController = null;
    }
    if (activeHls) {
        activeHls.destroy();
        activeHls = null;
    }
    document.body.classList.remove('kick-theater-active', 'k-theater-rtl');

    try {
        isUnlocking = true;

        // --- STEP 1: FULL WIPE & CENTERED LOADING SPLASH ---
        container.innerHTML = `
            <div id="k-splash-screen" style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#060709;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:Inter,system-ui,sans-serif;z-index:9999;border-radius:inherit;overflow:hidden;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                    <span style="font-size:26px;line-height:1;">🔓</span>
                    <span style="font-size:22px;font-weight:700;color:#53fc18;letter-spacing:-0.5px;">Kick Unlocker</span>
                </div>
                <div id="k-unlock-status" style="font-size:13px;color:rgba(255,255,255,0.75);margin-bottom:16px;">Searching stream...</div>
                <div style="width:220px;height:4px;background:rgba(255,255,255,0.15);border-radius:999px;overflow:hidden;">
                    <div class="k-splash-bar"></div>
                </div>
            </div>
        `;

        const resumeKey = getResumeKey(channelSlug || 'unknown', videoSlug || 'unknown');
        const playerSettingsKey = getPlayerSettingsKey(channelSlug || 'unknown', videoSlug || 'unknown');
        const savedPlayerSettings = loadPlayerSettings(playerSettingsKey);

        const result = await getVideoMetadata(channelSlug, videoSlug);
        if (!result) {
            container.innerHTML = `
              <div id="k-splash-screen" style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#060709;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:Inter,system-ui,sans-serif;z-index:9999;border-radius:inherit;overflow:hidden;">
                  <div style="font-size:28px;margin-bottom:10px;">⚠️</div>
                  <div style="font-size:20px;color:#ff4444;font-weight:700;margin-bottom:8px;">Stream Not Found</div>
                  <div style="font-size:13px;color:#aaa;margin-bottom:18px;">Could not retrieve video details.</div>
                  <button class="k-retry-btn" id="k-retry-unlock">Retry Stream</button>
              </div>`;
            const retryBtn = container.querySelector('#k-retry-unlock');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    delete container.dataset.kickUnlockerProcessing;
                    unlockVideo(container);
                });
            }
            return;
        }

        const streamUrl = await findStreamUrlFromMetadata(result);
        if (!streamUrl) {
            container.innerHTML = `
              <div id="k-splash-screen" style="position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#060709;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:Inter,system-ui,sans-serif;z-index:9999;border-radius:inherit;overflow:hidden;">
                  <div style="font-size:28px;margin-bottom:10px;">⚠️</div>
                  <div style="font-size:20px;color:#ff4444;font-weight:700;margin-bottom:8px;">Stream Not Found</div>
                  <div style="font-size:13px;color:#aaa;margin-bottom:18px;">Could not locate HLS stream URL for this video.</div>
                  <button class="k-retry-btn" id="k-retry-unlock">Retry Stream</button>
              </div>`;
            const retryBtn = container.querySelector('#k-retry-unlock');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    delete container.dataset.kickUnlockerProcessing;
                    unlockVideo(container);
                });
            }
            return;
        }

        // --- STEP 2: FULL UNLOCK ---
        container.dataset.kickUnlockerProcessing = "true";
        container.innerHTML = '';
        container.style.background = '#000';

        // Check for existing Kick Chat in sidebar
        const existingChat = document.querySelector('#chatroom-messages');
        if (existingChat) {
            existingChat.innerHTML = '';
            existingChat.style.display = 'block';
        }

        container.innerHTML = `
            <div id="k-theater-wrapper" class="k-theater-wrapper">
                <div id="unlocker-video-area" class="k-theater-video-host"></div>
                <div id="unlocker-chat-area" class="k-theater-chat-host ${existingChat ? 'k-chat-hidden-normal' : ''}">
                    <div class="k-chat-header-bar">
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span class="k-mini-spinner" style="display:none;" id="k-chat-header-spinner"></span>
                            <span>Stream Chat</span>
                        </div>
                        <button id="k-chat-close-btn" class="k-chat-close-btn" title="Collapse Chat (C)" aria-label="Collapse Chat">
                            ${ICONS.close}
                        </button>
                    </div>
                    <div id="k-chat-inner" style="flex:1;height:calc(100% - 41px);overflow:hidden;position:relative;"></div>
                </div>
            </div>
        `;

        const theaterWrapper = container.querySelector('#k-theater-wrapper');
        const videoParent = container.querySelector('#unlocker-video-area');
        const theaterChatInner = container.querySelector('#k-chat-inner');
        const btnChatClose = container.querySelector('#k-chat-close-btn');

        const chatTargets = [existingChat, theaterChatInner].filter(Boolean);
        const startTime = new Date((result.video?.start_time || result.video?.created_at || '').replace(' ', 'T') + ((result.video?.start_time || result.video?.created_at || '').endsWith('Z') ? '' : 'Z'));
        const chatController = new ChatController(result.channelId, startTime, chatTargets);
        activeChatController = chatController;
        chatController.init(null);

        const finalUrl = streamUrl;

        // Build Custom Player UI
        const playerHTML = `
            <div id="k-player" style="width:100%;height:100%;position:relative;background:black;overflow:hidden;font-family:Inter,sans-serif;">
                <video id="k-video" playsinline style="width:100%;height:100%;object-fit:contain;"></video>
                <div id="k-toast" class="k-toast" aria-hidden="true"></div>
                <div id="k-loading" aria-hidden="true">
                    <div class="k-loading-spinner"></div>
                </div>
                <div id="k-controls" style="position:absolute;bottom:0;left:0;width:100%;padding:20px 15px 10px 15px;background:linear-gradient(to top, rgba(0,0,0,0.92), transparent);display:flex;flex-direction:column;opacity:0;transition:opacity 0.2s;">
                    <div id="k-track" style="width:100%;height:6px;padding:8px 0;background:rgba(255,255,255,0.3);background-clip:content-box;box-sizing:content-box;cursor:pointer;position:relative;margin-bottom:4px;border-radius:2px;">
                        <div id="k-track-tooltip">
                            <div id="k-track-tooltip-time">0:00</div>
                        </div>
                         <div id="k-progress" style="width:0%;height:100%;background:#53fc18;position:relative;border-radius:2px;"></div>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <button id="k-play" style="background:none;border:none;cursor:pointer;opacity:0.9;" aria-label="Play/Pause">${ICONS.play}</button>
                            <button id="k-rewind-10" type="button" title="Rewind 10s (J)" aria-label="Rewind 10 seconds">${ICONS.rewind10}</button>
                            <button id="k-forward-10" type="button" title="Forward 10s (L)" aria-label="Forward 10 seconds">${ICONS.forward10}</button>
                            <span id="k-time" style="font-size:13px;color:#ddd;font-variant-numeric:tabular-nums;">0:00 / 0:00</span>
                            <div id="k-volume-wrap">
                                <button id="k-volume-btn" type="button" aria-label="Mute volume">${ICONS.volumeHigh}</button>
                                <input id="k-volume" type="range" min="0" max="1" step="0.01" value="1">
                                <span id="k-volume-value">100%</span>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <button id="k-update-btn" type="button" title="Open latest update" style="display:none;">${ICONS.update}</button>
                            <div id="k-speed-wrap">
                                <button id="k-speed-btn" type="button">1x ▴</button>
                                <div id="k-speed-menu"></div>
                            </div>
                            <div id="k-quality-wrap">
                                <button id="k-quality-btn" type="button">Auto ▴</button>
                                <div id="k-quality-menu"></div>
                            </div>
                            <button id="k-pip" type="button" title="Picture-in-Picture (P)" aria-label="Picture-in-Picture">${ICONS.pip}</button>
                            <button id="k-toggle-chat" type="button" title="Toggle Chat (C)" aria-label="Toggle Chat">${ICONS.chat}</button>
                            <button id="k-theater" type="button" title="Theater Mode (Alt+T)" aria-label="Theater Mode">${ICONS.theater}</button>
                            <button id="k-fs" style="background:none;border:none;cursor:pointer;opacity:0.9;" aria-label="Fullscreen">${ICONS.maximize}</button>
                        </div>
                    </div>
                </div>
                <div id="k-seek-indicator" aria-hidden="true"></div>
                <button id="k-big-play" style="position:absolute;top:50%;left:50%;width:70px;height:70px;background:rgba(7,7,7,0.72);border-radius:50%;border:1px solid rgba(255,255,255,0.18);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;" aria-label="Play">
                    ${ICONS.bigPlay}
                </button>
            </div>
        `;

        videoParent.innerHTML = playerHTML;
        const pRoot = videoParent.querySelector('#k-player');
        const vid = videoParent.querySelector('#k-video');
        const controls = videoParent.querySelector('#k-controls');
        const btnPlay = videoParent.querySelector('#k-play');
        const btnRewind10 = videoParent.querySelector('#k-rewind-10');
        const btnForward10 = videoParent.querySelector('#k-forward-10');
        const btnFs = videoParent.querySelector('#k-fs');
        const btnTheater = videoParent.querySelector('#k-theater');
        const btnPip = videoParent.querySelector('#k-pip');
        const btnToggleChat = videoParent.querySelector('#k-toggle-chat');
        const btnUpdate = videoParent.querySelector('#k-update-btn');
        const btnBig = videoParent.querySelector('#k-big-play');
        const progressBar = videoParent.querySelector('#k-progress');
        const track = videoParent.querySelector('#k-track');
        const trackTooltip = videoParent.querySelector('#k-track-tooltip');
        const trackTooltipTime = videoParent.querySelector('#k-track-tooltip-time');
        const timeDisplay = videoParent.querySelector('#k-time');
        const qualWrap = videoParent.querySelector('#k-quality-wrap');
        const qualBtn = videoParent.querySelector('#k-quality-btn');
        const qualMenu = videoParent.querySelector('#k-quality-menu');
        const speedWrap = videoParent.querySelector('#k-speed-wrap');
        const speedBtn = videoParent.querySelector('#k-speed-btn');
        const speedMenu = videoParent.querySelector('#k-speed-menu');
        const seekIndicator = videoParent.querySelector('#k-seek-indicator');
        const loadingOverlay = videoParent.querySelector('#k-loading');
        const toastEl = videoParent.querySelector('#k-toast');

        const volumeWrap = videoParent.querySelector('#k-volume-wrap');
        const volumeButton = videoParent.querySelector('#k-volume-btn');
        const volumeSlider = videoParent.querySelector('#k-volume');
        const volumeValue = videoParent.querySelector('#k-volume-value');
        const initialVolume = Number.isFinite(savedPlayerSettings.volume) ? savedPlayerSettings.volume : 1;
        let seekIndicatorTimeout = null;
        let hasStartedPlayback = false;
        let loadingStateTimeout = null;
        let previousVolumeBeforeMute = initialVolume > 0 ? initialVolume : 1;

        const showToast = (text) => {
            if (!toastEl) return;
            toastEl.textContent = text;
            toastEl.classList.remove('visible');
            void toastEl.offsetWidth;
            toastEl.classList.add('visible');
            clearTimeout(toastEl._timer);
            toastEl._timer = setTimeout(() => {
                toastEl.classList.remove('visible');
            }, 1800);
        };

        const updateVolumeSliderVisual = (volume) => {
            const percent = Math.max(0, Math.min(100, Math.round(volume * 100)));
            volumeSlider.style.setProperty('--k-volume-percent', `${percent}%`);
            volumeValue.textContent = `${percent}%`;
            volumeButton.innerHTML = getVolumeIcon(volume);
            volumeButton.setAttribute('aria-label', percent === 0 ? 'Unmute volume' : 'Mute volume');
            volumeWrap.dataset.muted = percent === 0 ? 'true' : 'false';
        };

        const applyVolume = (volume, { persist = true } = {}) => {
            const normalizedVolume = Math.max(0, Math.min(1, Number(volume) || 0));
            if (normalizedVolume > 0) previousVolumeBeforeMute = normalizedVolume;

            vid.muted = normalizedVolume === 0;
            vid.volume = normalizedVolume;
            volumeSlider.value = String(normalizedVolume);
            updateVolumeSliderVisual(normalizedVolume);

            if (persist) {
                savePlayerSettings(playerSettingsKey, { volume: normalizedVolume });
            }
        };

        const setLoadingState = (isLoading, { immediate = false } = {}) => {
            clearTimeout(loadingStateTimeout);

            if (!isLoading) {
                loadingOverlay.classList.remove('visible');
                return;
            }

            // Never show loading spinner if video is paused and ready, or if big play button is shown
            if ((vid.paused && vid.readyState >= 2) || (btnBig && btnBig.classList.contains('visible'))) {
                loadingOverlay.classList.remove('visible');
                return;
            }

            if (immediate) {
                loadingOverlay.classList.add('visible');
                return;
            }

            loadingStateTimeout = setTimeout(() => {
                if (!vid.paused && !vid.ended) {
                    loadingOverlay.classList.add('visible');
                }
            }, 250);
        };

        const showSeekIndicator = (direction) => {
            seekIndicator.innerHTML = direction === 'forward' ? ICONS.forward : ICONS.backward;
            seekIndicator.dataset.direction = direction;
            seekIndicator.classList.remove('visible');
            void seekIndicator.offsetWidth;
            seekIndicator.classList.add('visible');
            clearTimeout(seekIndicatorTimeout);
            seekIndicatorTimeout = setTimeout(() => {
                seekIndicator.classList.remove('visible');
            }, 850);
        };

        const togglePlay = () => {
            if (!vid || !vid.isConnected) return;
            if (vid.paused || vid.ended) {
                if (activeHls && vid.readyState < 2) {
                    try { activeHls.startLoad(); } catch (e) {}
                }
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        hasStartedPlayback = true;
                        setLoadingState(false);
                        btnBig.classList.remove('visible');
                    }).catch(() => {
                        vid.muted = true;
                        updateVolumeSliderVisual(0);
                        const mutedPromise = vid.play();
                        if (mutedPromise !== undefined) {
                            mutedPromise.then(() => {
                                hasStartedPlayback = true;
                                setLoadingState(false);
                                btnBig.classList.remove('visible');
                                showToast("Muted for autoplay — Click to unmute 🔊");
                            }).catch(() => {
                                setLoadingState(false);
                                btnBig.classList.add('visible');
                            });
                        }
                    });
                }
            } else {
                vid.pause();
            }
        };

        const isRtl = () => document.dir === 'rtl' || getComputedStyle(document.body).direction === 'rtl';

        const layoutTheaterMode = (enable) => {
            if (enable) {
                theaterWrapper.classList.add('k-theater-mode-active');
                document.documentElement.classList.add('k-theater-mode-on');
                document.body.classList.add('k-theater-mode-on');
                if (isRtl()) {
                    document.body.classList.add('k-theater-rtl');
                } else {
                    document.body.classList.remove('k-theater-rtl');
                }
                btnTheater.classList.add('active');
                btnTheater.title = "Exit Theater Mode (Alt+T / Esc)";
                showToast("Theater Mode: ON");
            } else {
                theaterWrapper.classList.remove('k-theater-mode-active');
                document.documentElement.classList.remove('k-theater-mode-on');
                document.body.classList.remove('k-theater-mode-on', 'k-theater-rtl');
                btnTheater.classList.remove('active');
                btnTheater.title = "Theater Mode (Alt+T)";
                showToast("Theater Mode: OFF");
            }
            window.dispatchEvent(new Event('resize'));
        };

        const toggleTheater = (forceState = null) => {
            const isCurrentlyTheater = theaterWrapper.classList.contains('k-theater-mode-active');
            const shouldBeTheater = forceState !== null ? forceState : !isCurrentlyTheater;
            layoutTheaterMode(shouldBeTheater);
            savePlayerSettings(playerSettingsKey, { theater: shouldBeTheater });
        };

        btnTheater.addEventListener('click', () => toggleTheater());

        if (savedPlayerSettings.theater) {
            layoutTheaterMode(true);
        }

        const toggleChat = (forceState = null) => {
            const isCurrentlyCollapsed = theaterWrapper.classList.contains('chat-collapsed');
            const shouldCollapse = forceState !== null ? !forceState : !isCurrentlyCollapsed;
            if (shouldCollapse) {
                theaterWrapper.classList.add('chat-collapsed');
                btnToggleChat.classList.remove('active');
                showToast("Chat: Hidden");
            } else {
                theaterWrapper.classList.remove('chat-collapsed');
                btnToggleChat.classList.add('active');
                showToast("Chat: Visible");
            }
            savePlayerSettings(playerSettingsKey, { chatCollapsed: shouldCollapse });
        };
        btnToggleChat.addEventListener('click', () => toggleChat());
        if (btnChatClose) btnChatClose.addEventListener('click', () => toggleChat(false));

        if (savedPlayerSettings.chatCollapsed) {
            theaterWrapper.classList.add('chat-collapsed');
            btnToggleChat.classList.remove('active');
        } else {
            btnToggleChat.classList.add('active');
        }

        const togglePiP = async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                    showToast("PiP: OFF");
                } else if (vid.requestPictureInPicture) {
                    await vid.requestPictureInPicture();
                    showToast("PiP: ON");
                }
            } catch (err) {
                console.warn("[Kick Unlocker] PiP error:", err);
            }
        };
        btnPip.addEventListener('click', togglePiP);

        btnRewind10.addEventListener('click', () => {
            if (!isFinite(vid.duration)) return;
            vid.currentTime = Math.max(0, vid.currentTime - 10);
            showSeekIndicator('backward');
        });
        btnForward10.addEventListener('click', () => {
            if (!isFinite(vid.duration)) return;
            vid.currentTime = Math.min(vid.duration, vid.currentTime + 10);
            showSeekIndicator('forward');
        });

        // Speed Menu Setup
        const setSpeed = (rate, label) => {
            vid.playbackRate = rate;
            vid.preservesPitch = true;
            speedBtn.textContent = `${label} ▴`;
            [...speedMenu.querySelectorAll('.k-speed-option')].forEach((opt) => opt.classList.remove('active'));
            const matched = [...speedMenu.querySelectorAll('.k-speed-option')].find(opt => opt.textContent === label);
            if (matched) matched.classList.add('active');
            savePlayerSettings(playerSettingsKey, { speed: rate });
            speedWrap.classList.remove('open');
        };

        const speeds = [
            { rate: 0.5, label: '0.5x' },
            { rate: 0.75, label: '0.75x' },
            { rate: 1.0, label: '1x (Normal)' },
            { rate: 1.25, label: '1.25x' },
            { rate: 1.5, label: '1.5x' },
            { rate: 1.75, label: '1.75x' },
            { rate: 2.0, label: '2.0x' }
        ];

        const stepSpeed = (delta) => {
            const currentSpeed = vid.playbackRate || 1.0;
            const rates = speeds.map(s => s.rate);
            let idx = rates.findIndex(r => Math.abs(r - currentSpeed) < 0.05);
            if (idx === -1) idx = rates.indexOf(1.0);
            const newIdx = Math.max(0, Math.min(rates.length - 1, idx + delta));
            const newObj = speeds[newIdx];
            setSpeed(newObj.rate, newObj.label);
            showToast(`Speed: ${newObj.rate}x`);
        };

        activePlayerUi = {
            vid,
            qualWrap,
            speedWrap,
            showSeekIndicator,
            togglePlay,
            toggleFullscreen: () => btnFs.click(),
            toggleTheater,
            isTheaterActive: () => theaterWrapper.classList.contains('k-theater-mode-active'),
            togglePiP,
            toggleChat,
            stepSpeed,
            toggleMute: () => volumeButton.click(),
            applyVolume,
            showToast
        };
        bindGlobalPlayerListeners();

        applyVolume(initialVolume, { persist: false });

        speeds.forEach(sp => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'k-speed-option';
            item.textContent = sp.label;
            if (sp.rate === (savedPlayerSettings.speed || 1.0)) item.classList.add('active');
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                setSpeed(sp.rate, sp.label);
            });
            speedMenu.appendChild(item);
        });

        speedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            qualWrap.classList.remove('open');
            speedWrap.classList.toggle('open');
        });

        const initialSpeed = savedPlayerSettings.speed || 1.0;
        const matchedSpeedObj = speeds.find(s => s.rate === initialSpeed) || speeds[2];
        setSpeed(matchedSpeedObj.rate, matchedSpeedObj.label);

        getLatestReleaseInfo().then((release) => {
            if (!release || !btnUpdate?.isConnected) return;

            btnUpdate.style.display = 'inline-flex';
            btnUpdate.title = `Update available: ${release.name || release.tagName}`;
            btnUpdate.addEventListener('click', () => {
                window.open(release.htmlUrl, '_blank', 'noopener,noreferrer');
            }, { once: true });
        });

        qualBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speedWrap.classList.remove('open');
            qualWrap.classList.toggle('open');
        });

        volumeSlider.addEventListener('input', () => {
            applyVolume(parseFloat(volumeSlider.value));
        });

        volumeButton.addEventListener('click', () => {
            if (vid.volume <= 0 || vid.muted) {
                applyVolume(previousVolumeBeforeMute > 0 ? previousVolumeBeforeMute : 1);
                return;
            }

            previousVolumeBeforeMute = vid.volume > 0 ? vid.volume : previousVolumeBeforeMute;
            applyVolume(0);
        });

        chatController.connectVideo(vid);

        vid.addEventListener('click', togglePlay);
        btnPlay.addEventListener('click', togglePlay);
        btnBig.addEventListener('click', togglePlay);
        vid.addEventListener('play', () => {
            btnPlay.innerHTML = ICONS.pause;
            btnBig.classList.remove('visible');
        });
        vid.addEventListener('pause', () => {
            btnPlay.innerHTML = ICONS.play;
            setLoadingState(false);
            if (!vid.ended) {
                btnBig.classList.add('visible');
            }
        });
        vid.addEventListener('playing', () => {
            hasStartedPlayback = true;
            setLoadingState(false);
            btnBig.classList.remove('visible');
        });
        vid.addEventListener('waiting', () => {
            if (!vid.paused) setLoadingState(true);
        });
        vid.addEventListener('seeking', () => {
            if (hasStartedPlayback && !vid.paused) setLoadingState(true);
        });
        vid.addEventListener('seeked', () => {
            setLoadingState(false);
        });
        vid.addEventListener('canplay', () => {
            setLoadingState(false);
        });
        vid.addEventListener('canplaythrough', () => {
            setLoadingState(false);
        });
        vid.addEventListener('stalled', () => {
            if (!vid.paused) setLoadingState(true);
        });
        vid.addEventListener('loadeddata', () => {
            setLoadingState(false);
        });
        vid.addEventListener('ended', () => {
            setLoadingState(false);
            btnBig.classList.add('visible');
            localStorage.removeItem(resumeKey);
        });
        let lastSave = 0;
        
        vid.addEventListener('timeupdate', () => {
            if (Date.now() - lastSave > 4000) {
                if (isFinite(vid.duration) && vid.currentTime >= vid.duration - 10) {
                    localStorage.removeItem(resumeKey);
                } else if (vid.currentTime > 5) {
                    localStorage.setItem(resumeKey, vid.currentTime);
                }
                lastSave = Date.now();
            }
        
            if (isFinite(vid.duration)) {
                progressBar.style.width = (vid.currentTime / vid.duration * 100) + '%';
                timeDisplay.textContent = `${formatTime(vid.currentTime)} / ${formatTime(vid.duration)}`;
            }
        });
        vid.addEventListener('ended', () => {
            localStorage.removeItem(resumeKey);
        });

        let isDraggingTrack = false;
        const updateTrackPosition = (e) => {
            if (!isFinite(vid.duration)) return;
            const rect = track.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            vid.currentTime = ratio * vid.duration;
        };

        track.addEventListener('mousedown', (e) => {
            isDraggingTrack = true;
            updateTrackPosition(e);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDraggingTrack) {
                updateTrackPosition(e);
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingTrack) {
                isDraggingTrack = false;
            }
        });

        track.addEventListener('mousemove', (e) => {
            if (!isFinite(vid.duration)) return;
            const rect = track.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const hoverTime = ratio * vid.duration;

            trackTooltipTime.textContent = formatTime(hoverTime);
            trackTooltip.style.left = `${ratio * rect.width}px`;
            trackTooltip.classList.add('visible');
        });
        track.addEventListener('mouseenter', () => {
            if (isFinite(vid.duration)) trackTooltip.classList.add('visible');
        });
        track.addEventListener('mouseleave', () => {
            trackTooltip.classList.remove('visible');
        });

        let hideControlsTimeout = null;
        const showControls = () => {
            controls.style.opacity = '1';
            clearTimeout(hideControlsTimeout);
            if (!vid.paused) {
                hideControlsTimeout = setTimeout(() => {
                    if (!vid.paused && !qualWrap.classList.contains('open') && !speedWrap.classList.contains('open')) {
                        controls.style.opacity = '0';
                    }
                }, 2500);
            }
        };

        pRoot.addEventListener('mousemove', showControls);
        pRoot.addEventListener('mouseenter', showControls);
        pRoot.addEventListener('mouseleave', () => {
            qualWrap.classList.remove('open');
            speedWrap.classList.remove('open');
            trackTooltip.classList.remove('visible');
            if (!vid.paused) controls.style.opacity = '0';
        });

        btnFs.addEventListener('click', () => { if (!document.fullscreenElement) pRoot.requestFullscreen(); else document.exitFullscreen(); });
        vid.addEventListener('dblclick', () => btnFs.click());

        if (Hls.isSupported()) {
            const savedTime = parseFloat(localStorage.getItem(resumeKey));
            const hasValidResume = Number.isFinite(savedTime) && savedTime > 5;

            const hlsConfig = {
                debug: false,
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                maxBufferLength: 60,
                maxMaxBufferLength: 120,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                highBufferWatchdogPeriod: 2,
                nudgeOffset: 0.1,
                nudgeMaxRetry: 5,
                maxFragLookUpTolerance: 0.25,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 10,
                manifestLoadingTimeOut: 20000,
                manifestLoadingMaxRetry: 6,
                manifestLoadingRetryDelay: 500,
                levelLoadingTimeOut: 20000,
                levelLoadingMaxRetry: 6,
                levelLoadingRetryDelay: 500,
                fragLoadingTimeOut: 30000,
                fragLoadingMaxRetry: 6,
                fragLoadingRetryDelay: 500,
                startFragPrefetch: true
            };

            const hls = new Hls(hlsConfig);
            activeHls = hls;
            hls.loadSource(finalUrl);
            hls.attachMedia(vid);
            hls.on(Hls.Events.MANIFEST_LOADING, () => setLoadingState(true, { immediate: true }));
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setLoadingState(false);
                const setQuality = (level, label, optionRef = null, qualitySettings = null) => {
                    hls.currentLevel = level;
                    qualBtn.textContent = `${label} ▴`;
                    [...qualMenu.querySelectorAll('.k-quality-option')].forEach((option) => option.classList.remove('active'));
                    if (optionRef) optionRef.classList.add('active');
                    if (qualitySettings) savePlayerSettings(playerSettingsKey, { quality: qualitySettings });
                    qualWrap.classList.remove('open');
                };

                const addQualityItem = (level, label, qualitySettings, isActive = false) => {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'k-quality-option';
                    item.textContent = label;
                    if (isActive) item.classList.add('active');
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        setQuality(level, label, item, qualitySettings);
                    });
                    qualMenu.appendChild(item);
                    return item;
                };

                const qualityItems = [];
                const autoItem = addQualityItem(-1, 'Auto', { mode: 'auto' }, true);

                hls.levels
                    .map((lvl, idx) => ({ lvl, idx }))
                    .sort((a, b) => (b.lvl.height || 0) - (a.lvl.height || 0))
                    .forEach(({ lvl, idx }) => {
                        qualityItems.push({
                            height: lvl.height,
                            level: idx,
                            label: `${lvl.height}p`,
                            element: addQualityItem(idx, `${lvl.height}p`, { mode: 'manual', height: lvl.height })
                        });
                    });

                const savedQuality = savedPlayerSettings.quality;
                if (savedQuality?.mode === 'manual') {
                    const matchedQuality = qualityItems.find((item) => item.height === savedQuality.height);
                    if (matchedQuality) {
                        setQuality(
                            matchedQuality.level,
                            matchedQuality.label,
                            matchedQuality.element,
                            { mode: 'manual', height: matchedQuality.height }
                        );
                    } else {
                        setQuality(-1, 'Auto', autoItem, { mode: 'auto' });
                    }
                } else {
                    setQuality(-1, 'Auto', autoItem, { mode: 'auto' });
                }

                let resumeAttempted = false;
                const applyResumeTime = () => {
                    if (resumeAttempted) return;
                    if (hasValidResume && Number.isFinite(vid.duration) && vid.duration > 0) {
                        resumeAttempted = true;
                        if (savedTime < vid.duration - 15) {
                            try {
                                vid.currentTime = savedTime;
                                showToast(`Resumed at ${formatTime(savedTime)}`);
                            } catch (err) {
                                console.warn("[Kick Unlocker] Error applying resume time:", err);
                            }
                        } else {
                            localStorage.removeItem(resumeKey);
                        }
                    }
                };
                vid.addEventListener('loadedmetadata', applyResumeTime, { once: true });
                vid.addEventListener('canplay', applyResumeTime, { once: true });

                // Seamless Autoplay with automatic muted fallback
                const playPromise = vid.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        hasStartedPlayback = true;
                        setLoadingState(false);
                        btnBig.classList.remove('visible');
                    }).catch(() => {
                        // Chrome unmuted autoplay blocked! Attempt muted playback
                        vid.muted = true;
                        updateVolumeSliderVisual(0);
                        const mutedPromise = vid.play();
                        if (mutedPromise !== undefined) {
                            mutedPromise.then(() => {
                                hasStartedPlayback = true;
                                setLoadingState(false);
                                btnBig.classList.remove('visible');
                                showToast("Muted for autoplay — Click to unmute 🔊");
                            }).catch(() => {
                                vid.muted = (initialVolume === 0);
                                updateVolumeSliderVisual(initialVolume);
                                setLoadingState(false);
                                btnBig.classList.add('visible');
                            });
                        }
                    });
                }
            });

            let fatalNetworkRetries = 0;
            let fatalMediaRetries = 0;

            const showPlaybackErrorUI = () => {
                setLoadingState(false);
                btnBig.classList.remove('visible');
                const existingError = videoParent.querySelector('#k-player-error-overlay');
                if (existingError) existingError.remove();

                const errorDiv = document.createElement('div');
                errorDiv.id = 'k-player-error-overlay';
                errorDiv.innerHTML = `
                    <div style="font-size:32px;margin-bottom:8px;">⚠️</div>
                    <div style="font-size:18px;font-weight:700;color:#ff5555;margin-bottom:6px;">Stream Connection Interrupted</div>
                    <div style="font-size:13px;color:#aaa;margin-bottom:16px;">The connection to the broadcast was lost. Click below to reconnect.</div>
                    <button id="k-reconnect-btn" class="k-retry-btn">Reconnect Stream</button>
                `;
                videoParent.querySelector('#k-player')?.appendChild(errorDiv);
                errorDiv.querySelector('#k-reconnect-btn')?.addEventListener('click', () => {
                    errorDiv.remove();
                    localStorage.removeItem(resumeKey);
                    delete container.dataset.kickUnlockerProcessing;
                    unlockVideo(container);
                });
            };

            hls.on(Hls.Events.ERROR, (e, data) => {
                console.warn("[Kick Unlocker] HLS error:", data.type, data.details, data.fatal);
                if (!data.fatal) {
                    if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                        if (!vid.paused && vid.readyState < 3) {
                            setLoadingState(true);
                        }
                    }
                    return;
                }

                // Fatal error recovery with up to 3 retries
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    fatalNetworkRetries++;
                    console.warn(`[Kick Unlocker] Fatal network error (attempt ${fatalNetworkRetries}/3):`, data.details);
                    if (fatalNetworkRetries <= 3) {
                        showToast(`Reconnecting (${fatalNetworkRetries}/3)...`);
                        setLoadingState(true);
                        setTimeout(() => {
                            if (!activeHls || activeHls !== hls) return;
                            if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
                                data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ||
                                data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
                                hls.loadSource(finalUrl);
                            }
                            hls.startLoad();
                        }, fatalNetworkRetries * 800);
                    } else {
                        localStorage.removeItem(resumeKey);
                        hls.destroy();
                        showPlaybackErrorUI();
                    }
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    fatalMediaRetries++;
                    console.warn(`[Kick Unlocker] Fatal media error (attempt ${fatalMediaRetries}/3):`, data.details);
                    if (fatalMediaRetries === 1) {
                        hls.recoverMediaError();
                    } else if (fatalMediaRetries === 2) {
                        hls.swapAudioCodec();
                        hls.recoverMediaError();
                    } else {
                        localStorage.removeItem(resumeKey);
                        hls.destroy();
                        showPlaybackErrorUI();
                    }
                } else {
                    console.error("[Kick Unlocker] Fatal non-recoverable error:", data);
                    localStorage.removeItem(resumeKey);
                    hls.destroy();
                    showPlaybackErrorUI();
                }
            });

        } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = finalUrl;
        }

    } catch (e) { console.error(e); if (container) delete container.dataset.kickUnlockerProcessing; } finally { isUnlocking = false; }
}

function isVideoPage() {
    const path = window.location.pathname.toLowerCase();
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return false;
    if (['following', 'browse', 'categories', 'search', 'settings', 'dashboard', 'terms', 'privacy', 'community-guidelines'].includes(parts[0])) {
        return false;
    }
    const hasQueryVideo = window.location.search.includes('video=');
    const isVodPath = (parts.length >= 3 && (parts[1] === 'video' || parts[1] === 'videos')) ||
                      (parts.length >= 2 && parts[0] === 'video');
    return isVodPath || hasQueryVideo;
}

function findSubscriberOverlay() {
    if (!isVideoPage()) return null;

    // 1. Check specific paywall data-testids
    const byTestId = document.querySelector(
        '[data-testid="video-subscriber-only"], ' +
        '[data-testid="sub-only-video"], ' +
        '[data-testid="subscriber-only-video"], ' +
        '[data-testid="video-paywall"]'
    );
    if (byTestId) return byTestId;

    // 2. Target ONLY the main video player container on the page
    const playerContainer = document.querySelector('#channel-video-player') ||
                            document.querySelector('.aspect-video');
    if (!playerContainer || playerContainer.dataset.kickUnlockerProcessing) return null;

    const text = playerContainer.textContent || '';
    if (
        text.includes('Subscribers only') ||
        text.includes('subscribers only') ||
        text.includes('Subscribe to watch') ||
        text.includes('subscriber-only') ||
        text.includes('المشتركين فقط') ||
        text.includes('للمشتركين فقط') ||
        text.includes('اشترك للمشاهدة') ||
        text.includes('متاح للمشتركين فقط')
    ) {
        const textNodes = playerContainer.querySelectorAll('div, p, span, h2, h3, h4');
        for (const el of textNodes) {
            if (el.children.length === 0 && el.textContent) {
                const txt = el.textContent.trim().toLowerCase();
                if (
                    txt.includes('subscribers only') ||
                    txt.includes('subscribe to watch') ||
                    txt.includes('subscriber-only') ||
                    txt.includes('المشتركين فقط') ||
                    txt.includes('للمشتركين فقط') ||
                    txt.includes('اشترك للمشاهدة') ||
                    txt.includes('متاح للمشتركين فقط')
                ) {
                    return el;
                }
            }
        }
    }
    return null;
}

let currentNavUrl = window.location.href;

function isVideoPageForUrl(urlStr) {
    try {
        const parsed = new URL(urlStr, window.location.origin);
        const path = parsed.pathname.toLowerCase();
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 0) return false;
        if (['following', 'browse', 'categories', 'search', 'settings', 'dashboard', 'terms', 'privacy', 'community-guidelines'].includes(parts[0])) {
            return false;
        }
        const hasQueryVideo = parsed.search.includes('video=');
        const isVodPath = (parts.length >= 3 && (parts[1] === 'video' || parts[1] === 'videos')) ||
                          (parts.length >= 2 && parts[0] === 'video');
        return isVodPath || hasQueryVideo;
    } catch (e) {
        return false;
    }
}

function teardownCustomPlayer() {
    console.log("[Kick Unlocker] Tearing down custom player on route change...");
    clearTimeout(checkTimer);
    isUnlocking = false;

    if (activeHls) {
        try { activeHls.destroy(); } catch (e) {}
        activeHls = null;
    }
    if (activeChatController) {
        try { activeChatController.destroy(); } catch (e) {}
        activeChatController = null;
    }
    activePlayerUi = null;

    // Remove theater mode and body scroll lock
    document.documentElement.classList.remove('k-theater-mode-on');
    document.body.classList.remove('k-theater-mode-on', 'k-theater-rtl', 'kick-theater-active');

    // Remove our injected containers and wrappers from DOM
    const customElements = document.querySelectorAll('#k-theater-wrapper, .k-theater-wrapper, #k-player, #k-player-error-overlay');
    customElements.forEach(el => el.remove());

    // Reset processing attribute
    const processedContainers = document.querySelectorAll('[data-kick-unlocker-processing]');
    processedContainers.forEach(el => {
        delete el.dataset.kickUnlockerProcessing;
    });
}

function checkAndUnlockSubscriberVideo() {
    if (!isVideoPage()) return;

    const subscriberOverlay = findSubscriberOverlay();
    if (subscriberOverlay) {
        const outerContainer = subscriberOverlay.closest('#channel-video-player') ||
                               subscriberOverlay.closest('.aspect-video') ||
                               resolvePlayerContainer(subscriberOverlay);

        if (outerContainer && !outerContainer.dataset.kickUnlockerProcessing && !isUnlocking) {
            console.log("[Kick Unlocker] Subscriber overlay identified, initiating unlock sequence...");
            unlockVideo(subscriberOverlay);
        }
    }
}

// Debounced, ultra-lightweight check (zero CPU overhead)
let checkTimer = null;
function scheduleUnlockCheck(delay = 200) {
    if (!isVideoPage()) return;
    clearTimeout(checkTimer);
    checkTimer = setTimeout(checkAndUnlockSubscriberVideo, delay);
}

function handleNavigationChange() {
    const newUrl = window.location.href;
    if (newUrl !== currentNavUrl) {
        const wasOnVideo = isVideoPageForUrl(currentNavUrl);
        currentNavUrl = newUrl;

        // If navigating away from a video, or switching videos: teardown previous player
        if (wasOnVideo) {
            teardownCustomPlayer();
        }
    }

    if (isVideoPage()) {
        scheduleUnlockCheck(100);
        scheduleUnlockCheck(350);
    }
}

// Hook SPA route changes (fast and targeted, no CPU overhead)
const origPushState = history.pushState;
history.pushState = function(...args) {
    origPushState.apply(this, args);
    handleNavigationChange();
};

const origReplaceState = history.replaceState;
history.replaceState = function(...args) {
    origReplaceState.apply(this, args);
    handleNavigationChange();
};

window.addEventListener('popstate', () => {
    handleNavigationChange();
});

// Observe DOM with debouncing - never fires on homepage or following
const observer = new MutationObserver(() => {
    if (isVideoPage() && !isUnlocking) {
        scheduleUnlockCheck(250);
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial check on load
if (isVideoPage()) {
    scheduleUnlockCheck(100);
}