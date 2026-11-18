import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import CircularLinkedListVisualizer from './components/CircularLinkedListVisualizer';
import initialMusicData from './data/musicData.json';
import { Disc } from 'lucide-react';
import './App.css';

function App() {
  const [songs, setSongs] = useState(initialMusicData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNextSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevSong = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handleSelectSong = (index) => {
    if (index >= 0 && index < songs.length) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleAddSong = (newSong) => {
    setSongs((prev) => {
      const updated = [...prev, newSong];
      return updated;
    });
  };

  const handleRemoveSong = (idToRemove) => {
    setSongs((prev) => {
      const indexToRemove = prev.findIndex((s) => s.id === idToRemove);
      if (indexToRemove === -1) return prev;
      
      const newSongs = prev.filter((s) => s.id !== idToRemove);
      
      if (newSongs.length === 0) {
        setCurrentIndex(0);
        setIsPlaying(false);
      } else if (currentIndex >= newSongs.length) {
        setCurrentIndex(newSongs.length - 1);
      } else if (currentIndex > indexToRemove) {
        setCurrentIndex((prevIdx) => prevIdx - 1);
      }
      return newSongs;
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-badge">
            <Disc size={18} className="brand-icon" />
          </div>
          <span className="brand-title">Audio Player</span>
        </div>
        <div className="track-counter">
          {songs.length > 0 ? `${currentIndex + 1} / ${songs.length}` : '0 / 0'}
        </div>
      </header>

      <main className="main-layout">
        {/* Left 30%: Music Player with Add, Remove, and Search */}
        <section className="player-pane">
          <MusicPlayer
            songs={songs}
            currentIndex={currentIndex}
            onNextSong={handleNextSong}
            onPrevSong={handlePrevSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onAddSong={handleAddSong}
            onRemoveSong={handleRemoveSong}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectSong={handleSelectSong}
          />
        </section>

        {/* Divider */}
        <div className="pane-divider" />

        {/* Rest (70%): Circular Doubly Linked List Visualizer */}
        <section className="preview-pane">
          <CircularLinkedListVisualizer
            songs={songs}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            searchQuery={searchQuery}
            onSelectNode={handleSelectSong}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
