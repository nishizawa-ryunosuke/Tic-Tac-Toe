import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = isWinningSquare ? 'square winning' : 'square';
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, { row, col });
  }

  const winner = calculateWinner(squares);
  const winningLine = winner ? winner.winningLine : null;
  let status;
  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinningSquare = winningLine && winningLine.includes(squareIndex);
      squaresInRow.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-table">{boardRows}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), position: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, position) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, position }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const { row, col } = step.position || {};
    const description = move > 0
      ? 'Go to move #' + move + ` (row: ${row}, col: ${col})`
      : 'Go to game start';
      const buttonClass = move === currentMove ? 'game-info-btn current-move' : 'game-info-btn';
    return (
      <li className="game-info-item" key={move}>
        <button className={buttonClass} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  function toggleSortOrder() {
    setIsAscending(prevIsAscending => !prevIsAscending);
  }

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="toggle-button"  onClick={toggleSortOrder}>Toggle Sort Order</button>
        <ol className="game-info-list">{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winningLine: lines[i]};
    }
  }
  return null;
}