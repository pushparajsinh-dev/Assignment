import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Music,
  Search,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import './MusicPlayer.css';

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const DEFAULT_AUDIO_SAMPLES = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
];

const DEFAULT_ARTWORK_SAMPLES = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1445985543469-221e57446370?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80"
];

const MusicPlayer = ({ 
  songs = [], 
  currentIndex = 0, 
  onNextSong, 
  onPrevSong,
  isPlaying,
  setIsPlaying,
  onAddSong,
  onRemoveSong,
  searchQuery,
  setSearchQuery,
  onSelectSong
}) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  // Add music modal/form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newArtworkUrl, setNewArtworkUrl] = useState('');

  const currentSong = songs[currentIndex] || null;

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && currentSong) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying && currentSong) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex, currentSong]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.8);
      if (audioRef.current) {
        audioRef.current.volume = prevVolume || 0.8;
      }
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  const handleSongEnded = () => {
    onNextSong();
  };

  // Add Song Handler
  const handleOpenAddModal = () => {
    const randomAudio = DEFAULT_AUDIO_SAMPLES[Math.floor(Math.random() * DEFAULT_AUDIO_SAMPLES.length)];
    const randomArt = DEFAULT_ARTWORK_SAMPLES[Math.floor(Math.random() * DEFAULT_ARTWORK_SAMPLES.length)];
    setNewTitle('');
    setNewArtist('');
    setNewAudioUrl(randomAudio);
    setNewArtworkUrl(randomArt);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTrack = {
      id: Date.now(),
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Unknown Artist',
      album: 'Custom Added',
      artwork: newArtworkUrl.trim() || DEFAULT_ARTWORK_SAMPLES[0],
      audioUrl: newAudioUrl.trim() || DEFAULT_AUDIO_SAMPLES[0],
      duration: '4:15'
    };

    onAddSong(newTrack);
    setIsAddModalOpen(false);
  };

  // Filter songs for search preview
  const searchResults = searchQuery.trim()
    ? songs
        .map((s, idx) => ({ ...s, originalIndex: idx }))
        .filter(
          (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.artist.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const currentVolumeLevel = isMuted ? 0 : volume;

  return (
    <div className="music-player-panel">
      {/* 1. Search Bar */}
      <div className="search-bar-wrapper">
        <div className="search-input-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search music (title or artist)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown List */}
        {searchQuery.trim() !== '' && (
          <div className="search-results-dropdown">
            <div className="search-results-header">
              <span>Matching Tracks ({searchResults.length})</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="search-no-results">No music matched "{searchQuery}"</div>
            ) : (
              <div className="search-results-list">
                {searchResults.map((item) => (
                  <div key={item.id} className="search-result-row">
                    <img
                      src={item.artwork}
                      alt={item.title}
                      className="search-result-thumb"
                    />
                    <div
                      className="search-result-info"
                      onClick={() => {
                        onSelectSong(item.originalIndex);
                        setSearchQuery('');
                      }}
                      title="Click to play this track"
                    >
                      <span className="search-result-title">{item.title}</span>
                      <span className="search-result-artist">{item.artist}</span>
                    </div>
                    <div className="search-result-actions">
                      <button
                        onClick={() => {
                          onSelectSong(item.originalIndex);
                          setSearchQuery('');
                        }}
                        className="search-play-btn"
                        title="Play track"
                      >
                        <Play size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSong(item.id);
                        }}
                        className="search-delete-btn"
                        title="Remove track"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Header: Add Music & Remove Current */}
      <div className="player-actions-toolbar">
        <button
          onClick={handleOpenAddModal}
          className="action-pill-btn add-btn"
          title="Add a new music track to playlist"
        >
          <Plus size={14} />
          <span>Add Music</span>
        </button>

        {currentSong && (
          <button
            onClick={() => onRemoveSong(currentSong.id)}
            className="action-pill-btn remove-btn"
            title="Remove current playing track"
          >
            <Trash2 size={14} />
            <span>Remove Current</span>
          </button>
        )}
      </div>

      {/* 2. Main Music Player Card */}
      {currentSong ? (
        <div className="music-player-card">
          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleSongEnded}
            preload="metadata"
          />

          {/* Album Artwork */}
          <div className="artwork-wrapper">
            <img
              src={currentSong.artwork}
              alt={currentSong.title}
              className="album-artwork"
            />
          </div>

          {/* Track Info with Quick Remove */}
          <div className="track-details">
            <div className="title-row">
              <h2 className="track-title" title={currentSong.title}>
                {currentSong.title}
              </h2>
            </div>
            <p className="track-artist">{currentSong.artist}</p>
            <span className="track-album">{currentSong.album}</span>
          </div>

          {/* Progress Bar & Durations */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="progress-slider"
                style={{
                  background: `linear-gradient(to right, #18191c ${progressPercentage}%, #e3e6eb ${progressPercentage}%)`
                }}
                aria-label="Progress Bar"
              />
            </div>
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="playback-controls">
            <button
              onClick={onPrevSong}
              className="control-btn nav-btn"
              title="Previous Track"
              aria-label="Previous Track"
              disabled={songs.length <= 1}
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlayPause}
              className="control-btn play-pause-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-icon-offset" />}
            </button>

            <button
              onClick={onNextSong}
              className="control-btn nav-btn"
              title="Next Track"
              aria-label="Next Track"
              disabled={songs.length <= 1}
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-section">
            <button 
              onClick={toggleMute} 
              className="volume-icon-btn"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={17} />
              ) : volume < 0.5 ? (
                <Volume1 size={17} />
              ) : (
                <Volume2 size={17} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentVolumeLevel}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{
                background: `linear-gradient(to right, #18191c ${currentVolumeLevel * 100}%, #e3e6eb ${currentVolumeLevel * 100}%)`
              }}
              aria-label="Volume Slider"
            />
            <span className="volume-percentage">
              {Math.round(currentVolumeLevel * 100)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-playlist-card">
          <Music size={40} className="empty-icon" />
          <h3 className="empty-title">Playlist is Empty</h3>
          <p className="empty-desc">All nodes have been removed. Add a music track to restart playback and visualization.</p>
          <button onClick={handleOpenAddModal} className="action-pill-btn add-btn empty-add-btn">
            <Plus size={14} />
            <span>Add Music Track</span>
          </button>
        </div>
      )}

      {/* 3. Add Music Modal / Form */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="add-music-modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Music Track</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="add-music-form">
              <div className="form-group">
                <label className="form-label">Song Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Echoes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Artist Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aurora Sound"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Audio URL (.mp3)</label>
                <input
                  type="url"
                  placeholder="Audio stream URL"
                  value={newAudioUrl}
                  onChange={(e) => setNewAudioUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Artwork Image URL</label>
                <input
                  type="url"
                  placeholder="Cover image URL"
                  value={newArtworkUrl}
                  onChange={(e) => setNewArtworkUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                >
                  Add Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
