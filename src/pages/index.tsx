import React, { useState } from "react";
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
    }
  };

  const cpuPlay = React.useCallback(() => {
    const availableIndexes = squares
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);

    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      const newSquares = [...squares];
      newSquares[randomIndex] = "O";
      setSquares(newSquares);
    }

    setIsCpuTurn(false);
  }, [squares]);

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  React.useEffect(() => {
    if (gameMode === "human-vs-cpu" && isCpuTurn) {
      setTimeout(cpuPlay, 1);
    }
  }, [isCpuTurn, squares, gameMode, cpuPlay]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Jogo da Velha</h1>

      <div>
        <button onClick={() => handleGameModeChange("human-vs-human")}>
          Jogar contra outro jogador
        </button>
        <button onClick={() => handleGameModeChange("human-vs-cpu")}>
          Jogar contra a CPU
        </button>
      </div>

      <Board initialSquares={squares} onSquareClick={handleSquareClick} />

      <button onClick={resetGame} style={{ marginTop: "20px" }}>
        Resetar Jogo
      </button>
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
