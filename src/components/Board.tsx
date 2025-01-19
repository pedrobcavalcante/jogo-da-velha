import React from "react";

type BoardProps = {
  squares: (string | null)[];
  onSquareClick: (index: number) => void;
};

const Board: React.FC<BoardProps> = React.memo(function Board({
  squares,
  onSquareClick,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: "10px",
      }}
    >
      {squares.map((value, index) => (
        <button
          key={index}
          style={{
            width: "100px",
            height: "100px",
            fontSize: "24px",
            backgroundColor: "#fff",
            border: "1px solid #000",
            cursor: value ? "not-allowed" : "pointer",
          }}
          onClick={() => onSquareClick(index)}
        >
          {value}
        </button>
      ))}
    </div>
  );
});

export default Board;
