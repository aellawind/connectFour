// there are 3 states for each square. non played, character 1 or character 2
var currentPlayer; 

var Gameboard = function(rows,columns) {
  var boardMatrix = [];
  for (var i = 0; i < rows; i++) {
    var row = [];
    for (var j = 0; j < columns; j++) {
      row.push(0);
    }
    boardMatrix.push(row);
  }

  this.rows = rows;
  this.columns = columns;
  this.boardMatrix = boardMatrix;
};

var Player = function(color) {
  this.wins = 0;
  this.losses = 0;
  this.color = color;
};

Gameboard.prototype.dropCircle = function(column) {
  var board = this;
  var getDropLocation = function(column) {
    var i = board.rows-1;
    var current = board.boardMatrix[i][column];
    while (current !== 0 && i >= 0) {
      i--;
      current = i >= 0 ? board.boardMatrix[i][column] : 0;
    }
    return i;
  };
  var rowDrop = getDropLocation(column);
  if (rowDrop >= 0) {
    board.boardMatrix[rowDrop][column] = currentPlayer.color;
    // Change the correct color
    var rowString = '[data-row="' + rowDrop + '"]';
    var columnString = '[data-column="' + column + '"]';
    var circle = document.querySelector(rowString).querySelector(columnString);
    if(currentPlayer === playerOne) {
      $(circle).addClass('redCircle');
    } else if(currentPlayer === playerTwo) {
      $(circle).addClass('blackCircle');
    }
    return true;
  }
  return false;
};

Gameboard.prototype.checkForWin = function(row,column) {
  // Checking the next four from leftstart to rightend, topStart to bottomEnd
  var board = this;
  var leftStart = column-3 >= 0 ? column-3 : 0;
  var rightEnd = this.columns-column >= 4 ? column : this.columns-4;
  var topStart = row-3 >= 0 ? row-3 : 0;
  var bottomEnd = this.rows-row >= 4 ? row : this.rows-4;

  var checkHorizontal = function() {
    for (var i = leftStart; i <= rightEnd; i++) {
      // For every i, we check the next 4
      var rightFour = i+3<board.columns ? i+3 : board.columns-1;
      var hasFourInARow = true;
      for (var j = i; j <= rightFour; j++) {
        if (board.boardMatrix[row][j] !== currentPlayer.color) {
          hasFourInARow = false;
        }
      }
      // If four in a row is still true after looping, return
      if (hasFourInARow === true) {
        return true;
      }
    }
    return false;
  };  

  // check vertical
  var checkVertical = function() {
    for (var i = topStart; i <= bottomEnd; i++ ) {
      var downFour = i+3 < board.rows ? i + 3 : board.rows-1;
      var hasFourInARow = true;
      for (var j = i; j <= downFour; j++ ) {
        if (board.boardMatrix[j][column] !== currentPlayer.color) {
          hasFourInARow = false;
        }
      }
      if (hasFourInARow === true) {
        return true;
      }
    }
    return false;
  };

  var getTopStart = function() {
    var point = {};
    point.top = row-3;
    point.left = column-3;
    if (point.top < 0) {
      point.left = point.left-point.top; // Add the difference to our left point
      point.top = 0;
    } else if (point.left < 0) {
      point.top = point.top-point.left;
      point.left = 0;
    }
    return point;
  };

  var getTopRightStart = function() {
    var point = {};
    point.top = row-3;
    point.right = column+3;
    if (point.top < 0) {
      point.right = point.right+point.top; // Add the difference to our left point
      point.top = 0;
    } else if (point.right >=board.columns) {
      point.top = point.top + point.right - board.columns;
      point.right = board.columns-1;
    }
    return point;
  };

  // check diagonals
  var checkUpDownDiagonal = function() {
    var startPoint = getTopStart();
    var xStart = startPoint.left;
    var yStart = startPoint.top;
    // Iterate over all of our possible start points
    for (var i = startPoint.left; i <= column ; i++) {
      var hasFourInARow = true;
      var x = xStart;
      var y = yStart;
      var j;
      // Check the next four circles (diagonally)
      for (j = 0; j<4; j++) {
        if (board.boardMatrix[y][x] !== currentPlayer.color) {
          hasFourInARow = false;
        }
        x++;
        y++;
        if (x >= board.columns || y >= board.rows) { break; }
      }
      if (hasFourInARow === true && j===3) {
        return true;
      }
      xStart++;
      yStart++;
    }
    return false;
  };

  var checkDownUpDiagonal = function() {
    var startPoint = getTopRightStart();
    var xStart = startPoint.right;
    var yStart = startPoint.top;
    // Iterate over all of our possible start points
    for (var i = startPoint.right; i >= column ; i--) {
      var hasFourInARow = true;
      var x = xStart;
      var y = yStart;
      var j;
      // Check the next four circles (diagonally)
      for (j = 0; j<4; j++) {
        console.log('');
        console.log('new');
        console.log('xy',y,x);
        if (board.boardMatrix[y][x] !== currentPlayer.color) {
          hasFourInARow = false;
        }
        x--;
        y++;
        if (x < 0|| y >= board.rows) { break; }
      }
      if (hasFourInARow === true && j===3) {
        return true;
      }
      xStart--;
      yStart++;
    }
    return false;
  };

  if (checkHorizontal() || checkVertical() || checkUpDownDiagonal() || checkDownUpDiagonal()) {
    return true;
  }
  return false;
};

// Instantiate a new game board every page load, as well as two players
var currentGame = new Gameboard(6,7);
var playerOne = new Player('r');
var playerTwo = new Player('b');

// Initialize the current player to the first player
var currentPlayer = playerOne;

// Event handler for when the user clicks on a circle
$('.circle').on('click', function(event) {
  var row = parseInt($(this).parent().parent().data('row'));
  var column = parseInt($(this).data('column'));
	if(currentGame.dropCircle(column)) {
    // Check the game to see if there is a win
    if(currentGame.checkForWin(row,column)) {
      alert('You have won!');
    }

    // We are now switching players
    currentPlayer = currentPlayer === playerOne ? playerTwo: playerOne;
  }

});
