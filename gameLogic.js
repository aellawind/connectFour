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

Gameboard.prototype.checkGame = function() {

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


    // We are now switching players
    currentPlayer = currentPlayer === playerOne ? playerTwo: playerOne;
  }

});
