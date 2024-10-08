(function () {
  // canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#222";
  canvas.addEventListener("click", clickHandler);

  // constants 
  const GRID_SIZE = 300;
  const GRID_OFFSET_X = (canvas.width - GRID_SIZE) / 2;
  const GRID_OFFSET_Y = 100;
  const GRID_LINE_COUNT = 3;
  const GRID_ITEM_SIZE = GRID_SIZE / GRID_LINE_COUNT;
  const USER = 1;
  const COM = 2;

  // variables 
  var lot = Math.ceil(Math.random() * 2);
  var turn = lot;
  var bingo;
  var drawn;
  var row, col;
  var count = 0;
  var message = "";
  var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]

  // control 
  function clickHandler(e) {
    if (turn == USER) {
      var r = Math.floor((e.offsetY - GRID_OFFSET_Y) / GRID_ITEM_SIZE);
      var c = Math.floor((e.offsetX - GRID_OFFSET_X) / GRID_ITEM_SIZE);
  
      if (r > -1 && r < GRID_LINE_COUNT && c > -1 && c < GRID_LINE_COUNT) {
        row = r;
        col = c;
  
        if (board[row][col] == 0) {
          board[row][col] = USER;
          turn = COM;
          count++;
        }
      }
    }
  }

  // run the game 
  function main() {
    if (count < 2) {
      if (lot == USER) {
        message = "YOU FIRST";
      } else {
        message = "COM FIRST";
      }
    } else {
      message = "";
    }

    bingo = isBingo();
    drawn = isDrawn();

    if (bingo || drawn) {
      if (bingo) {
        if (bingo == USER) {
          message = "YOU WIN!";
        } else {
          message = "YOU LOSE!";
        }
      } else {
        message = "DRAW!";
      }
    } else {
      if (turn == COM) {
        setTimeout(com, 1000);
        turn = null;
      }

      requestAnimationFrame(main);
    }

    render();
  };

  main();

  // functions 
  function com() {
    while (true) {
      var r = Math.floor(Math.random() * 3);
      var c = Math.floor(Math.random() * 3);

      if (board[r][c] == 0) {
        board[r][c] = COM;
        count++;
        break;
      }
    }

    turn = USER;
  }

  function isBingo() {
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

  function isDrawn() {
    return count == 9;
  }

  // draw 
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // board
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

    // symbols
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        var id = board[r][c];

        var x = GRID_OFFSET_X + (c * GRID_ITEM_SIZE);
        var y = GRID_OFFSET_Y + (r * GRID_ITEM_SIZE);

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

    // messages
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, 60);
  }
})();



