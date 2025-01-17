import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Board from "../components/Board";
type HomeProps = {
  initialSquares: (string | null)[];
};

type GameMode = "human-vs-human" | "human-vs-cpu";

const Home: React.FC<HomeProps> = ({ initialSquares }) => {
  const [squares, setSquares] = useState<(string | null)[]>(initialSquares);
  const [gameMode, setGameMode] = useState<GameMode>("human-vs-human");
  const [isCpuTurn, setIsCpuTurn] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  const resetGame = () => {
    setSquares(initialSquares);
    setIsCpuTurn(false);
    setIsGameOver(false);
    setWinner(null);
    setCurrentPlayer("X");
    setShowOverlay(true);
  };

  const checkWinner = (newSquares: (string | null)[]) => {
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
      if (
        newSquares[a] &&
        newSquares[a] === newSquares[b] &&
        newSquares[a] === newSquares[c]
      ) {
        setWinner(newSquares[a]);
        setIsGameOver(true);
        return;
      }
    }

    if (newSquares.every((square) => square !== null)) {
      setWinner("Empate");
      setIsGameOver(true);
    }
  };

  const handleSquareClick = (index: number) => {
    if (squares[index] || isCpuTurn || isGameOver) return;

    const newSquares = [...squares];
    newSquares[index] = currentPlayer;

    setSquares(newSquares);
    checkWinner(newSquares);

    if (gameMode === "human-vs-human") {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    } else if (gameMode === "human-vs-cpu") {
      setIsCpuTurn(true);
      cpuPlay(newSquares);
    }
  };

  const cpuPlay = (newSquares: (string | null)[]) => {
    const availableIndexes = newSquares
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);

    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      newSquares[randomIndex] = "O";
      setSquares([...newSquares]);
    }

    setIsCpuTurn(false);
    checkWinner(newSquares);
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setShowOverlay(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
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
          <h2>{winner === "Empate" ? "Empate!" : `${winner} venceu!`}</h2>
        </div>
      )}

      {showOverlay && (
        <div className="overlay">
          <h1 className="title">Jogo da Velha</h1>
          {isGameOver && (
            <div className="message">
              <h2>{winner === "Empate" ? "Empate!" : `${winner} venceu!`}</h2>
            </div>
          )}
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
        <Board initialSquares={squares} onSquareClick={handleSquareClick} />
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
