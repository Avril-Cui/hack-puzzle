"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";

interface Tile {
  id: string;
  x: number;
  y: number;
  iconName: string;
}

const CELL_SIZE = 100;
const ICONS = ["🍀","🌈","⚙️","🐏","🐯","🐤","📚","🧠","💻","🐼"];

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch("/scene.json")
      .then(res => res.json())
-     .then((data: Tile[]) => setTiles(data));
+     .then((data: Tile[]) => setTiles(data));
  }, []);

  const handleClick = (tile: Tile) => {
    if (queue.length >= 7) return;
    // 1) add it to the queue
    setQueue(q => [...q, tile]);
    // 2) remove it from the board entirely
    setTiles(t => t.filter(t2 => t2.id !== tile.id));
  };

  // does tile[idx] overlap any tile later in the array?
  const isCovered = (idx: number) => {
    const cur = tiles[idx];
    for (let j = idx + 1; j < tiles.length; j++) {
      const other = tiles[j];
      if (
        !(cur.x + CELL_SIZE <= other.x ||
          other.x + CELL_SIZE <= cur.x ||
          cur.y + CELL_SIZE <= other.y ||
          other.y + CELL_SIZE <= cur.y)
      ) {
        return true;
      }
    }
    return false;
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
-       {tiles.map((tile, idx) => {
+       {tiles.map((tile, idx) => {
          const inactive = isCovered(idx);

          return (
            <div
              key={tile.id}
              className={`${styles.tile} ${inactive ? styles.inactive : ""}`}
              style={{
                left: tile.x,
                top: tile.y,
                zIndex: idx
              }}
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