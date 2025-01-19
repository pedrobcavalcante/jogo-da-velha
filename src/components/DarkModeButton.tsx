import React from "react";

type DarkModeButtonProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

export const DarkModeButton: React.FC<DarkModeButtonProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <button onClick={onToggleDarkMode} className="button">
      Modo {isDarkMode ? "Claro" : "Escuro"}
    </button>
  );
};
