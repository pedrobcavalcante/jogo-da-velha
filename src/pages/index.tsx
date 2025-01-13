import React from "react";
import { GetServerSideProps } from "next";
import Board from "../components/Board";

type HomeProps = {
  initialSquares: (string | null)[];
};

const Home: React.FC<HomeProps> = ({ initialSquares }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Board initialSquares={initialSquares} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Inicializando o tabuleiro no servidor
  const initialSquares = Array(9).fill(null);

  return {
    props: {
      initialSquares,
    },
  };
};

export default Home;
