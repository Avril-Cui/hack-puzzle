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

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);

  useEffect(() => {
    fetch("/scene.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("fetching scene");
        console.log(data);
        setTiles(data);
      });
  }, []);

  const getIconPath = (iconName: string): string => {
    const extensionMap: Record<string, string> = {
      icon_0: "svg",
      icon_1: "png",
      icon_2: "png",
      icon_3: "png",
      icon_4: "svg",
      icon_5: "jpg",
      icon_6: "jpg",
      icon_7: "jpg",
      icon_8: "svg",
      icon_9: "svg",
    };

    const ext = extensionMap[iconName] || "png";
    return `/icons/${iconName}.${ext}`;
  };

  const handleClick = (tile: Tile) => {
    if (tile.isCover || tile.status !== 0 || queue.length >= 7) return;
    setQueue((prev) => [...prev, tile]);
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, status: 1 } : t))
    );
  };

  const emojiMap: Record<string, string> = {
    icon_0: "🐑",
    icon_1: "🐯",
    icon_2: "🦄",
    icon_3: "🖥️",
    icon_4: "🍀",
    icon_5: "📚",
    icon_6: "🧠",
    icon_7: "🌈",
    icon_8: "🦆",
    icon_9: "🐼",
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.tileBoard}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile ${tile.isCover ? "covered" : ""}`}
            style={{
              left: tile.x,
              top: tile.y,
              zIndex: tile.z,
            }}
            onClick={() => handleClick(tile)}
          >
            <span style={{ fontSize: 36, opacity: tile.status < 2 ? 1 : 0 }}>
              {emojiMap[tile.iconName] || "❓"}
            </span>
          </div>
          //   <div
          //     key={tile.id}
          //     className={`tile ${tile.isCover ? "covered" : ""}`}
          //     style={{
          //       left: tile.x,
          //       top: tile.y,
          //       zIndex: tile.z,
          //     }}
          //     onClick={() => handleClick(tile)}
          //   >
          //     <img
          //       src={getIconPath(tile.iconName)}
          //       alt={tile.iconName}
          //       className="tile-img"
          //       style={{ opacity: tile.status < 2 ? 1 : 0 }}
          //     />
          //   </div>
        ))}
      </div>

      <div className="queue-bar">
        {queue.map((tile, index) => (
          <div key={tile.id} className="queue-tile">
            <img src={getIconPath(tile.iconName)} alt={tile.iconName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
