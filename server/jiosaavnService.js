// ============================================
// Cinema Muchatlu - Native JioSaavn Service
// Self-contained in-process song fetching & decryption
// (No external microservice or port 3000 needed!)
// ============================================

const forge = require('node-forge');
const axios = require('axios');

const DES_KEY = '38346591';
const DES_IV = '00000000';

function decodeHtmlEntities(str) {
    if (!str) return '';
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

function decryptMediaUrl(encryptedMediaUrl) {
    if (!encryptedMediaUrl) return '';
    try {
        const encrypted = forge.util.decode64(encryptedMediaUrl);
        const decipher = forge.cipher.createDecipher('DES-ECB', forge.util.createBuffer(DES_KEY));
        decipher.start({ iv: forge.util.createBuffer(DES_IV) });
        decipher.update(forge.util.createBuffer(encrypted));
        decipher.finish();
        const decrypted = decipher.output.getBytes();
        if (!decrypted || !decrypted.startsWith('http')) return '';
        return decrypted.replace('_96', '_320');
    } catch (err) {
        return '';
    }
}

function formatImageUrl(rawImage) {
    if (!rawImage) return '';
    let img = Array.isArray(rawImage) ? (rawImage[rawImage.length - 1]?.url || rawImage[0]?.link || '') : rawImage;
    return img
        .replace(/150x150|50x50/, '500x500')
        .replace(/^http:\/\//, 'https://');
}

// Fallback tracks with real, verifiable high-quality audio streams
const FALLBACK_TRACKS = [
    {
        title: "Naa Roja Nuvve (From Kushi)",
        artist: "Hesham Abdul Wahab",
        thumbnailUrl: "https://c.saavncdn.com/712/Kushi-Telugu-2023-20230829141042-500x500.jpg",
        mediaUrl: "https://aac.saavncdn.com/712/e6ee877991316b2cf7fae69123fe55ae_320.mp4",
        providerId: "kushi_roja"
    },
    {
        title: "Srivalli (From Pushpa)",
        artist: "Sid Sriram, Devi Sri Prasad",
        thumbnailUrl: "https://c.saavncdn.com/188/Srivalli-From-Pushpa-The-Rise-Part-01-Telugu-2021-20211013110903-500x500.jpg",
        mediaUrl: "https://aac.saavncdn.com/188/63ae4a4cb40efab244bbdc07bf45eb69_320.mp4",
        providerId: "pushpa_srivalli"
    },
    {
        title: "Chikiri Chikiri (From Peddi)",
        artist: "Jani Master, A.R. Rahman",
        thumbnailUrl: "https://c.saavncdn.com/735/Chikiri-Chikiri-From-Peddi-Telugu-Telugu-2025-20251107191120-500x500.jpg",
        mediaUrl: "https://aac.saavncdn.com/735/afffe241f71836496fd3ebd720b06822_320.mp4",
        providerId: "peddi_chikiri"
    },
    {
        title: "Chuttamalle (From Devara)",
        artist: "Shilpa Rao, Anirudh Ravichander",
        thumbnailUrl: "https://c.saavncdn.com/814/Summer-Hot-Romatic-Waves-Telugu-2026-20260601162119-500x500.jpg",
        mediaUrl: "https://aac.saavncdn.com/814/8816aa4082d1bf261fd3c3a4533a2898_320.mp4",
        providerId: "devara_chuttamalle"
    }
];

async function searchSongs(query = 'telugu hit songs', limit = 40) {
    const url = 'https://www.jiosaavn.com/api.php';
    const params = {
        __call: 'search.getResults',
        _format: 'json',
        _marker: '0',
        api_version: '4',
        ctx: 'web6dot0',
        p: '1',
        n: String(limit),
        q: query
    };

    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const response = await axios.get(url, {
        params,
        headers: {
            'User-Agent': userAgent,
            'Accept': 'application/json, text/plain, */*'
        },
        timeout: 8000
    });

    const rawData = response.data;
    const rawSongs = rawData?.results || rawData?.data?.results || [];

    const parsedSongs = rawSongs
        .map(song => {
            const encUrl = song.more_info?.encrypted_media_url;
            const mediaUrl = encUrl ? decryptMediaUrl(encUrl) : '';
            if (!mediaUrl) return null;

            return {
                title: decodeHtmlEntities(song.title || song.song || song.name || 'Untitled Song'),
                artist: decodeHtmlEntities(
                    song.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', ') ||
                    song.more_info?.primary_artists ||
                    song.primary_artists ||
                    'Unknown Artist'
                ),
                thumbnailUrl: formatImageUrl(song.image),
                mediaUrl: mediaUrl,
                providerId: song.id || song.perma_url
            };
        })
        .filter(Boolean);

    if (parsedSongs.length === 0) {
        return FALLBACK_TRACKS;
    }

    return parsedSongs;
}

module.exports = {
    searchSongs,
    FALLBACK_TRACKS
};
