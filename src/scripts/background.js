// Background Service Worker
console.log("Kick Unlocker: Background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "CHECK_STREAM_URL") {
        checkUrlAsync(message.url).then(isValid => {
            sendResponse({ valid: isValid });
        });
        return true; // Keep the messaging channel open
    }

    if (message.action === 'FETCH_JSON') {
        fetchJsonAsync(message.url).then(data => {
            sendResponse({ data });
        }).catch(() => {
            sendResponse({ data: null });
        });
        return true;
    }

    if (message.action === 'MINT_PLAYBACK') {
        mintPlaybackAsync(message.videoId, message.urlPath).then(vod => {
            sendResponse({ vod: vod || null });
        });
        return true;
    }

    if (message.action === "GET_LATEST_RELEASE") {
        getLatestReleaseAsync().then((release) => {
            sendResponse({ release });
        }).catch(() => {
            sendResponse({ release: null });
        });
        return true;
    }
});

async function fetchJsonAsync(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*'
            },
            cache: 'no-store'
        });
        if (!response.ok && response.status !== 403) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

async function checkUrlAsync(url) {
    try {
        let response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (response.ok) {
            const ct = (response.headers.get('content-type') || '').toLowerCase();
            if (!ct.includes('xml') && !ct.includes('html')) {
                return true;
            }
        }
        if (response.status === 403 || response.status === 405) {
            response = await fetch(url, {
                method: 'GET',
                headers: { 'Range': 'bytes=0-50' },
                cache: 'no-store'
            });
            if (response.ok || response.status === 206) {
                const ct = (response.headers.get('content-type') || '').toLowerCase();
                const text = await response.text();
                if (text.includes('#EXTM3U') || ct.includes('mpegurl') || ct.includes('octet-stream')) {
                    return true;
                }
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function getLatestReleaseAsync() {
    try {
        const response = await fetch('https://api.github.com/repos/Enmn/KickNoSub/releases/latest', {
            headers: {
                'Accept': 'application/vnd.github+json'
            },
            cache: 'no-store'
        });

        if (!response.ok) return null;

        const data = await response.json();
        return {
            tagName: data.tag_name,
            htmlUrl: data.html_url,
            name: data.name
        };
    } catch (e) {
        return null;
    }
}

// Mirrors the kick.com web player: mints a playback URL for a VOD.
// Returns playback_url (master manifest) or null.
async function mintPlaybackAsync(videoId, urlPath) {
    const payload = JSON.stringify({
        video_player: {
            player: {
                player_name: 'web',
                player_version: '1.0.0',
                player_software: 'IVS Player',
                player_software_version: '1.28.0'
            },
            mux_sdk: { sdk_available: false },
            pal_sdk: { sdk_available: false, nonce: '' },
            datazoom_sdk: { sdk_available: false, datazoom_sdk_version: '', om_sdk_version: '' },
            google_ads_sdk: { sdk_available: false }
        },
        video_session: {
            page_type: 'vod',
            player_remote_played: false,
            enable_sampling: false,
            url_path: urlPath || `/channel/videos/${videoId}`,
            autoplay_behaviour: 'auto',
            play_muted: false,
            viewer_connection_type: ''
        },
        user_session: {
            session_id: '',
            player_device_id: 'unknown',
            browser_lang: (typeof navigator !== 'undefined' && navigator.language) || 'en-US',
            non_personalised_ads: false,
            ad_targeting: ''
        }
    });

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    };

    const endpoints = [
        `https://web.kick.com/api/v1/stream/${videoId}/playback`,
        `https://kick.com/api/v1/stream/${videoId}/playback`,
        `https://kick.com/api/v2/stream/${videoId}/playback`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: payload,
                cache: 'no-store'
            });
            if (response.ok) {
                const data = await response.json();
                let vod = null;
                if (typeof data?.playback_url === 'string') {
                    vod = data.playback_url;
                } else if (data?.playback_url && typeof data.playback_url === 'object') {
                    vod = data.playback_url.vod || data.playback_url.url || data.playback_url.live || data.playback_url.master || data.playback_url.hls;
                } else if (data?.stream_url) {
                    vod = data.stream_url;
                } else if (data?.url) {
                    vod = data.url;
                }
                if (vod) return vod;
            }
        } catch (e) {}
    }

    return null;
}