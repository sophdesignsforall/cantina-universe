// spotify.js — Spotify PKCE OAuth + psyche derivation + SpotifyPanel UI

const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
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

// ─── OCEAN derivation ───────────────────────────────────────────────────────

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

// ─── SpotifyPanel React component ───────────────────────────────────────────

const SpotifyIcon = ({ size = 16, fill = '#1DB954' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

window.SpotifyPanel = function SpotifyPanel({ onOceanDerived, onTraitsAdded }) {
  const [isConnected, setIsConnected] = React.useState(!!SpotifyAuth.getToken());
  const [playlistUrl, setPlaylistUrl] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [nowPlaying, setNowPlaying] = React.useState(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      SpotifyAuth.handleCallback().then(token => {
        if (token) setIsConnected(true);
      });
    }
  }, []);

  const handleConnect = () => SpotifyAuth.login();

  const handleDisconnect = () => {
    SpotifyAuth.logout();
    setIsConnected(false);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!playlistUrl.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const playlistId = SpotifyPsyche.parsePlaylistId(playlistUrl);
      const playlist = await SpotifyAuth.getPlaylist(playlistId);
      const tracks = playlist.tracks.items.map(i => i.track).filter(Boolean);
      const artistIds = [...new Set(tracks.flatMap(t => t.artists.map(a => a.id)))];
      const artists = await SpotifyAuth.getArtistGenres(artistIds);
      const ocean = SpotifyPsyche.deriveOCEAN(playlist, artists);
      const allGenres = artists.flatMap(a => a.genres || []);
      const traits = SpotifyPsyche.deriveTraits(allGenres);

      const topTracks = tracks.slice(0, 5).map(t => ({
        name: t.name,
        artist: t.artists[0]?.name,
        image: t.album?.images?.[2]?.url,
        uri: t.uri,
        popularity: t.popularity,
      }));

      const genreCount = {};
      allGenres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; });
      const topGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g]) => g);

      const analysis = { playlistName: playlist.name, trackCount: tracks.length, topTracks, topGenres, ocean, traits };
      setResult(analysis);

      if (onOceanDerived) onOceanDerived(ocean);
      if (onTraitsAdded) onTraitsAdded(traits);
    } catch (err) {
      setError('Could not analyze playlist. Check the URL and try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePlay = (uri) => {
    window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank');
    setNowPlaying(uri);
  };

  const panelBase = {
    margin: '0',
    background: 'var(--bg-subtle)',
    border: '1px solid rgba(29,185,84,0.15)',
    borderRadius: 10,
    overflow: 'hidden',
  };

  const headerRow = {
    padding: '10px 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    cursor: 'pointer',
  };

  if (!isExpanded) {
    return (
      <div onClick={() => setIsExpanded(true)} style={{ ...panelBase, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SpotifyIcon size={15}/>
            <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Spotify Psyche
            </span>
            {isConnected && (
              <span style={{
                fontSize: 9, color: '#1DB954',
                background: 'rgba(29,185,84,0.12)',
                padding: '1px 7px', borderRadius: 20,
                fontFamily: 'DM Mono, monospace', fontWeight: 600,
                letterSpacing: '0.08em',
              }}>CONNECTED</span>
            )}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1 }}>+</span>
        </div>
      </div>
    );
  }

  return (
    <div style={panelBase}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(false)}
        style={{ ...headerRow, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SpotifyIcon size={15}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            Spotify Psyche
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            Build character from music
          </span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18, lineHeight: 1 }}>−</span>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Disconnected state */}
        {!isConnected && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.5 }}>
              Connect Spotify to analyze a playlist and derive this character's psyche from their music
            </p>
            <button
              onClick={handleConnect}
              style={{
                background: '#1DB954', border: 'none', borderRadius: 24,
                padding: '9px 22px', color: '#000', fontWeight: 700,
                fontSize: 12, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <SpotifyIcon size={14} fill="#000"/>
              Connect with Spotify
            </button>
          </div>
        )}

        {/* Connected state */}
        {isConnected && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#1DB954' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1DB954' }}/>
                Spotify connected
              </div>
              <button
                onClick={handleDisconnect}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer' }}
              >
                Disconnect
              </button>
            </div>

            {/* Playlist input */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Paste playlist URL
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={playlistUrl}
                  onChange={e => setPlaylistUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  style={{
                    flex: 1, background: 'var(--bg-base)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 7, padding: '7px 11px',
                    color: '#fff', fontSize: 11,
                    fontFamily: 'DM Mono, monospace', outline: 'none',
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !playlistUrl.trim()}
                  style={{
                    background: isAnalyzing ? 'rgba(255,255,255,0.05)' : '#1DB954',
                    border: 'none', borderRadius: 7,
                    padding: '7px 13px',
                    color: isAnalyzing ? 'rgba(255,255,255,0.3)' : '#000',
                    fontWeight: 700, fontSize: 11,
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isAnalyzing ? 'Analyzing…' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(204,34,0,0.1)', border: '1px solid rgba(204,34,0,0.3)',
                borderRadius: 7, padding: '9px 11px',
                fontSize: 11, color: '#FF6644', marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{result.playlistName}</span>
                  {' · '}{result.trackCount} tracks analyzed
                </div>

                {/* Applied badge */}
                <div style={{
                  background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)',
                  borderRadius: 7, padding: '7px 11px',
                  fontSize: 11, color: '#1DB954',
                  display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1DB954', flexShrink: 0 }}/>
                  Psyche matrix updated from music
                </div>

                {/* Genres */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Dominant genres
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {result.topGenres.map((g, i) => (
                      <span key={i} style={{
                        fontSize: 10, color: 'rgba(255,255,255,0.6)',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 20, padding: '2px 9px',
                      }}>{g}</span>
                    ))}
                  </div>
                </div>

                {/* Derived traits */}
                {result.traits.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                      Character traits derived
                    </div>
                    {result.traits.map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }}/>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Track list */}
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Tracks from this playlist
                  </div>
                  {result.topTracks.map((track, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '5px 0',
                      borderBottom: i < result.topTracks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      {track.image
                        ? <img src={track.image} alt={track.name} style={{ width: 30, height: 30, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}/>
                        : <div style={{ width: 30, height: 30, borderRadius: 4, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}/>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</div>
                      </div>
                      <button
                        onClick={() => handlePlay(track.uri)}
                        title="Open in Spotify"
                        style={{
                          background: nowPlaying === track.uri ? '#1DB954' : 'rgba(255,255,255,0.06)',
                          border: 'none', borderRadius: '50%',
                          width: 26, height: 26,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="8" height="10" viewBox="0 0 10 12" fill={nowPlaying === track.uri ? '#000' : '#1DB954'}>
                          <path d="M0 0l10 6-10 6z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
