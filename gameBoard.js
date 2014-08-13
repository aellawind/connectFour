/* Gameboard class */
window.Gameboard = function(rows,columns) {
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
  this.currentPlayer;
  this.playerOne;
  this.playerTwo;
};

// Animate the line between the two player names to designate whose turn it is
var moveLineTo = function(currentPlayer) {
  var newLeft = currentPlayer === currentGame.playerOne ? '0%' : '50%';
  $( "#horizontalLine" ).animate({
    left: newLeft
  }, 500, "linear", function() {
    // Animation complete
  });
};

Gameboard.prototype.win = function() {
  alert('Congratulations, ' + this.currentPlayer.name + '. You have won! Play again?');
  window.location.reload();
};

Gameboard.prototype.switchPlayer = function() {
  // If there is no four a row, we switch the current player and return false
  this.currentPlayer = this.currentPlayer === this.playerOne ? this.playerTwo: this.playerOne;
  moveLineTo(this.currentPlayer);
};

// This function animates a piece from the top of the board to the inputted location
Gameboard.prototype.animatePiece = function(rowDrop,column,callback) {
    
  var board = this;
  $("#screenCover").css('display','block');
  var columnString = '[data-column="' + column + '"]';
  var colorClass = board.currentPlayer === board.playerOne ? 'redCircle' : 'blackCircle';
  var isWin = board.checkForWin(rowDrop,column);
  // Animate the circle from top to bottom
  for (var j = 0; j <= rowDrop; j++) {
    (function(row) {
      var rowStringStart = '[data-row="' + row + '"]';
      $circleToAnimate = $(document.querySelector(rowStringStart).querySelector(columnString));
      var $tempCircle = $('<div class="circle tempCircle"></div>').appendTo($circleToAnimate);
      $tempCircle.addClass(colorClass);
      setTimeout(function() { 
        $tempCircle.addClass('dropped');
      },row*250);
      setTimeout(function() {
        $tempCircle.remove(); // Remove the div once transition completes
      },(row+1)*500);
      // Once we are animating the correct cell, we check to see if there is a win
      // And then switch the player, unlocking the screen for the next move
      if (row===rowDrop) {
        setTimeout(function() {
          // Change the color of the circle that gets the next piece 
          var rowString = '[data-row="' + rowDrop + '"]'; 
          var circle = document.querySelector(rowString).querySelector(columnString);
          $(circle).addClass(colorClass);
          if (isWin) {
            board.win();
          }
          board.switchPlayer();
          $("#screenCover").css('display','none');
        },row*250+250);
      }
    })(j);
  }
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
    board.boardMatrix[rowDrop][column] = board.currentPlayer.color;
    board.animatePiece(rowDrop,column);
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
        if (board.boardMatrix[row][j] !== board.currentPlayer.color) {
          hasFourInARow = false;
        }
      }
      // If four in a row is still true after looping, return true
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
        if (board.boardMatrix[j][column] !== board.currentPlayer.color) {
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
        if (board.boardMatrix[y][x] !== board.currentPlayer.color) {
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
        if (board.boardMatrix[y][x] !== board.currentPlayer.color) {
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