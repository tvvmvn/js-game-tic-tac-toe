(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.backgroundColor = "#222";
  canvas.addEventListener("click", clickHandler);

  /* constants  */

  const GRID_SIZE = 300;
  const GRID_OFFSET_X = (canvas.width - GRID_SIZE) / 2;
  const GRID_OFFSET_Y = 100;
  const GRID_LINE_COUNT = 3;
  const GRID_ITEM_SIZE = GRID_SIZE / GRID_LINE_COUNT;
  const USER = 1;
  const COM = 2;

  /* variables */

  var board;
  var target;
  var start;
  var result;
  var winner;
  var turn;
  var lot = false;
  var row, col;

  /* run the game */
    
  setInterval(run, 10);
    
  function run() {
    clearCanvas();
    drawBoard();

    if (!start) {
      initialize();
      return;
    }

    getResult();
    drawSymbol();

    if (result) {
      drawResult();
    } else {
      if (turn == COM) {
        setTimeout(com, 1000);
        turn = null;
      }
    }
  }

  function drawBoard() {
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

  function initialize() {
    result = null;
    winner = null;
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]

    if (!lot) {
      turn = Math.ceil(Math.random() * 2);
      lot = true;
    }

    var message = (turn == USER ? "YOU" : "COM") + " First, Ready?";
    
    drawMessage(message);
  }

  /* functions */

  function com() {
    setAlg();

    if (target != null) { 
      var [tr, tc] = target;
      board[tr][tc] = COM;
      target = null;
    } else {
      while (true) {
        var r = Math.floor(Math.random() * 3);
        var c = Math.floor(Math.random() * 3);

        if (result) {
          break;
        }

        if (board[r][c] == 0) {
          board[r][c] = COM;
          break;
        }
      }
    }

    turn = USER;
  }

  function setAlg() {
    fill_hole([0, 1], [1, 1], [2, 1]);
    fill_hole([1, 0], [1, 1], [1, 2]);
    fill_hole([2, 0], [1, 1], [0, 2]);
    fill_hole([0, 0], [1, 1], [2, 2]);

    fill_hole([0, 0], [0, 1], [0, 2]);
    fill_hole([0, 0], [1, 0], [2, 0]);
    fill_hole([2, 0], [2, 1], [2, 2]);
    fill_hole([0, 2], [1, 2], [2, 2]);
  }

  function fill_hole([r1, c1], [r2, c2], [r3, c3]) {
    if (
      board[r2][c2] != 0
      && board[r2][c2] == board[r3][c3]
      && board[r1][c1] == 0
    ) {
      target = [r1, c1];
    } else if (
      board[r1][c1] != 0
      && board[r1][c1] == board[r3][c3]
      && board[r2][c2] == 0
    ) {
      target = [r2, c2];
    } else if (
      board[r1][c1] != 0
      && board[r1][c1] == board[r2][c2]
      && board[r3][c3] == 0
    ) {
      target = [r3, c3];
    }
  }

  function getResult() {
    // 1. get bingo
    checkBingo([0, 1], [1, 1], [2, 1]);
    checkBingo([1, 0], [1, 1], [1, 2]);
    checkBingo([2, 0], [1, 1], [0, 2]);
    checkBingo([0, 0], [1, 1], [2, 2]);

    checkBingo([0, 0], [0, 1], [0, 2]);
    checkBingo([0, 0], [1, 0], [2, 0]);
    checkBingo([2, 0], [2, 1], [2, 2]);
    checkBingo([0, 2], [1, 2], [2, 2]);

    if (result == "DONE") {
      return;
    }

    // 2. get draw
    var drawn = true;

    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[r].length; c++) {
        if (board[r][c] == 0) {
          drawn = false;
          break;
        }
      }
    }

    if (drawn) {
      result = "DRAW";
      winner = null;
    }
  }

  function checkBingo([r1, c1], [r2, c2], [r3, c3]) {
    if (
      board[r1][c1] != 0 
      && board[r1][c1] == board[r2][c2] 
      && board[r2][c2] == board[r3][c3]
    ) {
      result = "DONE";
      winner = board[r1][c1];
    }
  }

  /* draw */
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawResult() {
    if (result == "DONE") {
      if (winner == USER) {
        drawMessage("YOU WIN");
      } else {
        drawMessage("YOU LOSE");
      }
    }

    if (result == "DRAW") {
      drawMessage("DRAW!");
    }
  }
  
  function drawSymbol() {
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
  }

  function drawMessage(message) {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      message,
      canvas.width / 2,
      60,
    );
  }

  /* control */

  function clickHandler(e) {
    if (!start) {
      start = true;
      return;
    }

    if (result) {
      start = false;
      lot = false;
      return;
    }

    if (turn != USER) return;
    
    var r = Math.floor((e.offsetY - GRID_OFFSET_Y) / GRID_ITEM_SIZE);
    var c = Math.floor((e.offsetX - GRID_OFFSET_X) / GRID_ITEM_SIZE);

    if (r > -1 && r < GRID_LINE_COUNT && c > -1 && c < GRID_LINE_COUNT) {
      row = r;
      col = c;

      if (board[row][col] == 0) {
        board[row][col] = USER;
        turn = COM;
      }
    }
  }
})();

