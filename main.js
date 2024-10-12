// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "#222";

// Game
class Game {
  // constants 
  GRID_SIZE = 300;
  GRID_OFFSET_X = (canvas.width - this.GRID_SIZE) / 2;
  GRID_OFFSET_Y = 100;
  GRID_LINE_COUNT = 3;
  GRID_ITEM_SIZE = this.GRID_SIZE / this.GRID_LINE_COUNT;
  USER = 1;
  COM = 2;
  // variables 
  first = Math.ceil(Math.random() * 2);
  turn = this.first;
  bingo = 0;
  drawn = false;
  count = 0;
  message = "";
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]

  getCrds() {
    while (true) {
      var r = Math.floor(Math.random() * 3);
      var c = Math.floor(Math.random() * 3);

      if (this.board[r][c] == 0) {
        return [r, c];
      }
    }
  }
  
  isBingo() {
    // horizontal bingo
    for (var r = 0; r < 3; r++) {
      if (
        this.board[r][0] != 0
        && this.board[r][0] == this.board[r][1] 
        && this.board[r][1] == this.board[r][2]
      ) {
        this.bingo = this.board[r][0];

        return 0;
      }
    }
    
    // vertical bingo
    for (var c = 0; c < 3; c++) {
      if (
        this.board[0][c] != 0
        && this.board[0][c] == this.board[1][c] 
        && this.board[1][c] == this.board[2][c]
      ) {
        this.bingo = this.board[0][c];

        return 0;
      }
    }
  
    // cross bingo (\)
    if (
      this.board[0][0] != 0
      && this.board[0][0] == this.board[1][1] 
      && this.board[1][1] == this.board[2][2]
    ) {
      this.bingo = this.board[0][0];

      return 0;
    }
  
    // cross bingo (/)
    if (
      this.board[0][2] != 0
      && this.board[0][2] == this.board[1][1] 
      && this.board[1][1] == this.board[2][0]
    ) {
      this.bingo = this.board[0][2];

      return 0;
    }
  }
  
  isDrawn() {
    if (this.count == 9) {
      this.drawn = true;
    }
  }

  drawBoard() {
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
  }

  drawSymbol() {
    for (var r = 0; r < this.board.length; r++) {
      for (var c = 0; c < this.board[r].length; c++) {
        var id = this.board[r][c];

        var x = this.GRID_OFFSET_X + (c * this.GRID_ITEM_SIZE);
        var y = this.GRID_OFFSET_Y + (r * this.GRID_ITEM_SIZE);

        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 8;

        if (id == 1) {
          ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
          ctx.stroke();
        } 

        if (id == 2) {
          ctx.moveTo(x + 20, y + 20);
          ctx.lineTo(x + 80, y + 80);
          ctx.moveTo(x + 80, y + 20);
          ctx.lineTo(x + 20, y + 80);
        }

        ctx.stroke();
      }
    }
  }

  drawMessage(message) {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, 60);
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    this.clearCanvas();

    if (this.count < 2) {
      if (this.first == this.USER) {
        this.drawMessage("YOU FIRST");
      } else {
        this.drawMessage("COM FIRST");
      }
    } else {
      this.drawMessage("");
    }

    this.isBingo();
    this.isDrawn();
  
    if (this.bingo) {
      if (this.bingo == this.USER) {
        this.drawMessage("YOU WIN!");
      } else {
        this.drawMessage("YOU LOSE");
      }
    } else if (this.drawn) {
      this.drawMessage("DRAW!");
    } else {
      if (this.turn == this.COM) {
        setTimeout(() => {
          var [r, c] = this.getCrds();
          this.board[r][c] = this.COM;

          this.turn = this.USER;
          this.count++;
        }, 1000);

        this.turn = null;
      }

      requestAnimationFrame(() => this.render());
    }

    this.drawBoard();
    this.drawSymbol();
  }

  clickHandler(e) {
    if (this.turn == this.USER) {
      var r = Math.floor((e.offsetY - this.GRID_OFFSET_Y) / this.GRID_ITEM_SIZE);
      var c = Math.floor((e.offsetX - this.GRID_OFFSET_X) / this.GRID_ITEM_SIZE);
  
      if (r > -1 && r < this.GRID_LINE_COUNT && c > -1 && c < this.GRID_LINE_COUNT) {
        if (this.board[r][c] == 0) {
          this.board[r][c] = this.USER;
          this.turn = this.COM;
          this.count++;
        }
      }
    }
  }
}

var game = new Game();
canvas.addEventListener("click", (e) => game.clickHandler(e));

game.render();
