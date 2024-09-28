// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "#222";

// controller
canvas.addEventListener("click", function () {
  var r = Math.floor((e.offsetY - GRID_OFFSET_Y) / GRID_ITEM_SIZE);
  var c = Math.floor((e.offsetX - GRID_OFFSET_X) / GRID_ITEM_SIZE);

  if (r > -1 && r < GRID_LINE_COUNT && c > -1 && c < GRID_LINE_COUNT) {
    inputRow = r;
    inputCol = c;
  }
});

// input
var umpire = new Umpire();
var user = new User();
var com = new Com();
var stage = new Stage();
var board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

// root.render()
function main() {
  clearCanvas();
  stage.render();
  user.render();
  com.render();
  umpire.render();
}

// Class
class Stage {
  GRID_SIZE = 300;
  GRID_OFFSET_X = (canvas.width - GRID_SIZE) / 2;
  GRID_OFFSET_Y = 100;
  GRID_LINE_COUNT = 3;
  GRID_ITEM_SIZE = GRID_SIZE / GRID_LINE_COUNT;

  drawBoard() {
    ctx.beginPath();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 4;

    for (var r = 1; r < GRID_LINE_COUNT; r++) {
      ctx.moveTo(GRID_OFFSET_X, GRID_OFFSET_Y + (GRID_ITEM_SIZE * r));
      ctx.lineTo(GRID_OFFSET_X + GRID_SIZE, GRID_OFFSET_Y + (GRID_ITEM_SIZE * r));
    }

    for (var c = 1; c < GRID_LINE_COUNT; c++) {
      ctx.moveTo(GRID_OFFSET_X + (GRID_ITEM_SIZE * c), GRID_OFFSET_Y);
      ctx.lineTo(GRID_OFFSET_X + (GRID_ITEM_SIZE * c), GRID_OFFSET_Y + GRID_SIZE);
    }

    ctx.stroke();
  }
}

class Umpire {
  // 0 drawn, 1 user, 2 com
  result = -1; 

  // who do first 
  lot() {
    return Math.ceil(Math.random() * 2);
  }

  isBingo() {
    // horizontal bingo
    for (var r = 0; r < 3; r++) {
      if (
        board[r][0] != 0
        && board[r][0] == board[r][1] 
        && board[r][1] == board[r][2]
      ) {
        return board[r][0];
      }
    }
    
    // vertical bingo
    for (var c = 0; c < 3; c++) {
      if (
        board[0][c] != 0
        && board[0][c] == board[1][c] 
        && board[1][c] == board[2][c]
      ) {
        return board[0][c];
      }
    }

    // cross bingo (\)
    if (
      board[0][0] != 0
      && board[0][0] == board[1][1] 
      && board[1][1] == board[2][2]
    ) {
      return board[0][0];
    }

    // cross bingo (/)
    if (
      board[0][2] != 0
      && board[0][2] == board[1][1] 
      && board[1][1] == board[2][0]
    ) {
      return board[0][2];
    }
    
    // no bingo
    return false;
  }

  isDrawn() {
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        if (board[r][c] == 0) {
          return false;
        }
      }
    }

    return true;
  }

  render() {
    if (over) {
      // message: YOU WIN! or YOU LOSE
    } else if (drawn) {
      // message: DRAW!
    }
  }
}

class User {
  inputRow = 0;
  inputCol = 0;

  render() {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var x = GRID_OFFSET_X + (c * GRID_ITEM_SIZE);
        var y = GRID_OFFSET_Y + (r * GRID_ITEM_SIZE);

        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 8;

        ctx.arc(x + 50, y + 50, 30, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
}

class Com {
  row;
  col;

  choose() {
    while (true) {
      var r = Math.floor(Math.random() * 3);
      var c = Math.floor(Math.random() * 3);

      if (board[r][c] == 0) {
        board[r][c] = COM;
        break;
      }
    }

    turn = USER;
  }

  render() {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var x = GRID_OFFSET_X + (c * GRID_ITEM_SIZE);
        var y = GRID_OFFSET_Y + (r * GRID_ITEM_SIZE);

        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 8;

        ctx.moveTo(x + 20, y + 20);
        ctx.lineTo(x + 80, y + 80);
        ctx.moveTo(x + 80, y + 20);
        ctx.lineTo(x + 20, y + 80);

        ctx.stroke();
      }
    }    
  }
}

