$(document).ready(function() {

  /* Instantiate a new game board object every page load.
     Currently the DOM is hardcoded with a typical gameboard but should there be desire
     for a more flexible game, a templater can be later written to dynamically generate the gameboard on the DOM */
  window.currentGame = new Gameboard(6, 7);

  /* Get the player names and create the player objects */
  currentGame.playerOne = new Player('r', prompt("Please enter the name of Player One", "Player One"));
  currentGame.playerTwo = new Player('b', prompt("Please enter the name of Player Two", "Player Two"));
  $('#playerone').text(currentGame.playerOne.name || 'Player One');
  $('#playertwo').text(currentGame.playerTwo.name || 'Player Two');

  /* Initialize the current player to the first player */
  currentGame.currentPlayer = currentGame.playerOne;

  /* Append horizontal line to the page that moves to designate whose turn it is */
  $(document.createElement('div')).attr({ id: 'horizontalLine' }).appendTo($('#players'));

  /* Event handler for when the user clicks on a circle that creates animation and calculates game logic */
  $('.circle').on('click', function(event) {
    var column = parseInt($(this).data('column'));
    currentGame.dropCircle(column);
  });

});