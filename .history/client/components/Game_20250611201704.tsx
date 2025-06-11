"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";

interface Tile {
  id: string;
  x: number;
  y: number;
  z: number;
  status: number;      // 0 = unpicked, 1 = picked
  iconName: string;
}

const CELL_SIZE = 100;  // your tile width/height in px
const ICONS = ["🍀","🌈","⚙️","🐏","🐯","🐤","📚","🧠","💻","🐼"];

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch("/scene.json")
      .then(res => res.json())
      .then((data: Tile[]) => setTiles(data));
  }, []);

  const handleClick = (tile: Tile) => {
    if (queue.length >= 7) return;
    // only clickable if not covered (we’ll guard in render as well)
    setQueue(q => [...q, tile]);
    setTiles(t =>
      t.map(x => (x.id === tile.id ? { ...x, status: 1 } : x))
    );
  };

  // helper: does `tile` overlap any other, still-on-board tile with a higher z?
  const isCovered = (tile: Tile) => {
    return tiles.some(
      other =>
        other.id !== tile.id &&
        other.status === 0 &&          // still on board
        other.z > tile.z &&            // sits above
        tile.x <  other.x + CELL_SIZE && 
        tile.x + CELL_SIZE > other.x && 
        tile.y <  other.y + CELL_SIZE &&
        tile.y + CELL_SIZE > other.y
    );
  };

  const getIconPath = (iconName: string) => {
    const extMap: Record<string, string> = {
      icons0: "svg", icons1: "png", icons2: "png", icons3: "png",
      icons4: "svg", icons5: "jpg", icons6: "jpg", icons7: "jpg",
      icons8: "svg", icons9: "svg",
    };
    return `/icons/${iconName}.${extMap[iconName] || "png"}`;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.tileBoard}>
        {tiles.map(tile => {
          // now we grey out any tile that’s either picked (status!==0) 
          // OR actually covered by any other tile
          const inactive = tile.status !== 0 || isCovered(tile);

          return (
            <div
              key={tile.id}
              className={`${styles.tile} ${inactive ? styles.inactive : ""}`}
              style={{ left: tile.x, top: tile.y, zIndex: tile.z }}
              onClick={() => {
                if (!inactive && queue.length < 7) handleClick(tile);
              }}
            >
              <img
                src={getIconPath(tile.iconName)}
                alt={tile.iconName}
                className={styles.tileInner}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.queueBar}>
        {queue.map(t => (
          <div key={t.id} className={styles.queueTile}>
            <img
              src={getIconPath(t.iconName)}
              alt={t.iconName}
              className={styles.tileInner}
              style={{ filter: "none", opacity: 1 }}
            />
          </div>
        ))}
        {Array.from({ length: 7 - queue.length }).map((_, i) => (
          <div key={i} className={styles.queueTile} />
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;