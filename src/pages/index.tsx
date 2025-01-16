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

  const resetGame = () => {
    setSquares(initialSquares);
    setIsCpuTurn(false);
  };

  const handleSquareClick = (index: number) => {
    if (squares[index] || isCpuTurn) return;

    const newSquares = [...squares];
    newSquares[index] = "X";

    setSquares(newSquares);

    if (gameMode === "human-vs-cpu") {
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
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "30px" }}>Jogo da Velha</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleGameModeChange("human-vs-human")}
          style={buttonStyle}
        >
          Jogar contra outro jogador
        </button>
        <button
          onClick={() => handleGameModeChange("human-vs-cpu")}
          style={buttonStyle}
        >
          Jogar contra a CPU
        </button>
      </div>

      <div
        style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <Board initialSquares={squares} onSquareClick={handleSquareClick} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={resetGame} style={buttonStyle}>
          Resetar Jogo
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={toggleDarkMode} style={buttonStyle}>
          Alternar para Modo {isDarkMode ? "Claro" : "Escuro"}
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  margin: "5px",
  fontSize: "1.1rem",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  width: "250px",
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
