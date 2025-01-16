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
    // Não faz nada se a célula já foi preenchida ou se for a vez da CPU
    if (squares[index] || isCpuTurn) return;

    const newSquares = [...squares];
    newSquares[index] = "X"; // Jogador humano faz a marcação

    setSquares(newSquares);

    if (gameMode === "human-vs-cpu") {
      setIsCpuTurn(true); // Agora é a vez da CPU
      cpuPlay(newSquares); // Faz a jogada da CPU imediatamente
    }
  };

  const cpuPlay = (newSquares: (string | null)[]) => {
    // A CPU faz a jogada automaticamente
    const availableIndexes = newSquares
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);

    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      newSquares[randomIndex] = "O"; // CPU marca com "O"
      setSquares([...newSquares]); // Atualiza o estado com a jogada da CPU
    }

    setIsCpuTurn(false); // Fim do turno da CPU
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const toggleDarkMode = () => {
    // Verifica se o modo escuro está ativado ou não
    const darkMode = document.body.classList.contains("dark-mode");

    if (darkMode) {
      // Se estiver ativado, remove a classe e salva a mudança no localStorage
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    } else {
      // Se não estiver ativado, adiciona a classe e salva a mudança no localStorage
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    }
  };

  React.useEffect(() => {
    // Verifica se o modo escuro foi salvo no localStorage
    const darkMode = localStorage.getItem("darkMode") === "true";

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Título do Jogo */}
      <h1 style={{ fontSize: "3rem", marginBottom: "30px" }}>Jogo da Velha</h1>

      {/* Botões para escolher o modo de jogo */}
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

      {/* Tabuleiro do jogo */}
      <div
        style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <Board initialSquares={squares} onSquareClick={handleSquareClick} />
      </div>

      {/* Botão para resetar o jogo */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={resetGame} style={buttonStyle}>
          Resetar Jogo
        </button>
      </div>

      {/* Botão para alternar entre modo claro e escuro */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={toggleDarkMode} style={buttonStyle}>
          Alternar para Modo{" "}
          {document.body.classList.contains("dark-mode") ? "Claro" : "Escuro"}
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
