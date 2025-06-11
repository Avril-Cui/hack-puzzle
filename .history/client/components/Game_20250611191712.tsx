'use client';

import React, { useEffect, useState } from 'react';
import styles from './Game.module.css';

interface Tile {
  id: string;
  x: number;
  y: number;
  z: number;
  status: number;
  isCover: boolean;
  iconName: string;
}

const CELL_SIZE = 100;

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch('/scene.json')
      .then((res) => res.json())
      .then((data) => {
        setTiles(data);
      });
  }, []);

  const handleClick = (tile: Tile) => {
    if (tile.isCover || tile.status !== 0 || queue.length >= 7) return;
    setQueue((prev) => [...prev, tile]);
    setTiles((prev) =>
      prev.map((t) =>
        t.id === tile.id ? { ...t, status: 1 } : t
      )
    );
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.tileBoard}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile ${tile.isCover ? 'covered' : ''}`}
            style={{
              left: tile.x,
              top: tile.y,
              zIndex: tile.z,
            }}
            onClick={() => handleClick(tile)}
          >
            <img
              src={`/icons/${tile.iconName}.png`}
              alt={tile.iconName}
              className="tile-img"
              style={{ opacity: tile.status < 2 ? 1 : 0 }}
            />
          </div>
        ))}
      </div>

      <div className="queue-bar">
        {queue.map((tile, index) => (
          <div key={tile.id} className="queue-tile">
            <img src={`/icons/${tile.iconName}.png`} alt={tile.iconName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
