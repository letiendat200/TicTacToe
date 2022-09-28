import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  let winner_check;
  if(props.winner_square_check){
    winner_check = "square-winner";
  }
  else{
    winner_check = "square";
  } 
  return (
    <button className={winner_check} onClick={props.onClick}>
      {props.value}
    </button>
  );
  
}

class Board extends React.Component {  
  renderSquare(i) {
    let winner_check;
    if(this.props.winner!=null && this.props.winner.indexOf(i)!== -1){
        winner_check = true;  
    }
    else{
      winner_check = false;
    }   
    return (
      <Square
        value={this.props.squares[i]}
        winner_square_check = {winner_check}
        onClick={() => this.props.onClick(i)}
      />
    );
  }  

  render() {
    var count = 0;
    var square_draw = [];
    const table = [];    
    for(var row = 0; row<5; row++)
    { 
      for (var col = 0; col<5; col++) {
        square_draw.push(this.renderSquare(count));
        count++;
      }    
      table.push(<div className="board-row">{square_draw}</div> )
      square_draw = [];
    }
    return (
      <div>
        {table}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(25).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      square_history: [],
      reverse_history_check: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const square_history = this.state.square_history.slice(0, this.state.stepNumber);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      square_history: square_history.concat(i)
    });    
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseHistory() {    
    this.setState({
      reverse_history_check: !this.state.reverse_history_check,
    });
  };  

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winning_squares = calculateWinner(current.squares);
    const winner = winning_squares?current.squares[winning_squares[0]]:false;
    const square_history = this.state.square_history;
    let history_button;
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' col: ' + square_history[move-1]%5 + ' row: '+ Math.floor(square_history[move-1]/5):
        'Go to game start';
        if(move===this.state.stepNumber)
        {
          history_button = <button className='current-button-history' onClick={() => this.jumpTo(move)}>{desc}</button>;          
        }
        else{
          history_button = <button onClick={() => this.jumpTo(move)}>{desc}</button>;
        }
        return (
          <li key={move}>
            {history_button}
          </li>
        );
    });

    if(this.state.reverse_history_check){
      moves.reverse();
    }

    let status;
    let winner_check;    
    if (winner) {
      status = 'Winner: ' + winner;
      winner_check = winning_squares;      
    } else {
      winner_check= null;
      if(this.state.stepNumber == 25){
        status = 'Draw Game'
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }      
    }    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner_check}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <input type="checkbox" onChange={() => this.reverseHistory()}/> Reverse History           
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  let winningSquares = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]&& squares[a] === squares[d]&& squares[a] === squares[e]) {
      winningSquares = winningSquares.concat(lines[i]);      
      return winningSquares;
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
