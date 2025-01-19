import React, { useState, useCallback, useEffect } from "react";
import { GetStaticProps } from "next";

import Board from "../components/Board";

import { useDarkMode } from "../hooks/useDarkMode";
import { GameOverlay } from "../components/GameOverlay";

export type GameMode = "human-vs-human" | "human-vs-cpu";

type HomeProps = {
  initialSquares: ("X" | "O" | null)[];
};

const Home: React.FC<HomeProps> = ({ initialSquares }) => {
  const [squares, setSquares] = useState<("X" | "O" | null)[]>(initialSquares);
  const [gameMode, setGameMode] = useState<GameMode>("human-vs-human");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [showOverlay, setShowOverlay] = useState(true);

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const { winner, isDraw } = getGameStatus(squares);
  const isGameOver = !!winner || isDraw;

  const handleSquareClick = useCallback(
    (index: number) => {
      if (
        isGameOver ||
        squares[index] ||
        (gameMode === "human-vs-cpu" && currentPlayer === "O")
      ) {
        return;
      }

      const updatedSquares = [...squares];
      updatedSquares[index] = currentPlayer;
      setSquares(updatedSquares);

      if (gameMode === "human-vs-human") {
        setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      } else {
        setCurrentPlayer("O");
      }
    },
    [isGameOver, squares, gameMode, currentPlayer]
  );

  useEffect(() => {
    if (gameMode === "human-vs-cpu" && currentPlayer === "O" && !isGameOver) {
      const availableIndexes = squares
        .map((val, i) => (val === null ? i : -1))
        .filter((i) => i !== -1);

      if (availableIndexes.length > 0) {
        const randomIndex =
          availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

        const updatedSquares = [...squares];
        updatedSquares[randomIndex] = "O";
        setSquares(updatedSquares);

        setCurrentPlayer("X");
      }
    }
  }, [gameMode, currentPlayer, isGameOver, squares]);

  const resetGame = useCallback(() => {
    setSquares(initialSquares);
    setCurrentPlayer("X");
    setShowOverlay(true);
  }, [initialSquares]);

  const handleGameModeChange = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      resetGame();
      setShowOverlay(false);
    },
    [resetGame]
  );

  return (
    <div className="container">
      <GameOverlay
        isGameOver={isGameOver}
        winner={winner}
        isDraw={isDraw}
        showOverlay={showOverlay}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSelectMode={handleGameModeChange}
      />

      {isGameOver && (
        <div className="message">
          <h2>{winner ? `${winner} venceu!` : isDraw ? "Empate!" : ""}</h2>
        </div>
      )}

      <div className="board">
        <Board squares={squares} onSquareClick={handleSquareClick} />
      </div>

      {isGameOver && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={resetGame} className="button">
            Resetar Jogo
          </button>
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const initialSquares = Array(9).fill(null);
  return {
    props: {
      initialSquares,
    },
  };
};

export default Home;
function getGameStatus(squares: ("X" | "O" | null)[]): {
  winner: "X" | "O" | null;
  isDraw: boolean;
} {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], isDraw: false };
    }
  }

  const isAllFilled = squares.every((square) => square !== null);
  if (isAllFilled) {
    return { winner: null, isDraw: true };
  }

  return { winner: null, isDraw: false };
}
