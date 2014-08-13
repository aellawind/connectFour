$(document).ready(function() {

  

  /* Instantiate a new game board every page load, as well as two players */
  var currentGame = new Gameboard(6,7);
  /* Get the player names and create the player objects */
  currentGame.playerOne = new Player('r',prompt("Please enter the name of Player One", "Player One"));
  currentGame.playerTwo = new Player('b',prompt("Please enter the name of Player Two", "Player Two"));
  $('#playerone').text(currentGame.playerOne.name || 'Player One');
  $('#playertwo').text(currentGame.playerTwo.name || 'Player Two');

  // Initialize the current player to the first player
  currentGame.currentPlayer = currentGame.playerOne;

  // Event handler for when the user clicks on a circle
  $('.circle').on('click', function(event) {
    var column = parseInt($(this).data('column'));
    currentGame.dropCircle(column);
  });

});