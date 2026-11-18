import React from 'react';
import { ArrowRight, ArrowLeft, Disc3, CircleDot, Play } from 'lucide-react';
import './LinkedListVisualizer.css';

const LinkedListVisualizer = ({ songs = [], currentIndex = 0, onSelectSong, isPlaying }) => {
  return (
    <div className="linked-list-container">
      <div className="visualizer-header">
        <div className="header-badge">Data Structure Visualization</div>
        <h2>Doubly Linked List Representation</h2>
        <p className="visualizer-subtitle">
          Each node represents a song track with <code>prev</code> and <code>next</code> memory pointers.
        </p>
      </div>

      <div className="list-meta-info">
        <div className="meta-card">
          <span className="meta-label">Total Nodes:</span>
          <span className="meta-value">{songs.length}</span>
        </div>
        <div className="meta-card">
          <span className="meta-label">Head Node:</span>
          <span className="meta-value">{songs[0]?.title || 'NULL'}</span>
        </div>
        <div className="meta-card">
          <span className="meta-label">Tail Node:</span>
          <span className="meta-value">{songs[songs.length - 1]?.title || 'NULL'}</span>
        </div>
        <div className="meta-card highlight">
          <span className="meta-label">Current Pointer:</span>
          <span className="meta-value">Node [{currentIndex + 1}]</span>
        </div>
      </div>

      {/* Nodes display */}
      <div className="nodes-scroll-container">
        <div className="null-indicator">
          <span>NULL</span>
        </div>
        <div className="bidirectional-arrow">
          <ArrowLeft size={16} />
          <ArrowRight size={16} />
        </div>

        {songs.map((song, index) => {
          const isCurrent = index === currentIndex;
          return (
            <React.Fragment key={song.id}>
              <div 
                className={`node-card ${isCurrent ? 'active-node' : ''}`}
                onClick={() => onSelectSong && onSelectSong(index)}
                title="Click node to traverse and play"
              >
                {/* Pointer tags */}
                <div className="node-pointer-tag prev-ptr">
                  <span>prev:</span> {index === 0 ? 'NULL' : `Node ${index}`}
                </div>

                <div className="node-badge-row">
                  <span className="node-index">Node #{index + 1}</span>
                  {isCurrent && (
                    <span className="now-playing-badge">
                      {isPlaying ? <Disc3 size={13} className="spin-icon" /> : <CircleDot size={13} />}
                      {isPlaying ? 'PLAYING' : 'CURRENT'}
                    </span>
                  )}
                </div>

                <div className="node-content">
                  <img src={song.artwork} alt={song.title} className="node-thumbnail" />
                  <div className="node-details">
                    <span className="node-title">{song.title}</span>
                    <span className="node-artist">{song.artist}</span>
                    <span className="node-duration">{song.duration}</span>
                  </div>
                </div>

                <div className="node-pointer-tag next-ptr">
                  <span>next:</span> {index === songs.length - 1 ? 'NULL' : `Node ${index + 2}`}
                </div>
              </div>

              {/* Connecting pointer arrow between nodes */}
              {index < songs.length - 1 ? (
                <div className="bidirectional-arrow">
                  <ArrowRight size={18} className="arrow-forward" />
                  <ArrowLeft size={18} className="arrow-backward" />
                </div>
              ) : (
                <div className="bidirectional-arrow">
                  <ArrowRight size={18} />
                  <ArrowLeft size={18} />
                </div>
              )}
            </React.Fragment>
          );
        })}

        <div className="null-indicator">
          <span>NULL</span>
        </div>
      </div>

      {/* Traversal State Panel */}
      <div className="traversal-info-panel">
        <h3>Traversal & Pointer Inspection</h3>
        <div className="pointer-table">
          <div className="pointer-row">
            <span className="row-label">Previous Pointer (&larr; prev):</span>
            <span className="row-data">
              {currentIndex > 0 ? `Node ${currentIndex} ("${songs[currentIndex - 1]?.title}")` : 'NULL (Start of list)'}
            </span>
          </div>
          <div className="pointer-row current-row">
            <span className="row-label">Current Node (*current):</span>
            <span className="row-data">
              Node {currentIndex + 1} ("{songs[currentIndex]?.title}")
            </span>
          </div>
          <div className="pointer-row">
            <span className="row-label">Next Pointer (next &rarr;):</span>
            <span className="row-data">
              {currentIndex < songs.length - 1 ? `Node ${currentIndex + 2} ("${songs[currentIndex + 1]?.title}")` : 'NULL (End of list)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;

