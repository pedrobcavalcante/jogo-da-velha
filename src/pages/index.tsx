import React from "react";
import { GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps = async () => {
  const initialSquares = Array(9).fill(null);

  return {
    props: {
      initialSquares,
    },
  };
};

export default Home;
