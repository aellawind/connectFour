describe('Connect Four Game Logic', function() {

  describe('Player class for creating a new player', function() {

    it('creates a new player with name and color', function() {
      var testPlayer = new Player('r','Amira');
      
      expect(testPlayer.color).to.equal('r');
      expect(testPlayer.name).to.equal('Amira');
    });

  });

  describe('Gameboard class to create an MXN game board', function() {

    it('creates an mxn board of 0s with m rows and n columns', function() {
      var testBoard = new Gameboard(6,7);

      expect(testBoard.boardMatrix.length).to.equal(6);
      expect(testBoard.boardMatrix[0].length).to.equal(7);
      expect(testBoard.rows).to.equal(6);
      expect(testBoard.columns).to.equal(7);
    });

    it('creates an mxn board of 0s with m rows and n columns', function() {
      var testBoard = new Gameboard(6,7);

      expect(testBoard.boardMatrix.length).to.equal(6);
      expect(testBoard.boardMatrix[0].length).to.equal(7);
      expect(testBoard.rows).to.equal(6);
      expect(testBoard.columns).to.equal(7);
    });

  });

  describe('Checking for four-in-a-row after adding a piece to the game baord', function() {

    beforeEach(function() {
      var gameBoard = new Gameboard(6,7);
    });

    it('checks for any horizontal four-in-a-row', function() {
     
    });

    it('checks for any diagonal four-in-a-row', function() {
      
    });

    it('checks for any diagonal up-down left-right four-in-a-row', function() {
      
    });

    it('checks for any diagonal up-down right-left four-in-a-row', function() {
     
    });

    it('checks for all potential four-in-a-row wins', function() {
     
    });

  });

  describe('Game board helper functions', function() {

    beforeEach(function() {
      var gameBoard = new Gameboard(6,7);
    });

    it('switches the current player', function() {
      
      
    });

    it('gets the next row a piece should be dropped into', function() {
     
    });

  });

});
