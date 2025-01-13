import React from "react";

type SquareProps = {
  value: string | null;
  onClick: () => void;
};

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100px",
        height: "100px",
        fontSize: "24px",
        fontWeight: "bold",
        border: "1px solid #000",
        cursor: "pointer",
      }}
    >
      {value}
    </button>
  );
};

export default Square;
