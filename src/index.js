import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

  render() {
    return (
      <button className={"square "+(this.props.selected||this.props.win?'selected':'')}  onClick={() => this.props.onClick()}>
          {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {


  renderSquare(i,j) {
    let  index = 3*i+j;
    return <Square win ={contains(this.props.winner,index)} selected={this.props.selected===index} value={this.props.squares[index]} onClick={() => this.props.onClick(index)}/>;
  }

  render() {

      const grid = [...Array(3)].map((item, i) => {
          return (
              <div className="board-row" key={i}>
                  {
                      [...Array(3)].map((item,j)=>{
                          return (
                              <span key={j}>
                                  {this.renderSquare(i,j)}
                              </span>
                          )
                      })

                  }
              </div>
          );
      });


    return (
      <div>
          {grid}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
      super();
      this.state = {
          history: [{
              squares: Array(9).fill(null),
              selectIndex:null,
          }],
          xIsNext: true,
          stepNumber: 0,

      };
  }
  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
          return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              squares: squares,
              selectIndex:i,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      });
  }
  jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
  }
  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          let index = history.length-1-move;
          const rowNumber = Math.ceil((history[index].selectIndex+1)/3);
          const colNumber = history[index].selectIndex+1-3*(rowNumber-1);

          const desc = index ?
              'Move #' + index+':('+rowNumber+','+colNumber+')' :
              'Game start';
          return (
              <li key={index}>
                <a href="#" onClick={() => this.jumpTo(index)}>{desc}</a>
              </li>
          );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + current.squares[winner[0]];
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
          <Board winner={winner} selected={current.selectIndex} squares={current.squares}  onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
            return lines[i];
        }
    }
    return null;
}
function contains(a, obj) {

    if(a==null)
        return false;

    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}