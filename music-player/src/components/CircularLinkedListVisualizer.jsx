import React, { useRef, useEffect } from 'react';
import { Play, Pause, Search } from 'lucide-react';
import './CircularLinkedListVisualizer.css';

const CircularLinkedListVisualizer = ({
  songs = [],
  currentIndex = 0,
  isPlaying = false,
  searchQuery = '',
  onSelectNode
}) => {
  const lastIndex = songs.length - 1;
  const activeNodeRef = useRef(null);
  const firstMatchRef = useRef(null);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Auto-scroll active node smoothly into view when song changes or search matches
  useEffect(() => {
    if (cleanQuery && firstMatchRef.current) {
      firstMatchRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    } else if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex, cleanQuery]);

  // Empty Linked List State
  if (songs.length === 0) {
    return (
      <div className="cll-empty-view">
        <div className="empty-cll-pointers">
          <div className="empty-pointer-chip">
            <span>head &rarr; NULL</span>
          </div>
          <div className="empty-pointer-chip">
            <span>tail &rarr; NULL</span>
          </div>
          <div className="empty-pointer-chip">
            <span>current &rarr; NULL</span>
          </div>
        </div>
        <div className="empty-cll-box">
          <span className="empty-cll-text">Circular Doubly Linked List is Empty</span>
          <span className="empty-cll-sub">Use "Add Music" in the player panel to insert a new head node.</span>
        </div>
      </div>
    );
  }

  let hasSetFirstMatch = false;

  return (
    <div className="cll-scroll-viewport">
      <div className="chain-outer-stage">
        {/* Nodes and In-between Connectors */}
        <div className="nodes-chain-row">
          {songs.map((song, index) => {
            const isHead = index === 0;
            const isTail = index === lastIndex;
            const isCurrent = index === currentIndex;

            // Search match check
            const isMatch =
              cleanQuery !== '' &&
              (song.title.toLowerCase().includes(cleanQuery) ||
                song.artist.toLowerCase().includes(cleanQuery));

            let matchRefProp = null;
            if (isMatch && !hasSetFirstMatch) {
              matchRefProp = firstMatchRef;
              hasSetFirstMatch = true;
            }

            return (
              <React.Fragment key={song.id}>
                {/* Single Node Column */}
                <div
                  className="node-column"
                  ref={isCurrent ? activeNodeRef : matchRefProp}
                >
                  {/* Pointers Section Above Node */}
                  <div className="node-pointers-zone">
                    <div className="pointers-slot">
                      {isHead && (
                        <div className="pointer-chip chip-head" title="Head Pointer">
                          <span>head</span>
                          <span className="arrow-sym">&darr;</span>
                        </div>
                      )}

                      {isCurrent && (
                        <div
                          className={`pointer-chip chip-current ${isPlaying ? 'state-playing' : 'state-paused'}`}
                          title={`Current Pointer (${isPlaying ? 'Playing' : 'Paused'})`}
                        >
                          <div className="current-title-row">
                            <span>current</span>
                            {isPlaying ? (
                              <Play size={10} className="status-ico" />
                            ) : (
                              <Pause size={10} className="status-ico" />
                            )}
                          </div>
                          <span className="status-subtext">
                            {isPlaying ? 'PLAYING' : 'PAUSED'}
                          </span>
                          <span className="arrow-sym">&darr;</span>
                        </div>
                      )}

                      {isTail && (
                        <div className="pointer-chip chip-tail" title="Tail Pointer">
                          <span>tail</span>
                          <span className="arrow-sym">&darr;</span>
                        </div>
                      )}

                      {isMatch && !isCurrent && (
                        <div className="pointer-chip chip-match" title="Search Match">
                          <div className="current-title-row">
                            <Search size={10} />
                            <span>match</span>
                          </div>
                          <span className="arrow-sym">&darr;</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Node Box with Minimum Width */}
                  <div
                    className={`chain-node-box ${isCurrent ? 'node-active' : ''} ${isMatch ? 'node-search-match' : ''}`}
                    onClick={() => onSelectNode && onSelectNode(index)}
                    title={`Click to select Node ${index + 1}: ${song.title}`}
                  >
                    {/* Node Header */}
                    <div className="node-box-header">
                      <div className="node-index-group">
                        <span className="node-index-label">Node {index + 1}</span>
                        {isMatch && <span className="match-tag">FOUND</span>}
                      </div>
                      {isCurrent && (
                        <span className="playing-pulse-indicator">
                          <span className={`pulse-dot ${isPlaying ? 'active-pulse' : ''}`} />
                        </span>
                      )}
                    </div>

                    {/* Node Content */}
                    <div className="node-box-body">
                      <img
                        src={song.artwork}
                        alt={song.title}
                        className="node-box-art"
                      />
                      <div className="node-box-text">
                        <span className="node-song-name" title={song.title}>
                          {song.title}
                        </span>
                        <span className="node-song-artist" title={song.artist}>
                          {song.artist}
                        </span>
                      </div>
                    </div>

                    {/* Compartment pointer references: prev / next */}
                    <div className="node-box-footer">
                      <span className="field-ref">
                        &larr; prev: {index === 0 ? 'Node ' + songs.length : 'Node ' + index}
                      </span>
                      <span className="field-ref">
                        next: {index === lastIndex ? 'Node 1' : 'Node ' + (index + 2)} &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bidirectional Doubly Linked List connector between adjacent nodes */}
                {index < lastIndex && (
                  <div className="inter-node-connector">
                    {/* Forward Pointer: next */}
                    <div className="connector-line forward-line">
                      <span className="line-label">next</span>
                      <div className="arrow-track">
                        <span className="track-bar"></span>
                        <span className="track-head">&rarr;</span>
                      </div>
                    </div>

                    {/* Backward Pointer: prev */}
                    <div className="connector-line backward-line">
                      <div className="arrow-track">
                        <span className="track-head">&larr;</span>
                        <span className="track-bar"></span>
                      </div>
                      <span className="line-label">prev</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Circular Loop: Tail -> Head */}
        <div className="circular-loop-wrapper">
          <svg className="circular-loop-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
            <defs>
              <marker
                id="tail-head-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 1, 7 4, 0 7" fill="#18191c" />
              </marker>
            </defs>
            <path
              d="M 985 0 L 985 45 L 15 45 L 15 0"
              fill="none"
              stroke="#18191c"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              markerEnd="url(#tail-head-arrow)"
            />
          </svg>
          <div className="loop-info-tag">
            <span>tail.next &rarr; head (Circular Doubly Linked Link)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularLinkedListVisualizer;
