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
    const extMap: Record<string, string> = {
      icons0: "png",
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
    const ext = extMap[iconName] || "png";
    return `/icons/${iconName}.${ext}`;
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
