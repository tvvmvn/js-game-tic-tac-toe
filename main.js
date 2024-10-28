// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "#222";

// class
class Board {
  GRID_SIZE = 300;
  GRID_OFFSET_X = (canvas.width - this.GRID_SIZE) / 2;
  GRID_OFFSET_Y = 100;
  GRID_LINE_COUNT = 3;
  GRID_ITEM_SIZE = this.GRID_SIZE / this.GRID_LINE_COUNT;
  table = [];

  constructor() {
    // initialize table
    for (var r = 0; r < 3; r++) {
      this.table[r] = [];
      for (var c = 0; c < 3; c++) {
        this.table[r][c] = 0;
      }
    }
  }

  set(r, c, data) {
    this.table[r][c] = data;
  }

  get(r, c) {
    return this.table[r][c];
  }

  render() {
    // grids
    ctx.beginPath();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 4;
  
    for (var r = 1; r < this.GRID_LINE_COUNT; r++) {
      ctx.moveTo(this.GRID_OFFSET_X, this.GRID_OFFSET_Y + (this.GRID_ITEM_SIZE * r));
      ctx.lineTo(this.GRID_OFFSET_X + this.GRID_SIZE, this.GRID_OFFSET_Y + (this.GRID_ITEM_SIZE * r));
    }
  
    for (var c = 1; c < this.GRID_LINE_COUNT; c++) {
      ctx.moveTo(this.GRID_OFFSET_X + (this.GRID_ITEM_SIZE * c), this.GRID_OFFSET_Y);
      ctx.lineTo(this.GRID_OFFSET_X + (this.GRID_ITEM_SIZE * c), this.GRID_OFFSET_Y + this.GRID_SIZE);
    }
  
    ctx.stroke();

    // symbols
    for (var r = 0; r < this.table.length; r++) {
      for (var c = 0; c < this.table[r].length; c++) {
        var id = this.table[r][c];

        var x = this.GRID_OFFSET_X + (c * this.GRID_ITEM_SIZE);
        var y = this.GRID_OFFSET_Y + (r * this.GRID_ITEM_SIZE);

        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 8;

        if (id == 1) {
          ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (id == 2) {
          ctx.moveTo(x + 20, y + 20); ctx.lineTo(x + 80, y + 80);
          ctx.moveTo(x + 80, y + 20); ctx.lineTo(x + 20, y + 80);
        }

        ctx.stroke();
      }
    }
  }
}

class Computer {
  time = 0;

  constructor(table) {
    this.table = table;
  }

  isReady() {
    this.time++;

    if (this.time > 100) {
      this.time = 0;

      return true;
    }

    return false;
  }

  // isMovesLeft
  // evaluate
  // minmax
  findBestMove() {
    while (true) {
      var r = Math.floor(Math.random() * 3);
      var c = Math.floor(Math.random() * 3);

      if (this.table[r][c] == 0) {
        return [r, c];
      }
    }
  }

}

class Umpire {
  first = this.lot();
  turn = this.first;
  gameCount = 0;

  constructor(table, USER, COM) {
    this.table = table;
    this.USER = USER;
    this.COM = COM;
  }

  lot() {
    return Math.ceil(Math.random() * 2);
  }

  setTurn(turn) {
    this.turn = turn;
    this.gameCount++;
  } 

  getTurn() {
    return this.turn;
  }

  isCrossed() {
    // row crossed
    for (var r = 0; r < 3; r++) {
      if (this.table[r][0] != 0 && this.table[r][0] == this.table[r][1] && this.table[r][1] == this.table[r][2]) {
        return true;
      }
    }

    // column crossed
    for (var c = 0; c < 3; c++) {
      if (this.table[0][c] != 0 && this.table[0][c] == this.table[1][c] && this.table[1][c] == this.table[2][c]) {
        return true;
      }
    }

    // diagonal crossed (\)
    if (this.table[0][0] != 0 && this.table[0][0] == this.table[1][1] && this.table[1][1] == this.table[2][2]) { 
      return true;
    // diagonal crossed (/)
    } else if (this.table[0][2] != 0 && this.table[0][2] == this.table[1][1] && this.table[1][1] == this.table[2][0]) {
      return true;
    }
    
    return false;
  }

  isDrawn() {
    if (this.gameCount < 9) {
      return false;
    }

    return true;
  }

  gameOver() {
    if (this.isCrossed() || this.isDrawn()) {
      return true;
    }

    return false;
  }

  render() { 
    var message = "";

    // start message
    if (this.gameCount < 2) {
      if (this.first == this.USER) {
        message = "YOU FIRST";
      } else {
        message = "COM FIRST";
      }
    } 

    // result message
    if (this.isCrossed()) {
      if (this.turn == this.COM) {
        message = "YOU WIN!";
      } else {
        message = "YOU LOSE";
      }
    } else if (this.isDrawn()) {
      message = "DRAW";
    }

    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, 60);
  }
}

// Game
class Game {
  USER = 1;
  COM = 2;
  board = new Board();
  computer = new Computer(this.board.table);
  umpire = new Umpire(this.board.table, this.USER, this.COM);
  timer;

  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearCanvas();

    // Board
    this.board.render();
    // Messages
    this.umpire.render();

    // Computer playing
    if (!this.umpire.gameOver()) {
      if (this.umpire.getTurn() == this.COM) {
        if (this.computer.isReady()) {
          var [r, c] = this.computer.findBestMove();
          
          this.board.set(r, c, this.COM);
          this.umpire.setTurn(this.USER);
        }
      }
    } else {
      // Game Over
      clearInterval(this.timer);
    }
  }

  clickHandler(e) {
    if (this.umpire.getTurn() == this.USER) {
      var r = Math.floor((e.offsetY - this.board.GRID_OFFSET_Y) / this.board.GRID_ITEM_SIZE);
      var c = Math.floor((e.offsetX - this.board.GRID_OFFSET_X) / this.board.GRID_ITEM_SIZE);
      
      if (r > -1 && r < this.board.GRID_LINE_COUNT && c > -1 && c < this.board.GRID_LINE_COUNT) {
        // User playing
        if (this.board.get(r, c) == 0) {
          this.board.set(r, c, this.USER);
          this.umpire.setTurn(this.COM);
        }
      }
    }
  }
}

// run
var game = new Game();
canvas.addEventListener("click", (e) => game.clickHandler(e));
