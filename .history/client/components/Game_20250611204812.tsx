"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";

interface Tile {
  id: string;
  x: number;
  y: number;
  status: number; // 0 = unpicked, 1 = in queue
  iconName: string;
}

const CELL_SIZE = 100;
const ICONS = ["🍀", "🌈", "⚙️", "🐏", "🐯", "🐤", "📚", "🧠", "💻", "🐼"];

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch("/scene.json")
      .then((res) => res.json())
      .then((data: Tile[]) => {
        setTiles(data);
        setInitialTiles(data);
      });
  }, []);

  const handleClick = (tile: Tile) => {
    if (queue.length >= 7) return;

    const newQueue = [...queue, tile];
    const sameTiles = newQueue.filter((t) => t.iconName === tile.iconName);

    // If 3 same tiles exist, remove them
    if (sameTiles.length === 3) {
      const filteredQueue = newQueue.filter(
        (t) => t.iconName !== tile.iconName
      );
      setQueue(filteredQueue);
    } else {
      setQueue(newQueue);

      // Check for loss: 7 full, and no 3 of a kind
      if (newQueue.length === 7) {
        const counts: Record<string, number> = {};
        newQueue.forEach((t) => {
          counts[t.iconName] = (counts[t.iconName] || 0) + 1;
        });
        const hasTriple = Object.values(counts).some((count) => count >= 3);
        if (!hasTriple) {
          setGameOver(true);
        }
      }
    }

    // Remove the tile from the board
    setTiles((t) => t.filter((x) => x.id !== tile.id));
  };
  // returns true if tile at `idx` is overlapped by any later (higher) tile still in play
  const isCovered = (idx: number) => {
    const cur = tiles[idx];
    if (cur.status !== 0) return false;
    for (let j = idx + 1; j < tiles.length; j++) {
      const other = tiles[j];
      if (other.status !== 0) continue;
      // bounding‐box overlap?
      if (
        !(
          cur.x + CELL_SIZE <= other.x ||
          other.x + CELL_SIZE <= cur.x ||
          cur.y + CELL_SIZE <= other.y ||
          other.y + CELL_SIZE <= cur.y
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const getIconPath = (iconName: string) => {
    const extMap: Record<string, string> = {
      icons0: "svg",
      icons1: "png",
      icons2: "png",
      icons3: "png",
      icons4: "svg",
      icons5: "jpg",
      icons6: "jpg",
      icons7: "jpg",
      icons8: "svg",
      icons9: "svg",
    };
    return `/icons/${iconName}.${extMap[iconName] || "png"}`;
  };

  const [gameOver, setGameOver] = useState(false);
  const [initialTiles, setInitialTiles] = useState<Tile[]>([]);

  return (
    <div className={styles.gameContainer}>
      {gameOver && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h1>You Lose</h1>
            <button
              onClick={() => {
                setTiles(initialTiles);
                setQueue([]);
                setGameOver(false);
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <div className={styles.tileBoard}>
        {tiles.map((tile, idx) => {
          // inactive if picked OR if covered by any tile with a higher array-index
          const inactive = tile.status !== 0 || isCovered(idx);

          return (
            <div
              key={tile.id}
              className={`${styles.tile} ${inactive ? styles.inactive : ""}`}
              style={{
                left: tile.x,
                top: tile.y,
                zIndex: idx, // ensures later array items actually draw on top
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
        {queue.map((t) => (
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
