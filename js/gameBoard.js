(function() {

  /****************************************************************************
   Helper functions for gameboard class.
   ***************************************************************************/

  // Animate the line between the two player names to designate whose turn it is
  var moveLineTo = function(currentPlayer) {
    var newLeft = currentPlayer === currentGame.playerOne ? '0%' : '50%';
    $("#horizontalLine").animate({
      left: newLeft
    }, 500, "linear", function() {});
  };

  // Check if there are any horizontal wins on this row within the left start and right end
  var checkHorizontal = function(row, column) {
    var leftStart = column - 3 >= 0 ? column - 3 : 0;
    var rightEnd = this.columns - column >= 4 ? column : this.columns - 4;
    for (var i = leftStart; i <= rightEnd; i++) {
      var rightFour = i + 3 < this.columns ? i + 3 : this.columns - 1; // Take into account board bounds
      var hasFourInARow = true;
      for (var j = i; j <= rightFour; j++) {
        if (this.boardMatrix[row][j] !== this.currentPlayer.color) {
          hasFourInARow = false;
        }
      }
      if (hasFourInARow === true) {
        return true;
      }
    }
    return false;
  };

  // Check if there are any vertical wins within the topstart and bottom end
  var checkVertical = function(row, column) {
    var topStart = row - 3 >= 0 ? row - 3 : 0;
    var bottomEnd = this.rows - row >= 4 ? row : this.rows - 4;
    for (var i = topStart; i <= bottomEnd; i++) {
      var downFour = i + 3 < this.rows ? i + 3 : this.rows - 1;
      var hasFourInARow = true;
      for (var j = i; j <= downFour; j++) {
        if (this.boardMatrix[j][column] !== this.currentPlayer.color) {
          hasFourInARow = false;
        }
      }
      if (hasFourInARow === true) {
        return true;
      }
    }
    return false;
  };

  /* Based on the column we've just added to, this function calculates the top left
     start coordinates for where we want to start checking diagonal wins (left up to down right */
  var getTopStart = function(row, column) {
    var point = {};
    point.top = row - 3;
    point.left = column - 3;
    if (point.top < 0) {
      point.left = point.left - point.top; // Add the difference to our left point
      point.top = 0;
    } else if (point.left < 0) {
      point.top = point.top - point.left;
      point.left = 0;
    }
    return point;
  };


  /* Based on the column we've just added to, this function calculates the top right
     start coordinates for where we want to start checking diagonal wins (right up to down left */
  var getTopRightStart = function(row, column) {
    var point = {};
    point.top = row - 3;
    point.right = column + 3;
    if (point.top < 0) {
      point.right = point.right + point.top; // Add the difference to our left point
      point.top = 0;
    } else if (point.right >= this.columns) {
      point.top = point.top + point.right - this.columns;
      point.right = board.columns - 1;
    }
    return point;
  };

  // Check the diagonal solutions from left up down right
  var checkUpDownDiagonal = function(row, column) {
    var startPoint = getTopStart(row, column);
    var xStart = startPoint.left;
    var yStart = startPoint.top;
    for (var i = startPoint.left; i <= column; i++) {
      var hasFourInARow = true;
      var x = xStart;
      var y = yStart;
      var j;
      // Check the next four circles (diagonally)
      for (j = 0; j < 4; j++) {
        if (this.boardMatrix[y][x] !== this.currentPlayer.color) {
          hasFourInARow = false;
        }
        x++;
        y++;
        if (x >= this.columns || y >= this.rows) {
          break;
        }
      }
      if (hasFourInARow === true && j === 3) {
        return true;
      }
      xStart++;
      yStart++;
    }
    return false;
  };

  // Check the diagonal solutions from right up to down left
  var checkDownUpDiagonal = function(row, column) {
    var startPoint = getTopRightStart(row, column);
    var xStart = startPoint.right;
    var yStart = startPoint.top;
    // Iterate over all of our possible start points
    for (var i = startPoint.right; i >= column; i--) {
      var hasFourInARow = true;
      var x = xStart;
      var y = yStart;
      var j;
      // Check the next four circles (diagonally)
      for (j = 0; j < 4; j++) {
        if (this.boardMatrix[y][x] !== this.currentPlayer.color) {
          hasFourInARow = false;
        }
        x--;
        y++;
        if (x < 0 || y >= this.rows) {
          break;
        }
      }
      if (hasFourInARow === true && j === 3) {
        return true;
      }
      xStart--;
      yStart++;
    }
    return false;
  };


  /****************************************************************************
   Helper functions for gameboard class.
   ***************************************************************************/

  window.Gameboard = function(rows, columns) {
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

  Gameboard.prototype.checkHorizontal = checkHorizontal;
  Gameboard.prototype.checkVertical = checkVertical;
  Gameboard.prototype.checkUpDownDiagonal = checkUpDownDiagonal;
  Gameboard.prototype.checkDownUpDiagonal = checkDownUpDiagonal;

  /* Based on the piece that was just added to the board, this function checks for
     any wins that could have just happened due to this addition */
  Gameboard.prototype.checkForWin = function(row, column) {
    if (this.checkHorizontal(row, column) || this.checkVertical(row, column) ||
      this.checkUpDownDiagonal(row, column) || this.checkDownUpDiagonal(row, column)) {
      return true;
    }
    return false;
  };

  // Place a piece into the board matrix if possible, and animate a piece there 
  Gameboard.prototype.dropCircle = function(column) {
    var rowDrop = this.getDropLocation(column);
    if (rowDrop >= 0) {
      this.boardMatrix[rowDrop][column] = this.currentPlayer.color;
      this.animatePiece(rowDrop, column);
      return true;
    }
    return false;
  };

  // Based on a column, return the row the next piece will be dropped into
  Gameboard.prototype.getDropLocation = function(column) {
    var i = this.rows - 1;
    var current = this.boardMatrix[i][column];
    while (current !== 0 && i >= 0) {
      i--;
      current = i >= 0 ? this.boardMatrix[i][column] : 0;
    }
    return i;
  };

  Gameboard.prototype.switchPlayer = function() {
    // If there is no four a row, we switch the current player and return false
    this.currentPlayer = this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;
    moveLineTo(this.currentPlayer);
  };

  /* This function animates a piece from the top of the board to the inputted location
     Once the animation is complete, this function checks if there is a win and lets the user know.
     If there is no win, the screen overlay goes away and the player switches, for the next turn */
  Gameboard.prototype.animatePiece = function(rowDrop, column, callback) {

    var board = this;
    $("#screenCover").css('display', 'block');
    var columnString = '[data-column="' + column + '"]';
    var colorClass = board.currentPlayer === board.playerOne ? 'redCircle' : 'blackCircle';
    var isWin = board.checkForWin(rowDrop, column);
    // Animate the circle from top to bottom
    for (var j = 0; j <= rowDrop; j++) {
      (function(row) {
        var rowStringStart = '[data-row="' + row + '"]';
        $circleToAnimate = $(document.querySelector(rowStringStart).querySelector(columnString));
        var $tempCircle = $('<div class="circle tempCircle"></div>').appendTo($circleToAnimate);
        $tempCircle.addClass(colorClass);
        setTimeout(function() {
          $tempCircle.addClass('dropped');
        }, row * 250);
        setTimeout(function() {
          $tempCircle.remove(); // Remove the div once transition completes
        }, (row + 1) * 500);
        // Once we are animating the correct cell, we check to see if there is a win
        // And then switch the player, unlocking the screen for the next move
        if (row === rowDrop) {
          setTimeout(function() {
            // Change the color of the circle that gets the next piece 
            var rowString = '[data-row="' + rowDrop + '"]';
            var circle = document.querySelector(rowString).querySelector(columnString);
            $(circle).addClass(colorClass);
            if (isWin) {
              board.win();
            }
            board.switchPlayer();
            $("#screenCover").css('display', 'none');
          }, row * 250 + 250);
        }
      })(j);
    }
  };

  Gameboard.prototype.win = function() {
    alert('Congratulations, ' + this.currentPlayer.name + '. You have won! Play again?');
    window.location.reload();
  };

}());