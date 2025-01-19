import React from "react";
import { GameMode } from "../pages";

type ModeSelectionButtonsProps = {
  onSelectMode: (mode: GameMode) => void;
};

export const ModeSelectionButtons: React.FC<ModeSelectionButtonsProps> = ({
  onSelectMode,
}) => {
  return (
    <div className="button-container">
      <button onClick={() => onSelectMode("human-vs-human")} className="button">
        Jogar contra outro jogador
      </button>
      <button onClick={() => onSelectMode("human-vs-cpu")} className="button">
        Jogar contra a CPU
      </button>
    </div>
  );
};
