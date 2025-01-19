import React from "react";
import { GameMode } from "../pages";
import { ModeSelectionButtons } from "./ModeSelectionButtons";
import { DarkModeButton } from "./DarkModeButton";

type GameOverlayProps = {
  isGameOver: boolean;
  winner: string | null;
  isDraw: boolean;
  showOverlay: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectMode: (mode: GameMode) => void;
};

export const GameOverlay: React.FC<GameOverlayProps> = ({
  isGameOver,
  winner,
  isDraw,
  showOverlay,
  isDarkMode,
  onToggleDarkMode,
  onSelectMode,
}) => {
  if (!showOverlay) return null;

  return (
    <div className="overlay">
      <h1 className="title">Jogo da Velha</h1>

      {!isGameOver && <ModeSelectionButtons onSelectMode={onSelectMode} />}

      {isGameOver && (
        <div className="message">
          <h2>{winner ? `${winner} venceu!` : isDraw ? "Empate!" : ""}</h2>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <DarkModeButton
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      </div>
    </div>
  );
};
