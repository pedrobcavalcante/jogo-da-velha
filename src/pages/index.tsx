import React, { useState, useEffect, useCallback } from "react";
import { GetStaticProps } from "next";
import Board from "../components/Board";

type HomeProps = {
  initialSquares: (string | null)[];
};

type GameMode = "human-vs-human" | "human-vs-cpu";

function getGameStatus(squares: (string | null)[]) {
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

const Home: React.FC<HomeProps> = ({ initialSquares }) => {
  const [squares, setSquares] = useState<(string | null)[]>(initialSquares);
  const [gameMode, setGameMode] = useState<GameMode>("human-vs-human");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [showOverlay, setShowOverlay] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);

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

      const newSquares = [...squares];
      newSquares[index] = currentPlayer;
      setSquares(newSquares);

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
        .map((value, index) => (value === null ? index : -1))
        .filter((i) => i !== -1);

      if (availableIndexes.length > 0) {
        const randomIndex =
          availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        const newSquares = [...squares];
        newSquares[randomIndex] = "O";
        setSquares(newSquares);
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

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  useEffect(() => {
    const darkFromStorage = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkFromStorage);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  return (
    <div className="container">
      {isGameOver && (
        <div className="message">
          <h2>{winner ? `${winner} venceu!` : isDraw ? "Empate!" : ""}</h2>
        </div>
      )}

      {showOverlay && (
        <div className="overlay">
          <h1 className="title">Jogo da Velha</h1>
          {!isGameOver && (
            <div className="button-container">
              <button
                onClick={() => handleGameModeChange("human-vs-human")}
                className="button"
              >
                Jogar contra outro jogador
              </button>
              <button
                onClick={() => handleGameModeChange("human-vs-cpu")}
                className="button"
              >
                Jogar contra a CPU
              </button>
            </div>
          )}
          <div style={{ marginTop: "20px" }}>
            <button onClick={toggleDarkMode} className="button">
              Modo {isDarkMode ? "Claro" : "Escuro"}
            </button>
          </div>
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
