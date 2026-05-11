// spotify.js — Spotify PKCE OAuth + OCEAN psyche derivation (no React)
// UI component lives in character-forge.jsx as SpotifySection

const SPOTIFY_CLIENT_ID = 'cc8586818bbc4cecba46b5686a81f79a';
const REDIRECT_URI = window.location.origin + window.location.pathname.replace(/\/$/, '');
const SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function generateCodeVerifier() {
  const array = new Uint32Array(56);
  crypto.getRandomValues(array);
  return Array.from(array, d => d.toString(36)).join('');
}

window.SpotifyAuth = {
  async login() {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem('spotify_verifier', verifier);
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });
    window.location = `https://accounts.spotify.com/authorize?${params}`;
  },

  async handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return null;
    const verifier = sessionStorage.getItem('spotify_verifier');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    });
    const data = await response.json();
    if (data.access_token) {
      sessionStorage.setItem('spotify_token', data.access_token);
      if (data.refresh_token) sessionStorage.setItem('spotify_refresh', data.refresh_token);
      window.history.replaceState({}, '', window.location.pathname);
      return data.access_token;
    }
    return null;
  },

  getToken() { return sessionStorage.getItem('spotify_token'); },

  logout() {
    sessionStorage.removeItem('spotify_token');
    sessionStorage.removeItem('spotify_refresh');
    sessionStorage.removeItem('spotify_verifier');
  },

  async api(endpoint) {
    const token = this.getToken();
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { this.logout(); throw new Error('Token expired'); }
    if (!res.ok) throw new Error(`Spotify API error ${res.status}`);
    return res.json();
  },

  async getPlaylist(playlistId) {
    return this.api(
      `/playlists/${playlistId}?fields=name,description,tracks(items(track(id,name,popularity,uri,artists(id,name),album(release_date,images))))`
    );
  },

  async getArtistGenres(artistIds) {
    const unique = [...new Set(artistIds)].slice(0, 50);
    const data = await this.api(`/artists?ids=${unique.join(',')}`);
    return data.artists;
  },

  async getUserProfile() { return this.api('/me'); },
};

window.SpotifyPsyche = {
  GENRE_OCEAN_MAP: {
    high_openness:    ['jazz', 'experimental', 'avant-garde', 'classical', 'progressive',
                       'art rock', 'indie', 'folk', 'ambient', 'world', 'psychedelic', 'fusion', 'blues'],
    low_openness:     ['pop', 'country', 'top 40', 'mainstream', 'dance pop', 'teen pop'],

    high_conscientiousness: ['classical', 'jazz', 'orchestral', 'progressive', 'technical', 'instrumental'],
    low_conscientiousness:  ['punk', 'grunge', 'noise', 'lo-fi', 'garage'],

    high_extraversion: ['dance', 'hip-hop', 'pop', 'edm', 'house', 'party', 'trap', 'reggaeton', 'latin'],
    low_extraversion:  ['ambient', 'classical', 'folk', 'acoustic', 'shoegaze', 'lo-fi', 'singer-songwriter'],

    high_agreeableness: ['gospel', 'soul', 'r&b', 'folk', 'singer-songwriter', 'indie folk', 'soft rock'],
    low_agreeableness:  ['death metal', 'black metal', 'hardcore', 'industrial', 'noise', 'punk', 'rap metal'],

    high_neuroticism: ['emo', 'post-punk', 'dark', 'gothic', 'sad', 'melancholic', 'shoegaze', 'doom', 'depressive'],
    low_neuroticism:  ['reggae', 'gospel', 'upbeat', 'happy', 'tropical', 'beach', 'summer'],
  },

  deriveOCEAN(playlist, artists) {
    const allGenres = artists.flatMap(a => a.genres || []).map(g => g.toLowerCase());
    const tracks = playlist.tracks.items.map(i => i.track).filter(Boolean);

    const score = (dimension) => {
      const highKeywords = this.GENRE_OCEAN_MAP[`high_${dimension}`] || [];
      const lowKeywords  = this.GENRE_OCEAN_MAP[`low_${dimension}`]  || [];
      let highHits = 0, lowHits = 0;
      allGenres.forEach(genre => {
        if (highKeywords.some(k => genre.includes(k))) highHits++;
        if (lowKeywords.some(k => genre.includes(k))) lowHits++;
      });
      const total = highHits + lowHits;
      return total === 0 ? 50 : Math.round((highHits / total) * 100);
    };

    const popularities = tracks.map(t => t.popularity || 50);
    const avgPop = popularities.reduce((a, b) => a + b, 0) / popularities.length;
    const popularityOpenness = Math.round((1 - avgPop / 100) * 40);
    const uniqueArtists = new Set(tracks.flatMap(t => t.artists.map(a => a.id))).size;
    const diversityOpenness = Math.min(20, Math.round((uniqueArtists / tracks.length) * 30));
    const O = Math.min(100, score('openness') + popularityOpenness + diversityOpenness);

    return {
      O,
      C: score('conscientiousness'),
      E: score('extraversion'),
      A: score('agreeableness'),
      N: score('neuroticism'),
    };
  },

  deriveTraits(genres) {
    const g = genres.join(' ').toLowerCase();
    const traits = [];
    if (g.includes('jazz') || g.includes('experimental'))
      traits.push({ label: 'Intellectually restless', color: '#00D4FF' });
    if (g.includes('metal') || g.includes('hardcore'))
      traits.push({ label: 'Driven by intensity', color: '#CC2200' });
    if (g.includes('ambient') || g.includes('classical'))
      traits.push({ label: 'Inner world dominant', color: '#7B2FFF' });
    if (g.includes('hip-hop') || g.includes('rap'))
      traits.push({ label: 'Narrative intelligence', color: '#FFB347' });
    if (g.includes('folk') || g.includes('singer-songwriter'))
      traits.push({ label: 'Emotionally present', color: '#A5D6A7' });
    if (g.includes('punk') || g.includes('grunge'))
      traits.push({ label: 'Anti-authoritarian', color: '#F06292' });
    if (g.includes('soul') || g.includes('r&b'))
      traits.push({ label: 'Empathy-forward', color: '#4DB6AC' });
    if (g.includes('emo') || g.includes('dark'))
      traits.push({ label: 'Shadow-integrated', color: '#9575CD' });
    return traits.slice(0, 3);
  },

  parsePlaylistId(input) {
    const match = input.match(/playlist[/:]([a-zA-Z0-9]+)/);
    return match ? match[1] : input.trim();
  },
};
