"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";

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
const ICONS = ["🍀", "🌈", "⚙️", "🐏", "🐯", "🐤", "📚", "🧠", "💻", "🐼"];

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch("/scene.json")
      .then((res) => res.json())
      .then((data) => {
        setTiles(data);
      });
  }, []);

  const handleClick = (tile: Tile) => {
    if (tile.isCover || tile.status !== 0 || queue.length >= 7) return;
    setQueue((prev) => [...prev, tile]);
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, status: 1 } : t))
    );
  };

  const getEmoji = (iconName: string): string => {
    const index = parseInt(iconName.replace("icon_", ""));
    return ICONS[index] || "❓";
  };

  const getIconPath = (iconName: string): string => {
    // Convert `icon_0` -> `0`, fallback to 0 if parsing fails
    const index = parseInt(iconName.replace("icon_", ""));
    const extMap: Record<number, string> = {
      0: "svg",
      1: "png",
      2: "png",
      3: "png",
      4: "svg",
      5: "jpg",
      6: "jpg",
      7: "jpg",
      8: "svg",
      9: "svg",
    };

    const ext = extMap[index] || "png";
    return `/icons/icons${index}.${ext}`;
  };
  return (
    <div className={styles.gameContainer}>
      <div className={styles.tileBoard}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`${styles.tile} ${tile.isCover ? styles.covered : ""}`}
            style={{
              left: tile.x,
              top: tile.y,
              zIndex: tile.z,
            }}
            onClick={() => handleClick(tile)}
          >
            <div
              className={styles.tileInner}
              style={{ opacity: tile.status < 2 ? 1 : 0 }}
            >
              <img
                src={getIconPath(tile.iconName)}
                alt={tile.iconName}
                className={styles.tileInner}
                style={{ opacity: tile.status < 2 ? 1 : 0 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.queueBar}>
        {queue.map((tile) => (
          <div key={tile.id} className={styles.queueTile}>
            <img
              src={getIconPath(tile.iconName)}
              alt={tile.iconName}
              className={styles.tileInner}
              style={{ opacity: tile.status < 2 ? 1 : 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
