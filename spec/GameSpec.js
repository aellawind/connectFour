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

   describe('Game board helper functions', function() {

    var testBoard;
    beforeEach(function() {
      testBoard = new Gameboard(6,7);
      testBoard.playerOne = new Player('r','Amira');
      testBoard.playerTwo = new Player('b','Anuar');
      testBoard.currentPlayer = testBoard.playerOne;
    });

    it('switches the current player', function() {
      testBoard.switchPlayer();
      expect(testBoard.currentPlayer).to.be.equal(testBoard.playerTwo); 
      testBoard.switchPlayer();
      expect(testBoard.currentPlayer).to.be.equal(testBoard.playerOne);      
    });

    it('drops the next piece into the correct row based on the column', function() {
      testBoard.boardMatrix[testBoard.getDropLocation(0)][0] = 'r';
      testBoard.boardMatrix[testBoard.getDropLocation(1)][1] = 'b';
      testBoard.boardMatrix[testBoard.getDropLocation(0)][0] = 'r';
      testBoard.boardMatrix[testBoard.getDropLocation(0)][0] = 'b';
      testBoard.boardMatrix[testBoard.getDropLocation(1)][1] = 'r';
      testBoard.boardMatrix[testBoard.getDropLocation(6)][6] = 'b';
      testBoard.boardMatrix[testBoard.getDropLocation(6)][6] = 'r';
      testBoard.boardMatrix[testBoard.getDropLocation(0)][0] = 'b';

      expect(testBoard.boardMatrix[2][0]).to.equal('b');
      expect(testBoard.boardMatrix[3][0]).to.equal('b');
      expect(testBoard.boardMatrix[4][0]).to.equal('r');
      expect(testBoard.boardMatrix[5][0]).to.equal('r');
      expect(testBoard.boardMatrix[4][1]).to.equal('r');
      expect(testBoard.boardMatrix[5][1]).to.equal('b');
      expect(testBoard.boardMatrix[4][6]).to.equal('r');
      expect(testBoard.boardMatrix[5][6]).to.equal('b');

    });

  });

  describe('Checking for four-in-a-row after adding a piece to the game baord', function() {

    beforeEach(function() {
      var gameBoard = new Gameboard(6,7);
    });

    it('checks for any horizontal four-in-a-row when dropping into the end', function() {
      
    });

    it('checks for any horizontal four-in-a-row to the left or right when dropping into the middle', function() {
     
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

});
