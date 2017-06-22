import React, { Component } from 'react';
import './App.css';
import boardPattern from './patterns'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Conway's Game of Life</h2>
          <a className="white" href="https://github.com/afbeaver/conwaysgame">click here for more info and source code</a>
        </div>
        <div className="board">
          <Board squares={boardPattern("acorn")}/>
        </div>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className={props.alive ? "square alive" : "square dead"}/>
  );
}

function GenerateBoard(props) {
  let board = props.squares.map(
    (row) => <div className="row">
      {row.map(
        (square) => <Square alive={square}/>
        )}
    </div>
  );
  return (
    <div>
      {board}
      <button className="board-btn btn-green" onClick={() => props.onClick("glider")}>
        Glider
      </button>
      <button className="board-btn btn-blue" onClick={() => props.onClick("acorn")}>
        Acorn
      </button>
      <button className="board-btn btn-pink" onClick={() => props.onClick("PD")}>
        PD
      </button>
      <button className="board-btn btn-orange" onClick={() => props.onClick("spaceship")}>
        LWSS
      </button>
    </div>
    );
}

function aliveOrDead(square, neighbors) {
  if(square === 1){
    if(neighbors === 2 || neighbors === 3){
      return 1;
    } else {
      return 0;
    }
  } else {
    if(neighbors === 3){
      return 1;
    } else {
      return 0;
    }
  }
}

function updateBoard(oldSquares, callback) {
  let newSquares = boardPattern();
  for (let i = 0; i < oldSquares.length; i++){
    for (let j = 0; j < oldSquares[i].length; j++){
      let neighbors = 0;
      if(i-1 >= 0 && j-1 >= 0) {
        neighbors += oldSquares[i-1][j-1]; //top left
      }
      if(i-1 >= 0){ 
        neighbors += oldSquares[i-1][j]; //above
      }
      if(i-1 >= 0 && j+1 < oldSquares[i].length){
        neighbors += oldSquares[i-1][j+1];  //top right
      }
      if(j-1 >= 0){
        neighbors += oldSquares[i][j-1]; //left
      }
      if(j+1 < oldSquares[i].length){
        neighbors += oldSquares[i][j+1]; //right
      }
      if(i+1 < oldSquares.length && j-1 >= 0){
        neighbors += oldSquares[i+1][j-1]; //bottom left
      }
      if(i+1 < oldSquares.length){
        neighbors += oldSquares[i+1][j]; //bottom
      }
      if(i+1 < oldSquares.length && j+1 < oldSquares[i].length){
        neighbors += oldSquares[i+1][j+1]; //bottom right
      }
      newSquares[i][j] = aliveOrDead(oldSquares[i][j],neighbors);
    }
  }
  return callback(newSquares.slice());
}

class Board extends React.Component {
  constructor(props) {
    super();
    this.state = {
      squares: props.squares,
      seconds: 0
    }
  }

  handlePatternButtonClick(patternName) {
    this.setState({
      squares: boardPattern(patternName)
    });
  }

  tick() {
    updateBoard(this.state.squares,(newBoard) =>
      this.setState({
        squares: newBoard
      })
    ); 
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(), 750
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <GenerateBoard squares={this.state.squares} onClick={(patternName)=>this.handlePatternButtonClick(patternName)}/>
      </div>
    );
  }
}



export default App;
