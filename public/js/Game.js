
function Game(){
	/* Get reference to html entities */
	this.gameContainer = document.querySelector('.game-container');
	this.firstPlayerLabel = this.gameContainer.querySelector('.player-first .name');
	this.secondPlayerLabel = this.gameContainer.querySelector('.player-second .name');
	this.gameBoard = this.gameContainer.querySelector('.game-board');


	/* Constructor */
	this.gameState = -1;
	this.boxes = [];
	this.cells = [];
	this.difficulty = 2;
	this.gameLog = '';
	this.currentPlayer = 1;
	this.player = 1;
	this.bot = 0;
    this.botname = ['Drunk Bob','Johnny Star','Super Steve']


	/* Methods */
	this.init = function() {

		// play chilling song
		audio.playMusic();

		// clear game UI
		this.gameBoard.innerHTML = '';
		this.gameBoard.style.webkitFilter = 'blur(0px)';

		// setup board UI
		this.secondPlayerLabel.innerHTML = this.botname[this.difficulty/2 - 1];
		var htmlClass;

		for(var i = 0; i < 9; ++i) {
			var html = '<div class="box-container"><div class="box">';

			for(var j = 0; j < 9; ++j) {
				if(j < 3) {
					htmlClass = 'fade-in-left-0';
				} else if(j < 6) {
					htmlClass = 'fade-in-left-1';
				} else {
					htmlClass = 'fade-in-left-2';
				}
				html += '<div class="cell-container '+ htmlClass +'"><div class="cell" box="'+ i +'" cell="'+ j +'"></div></div>';
			}

			html += '</div></div>'; 
			this.gameBoard.insertAdjacentHTML('beforeend', html);
		}

		// get reference to html entities
		for(var i = 0; i < 9; ++i) {
			var currentBox = this.gameBoard.children[i].children[0];
			this.boxes.push(currentBox);

			var cells = [];
			for(var j = 0; j < 9; ++j) {
				cells.push(currentBox.children[j].children[0]);

				// setup click event
				var _this = this;
				currentBox.children[j].children[0].onclick = function() {
					_this.placeMove(this.getAttribute('box') + '' + this.getAttribute('cell'), _this.player);
				}
			}
			this.cells.push(cells);
		}

		// init game log
		this.gameLog = 'PLAYER ' + this.player + '\n';
		this.gameLog += 'BOT ' + this.bot + '\n';
		this.gameLog += 'DEPTH ' + botik.maxDepth + '\n';

		// start placing moves
		this.requestMove();

	} //=> init


	this.placeMove = function(move, player) {
		var moveBox = Math.floor(parseInt(move) / 10);
		var moveCell = Math.floor(parseInt(move) % 10);

		// cancel if move is illegal
		if(this.checkLegalMove(moveBox, moveCell, player) === false){
			this.requestMove();
			return;
		}

		// update board 
		putInGameState(move, gs);

		// update game log
		this.gameLog += this.currentPlayer + ' place_move ' + moveBox + moveCell + '\n';

		// change UI
		var movePlace = this.cells[moveBox][moveCell];
		movePlace.classList.add(this.currentPlayer === 1 ? 'x-taken' : 'o-taken');
		this.checkOwnership(moveBox);
		this.hideAvailableMoves();
		movePlace.classList.add(this.currentPlayer === 1 ? 'x-available' : 'o-available');


		// update current player
		this.currentPlayer = gs.currentPlayer;

		// play sound
		audio.gameSound(this.currentPlayer)

		// check winner
		var winner = gs.winner;
		if(winner < 2) {
			this.gameOver(winner);
			return;
		}

		this.requestMove();

	} //=> placeMove


	this.requestMove = function() {
		this.showAvailableMoves();

        // request move from bot after 700ms
		if(gs.currentPlayer == this.bot) {
			setTimeout(() => {
			    var res = botik.takeMove(this.difficulty, gs, gs.currentPlayer);

                // wait if bot ready
			    if (res === 'notReady') {
			        setTimeout(() => {
			            this.requestMove();
			        }, 200);

			        return;
			    }

				this.placeMove(res, this.bot);
			}, 700);

		}

	} //=> requestMove


	this.showAvailableMoves = function() {
		if(gs.winner < 3)
			return;

		var moves = disponibleMoves(gs);
		var availability = (gs.currentPlayer === 1) ? 'x-available' : 'o-available';

		for(var i = 0; i < moves.length; ++i){
			var cell = moves[i] % 10;
			var box = Math.floor(moves[i] / 10);

			this.cells[box][cell].classList.add(availability);
		}
	} //=> showAvailableMoves


	this.hideAvailableMoves = function() {
		for(var i = 0; i < 9; ++i){
			for(var j = 0; j < 9; ++j){
				this.cells[i][j].classList.remove('x-available');
				this.cells[i][j].classList.remove('o-available');
			}
		}
	} //=> hideAvailableMoves


	this.checkOwnership = function(box) {
		if(gs.board[box].winner < 2) {
			var winner = gs.board[box].winner;
			var winnerClass = winner === 1 ? 'x-taken' : 'o-taken';
			this.boxes[box].classList.add(winnerClass);

			

			// update game log
			this.gameLog += winner + ' takes ' + box + '\n';
		}
	}


	this.checkLegalMove = function(box, cell, player) {
		var pos = this.cells[box][cell];
		if(player !== this.currentPlayer || gs.winner < 3)
			return false;
		if(pos.classList.contains('x-taken') || pos.classList.contains('o-taken'))
			return false;
		if(pos.classList.contains('x-available') || pos.classList.contains('o-available'))
			return true;

		return false;
	} //=> checkLegalMove


	this.gameOver = function(player) {
		var gameOver = document.querySelector('.game-container .game-over');
		var gameBoard = this.gameBoard;
		var winner = gameOver.querySelector('.winner');
		var msg = gameOver.querySelector('.message');
		var close = gameOver.querySelector('.close');

		winner.style.color = player === this.bot ? '#F1625E' : '#60C74E';

		winner.innerHTML = player === this.player ? 'YOU WON!' : 'YOU LOST!';
		msg.innerHTML = player === this.player ? 'Excelent, you are a genius!' : 'Better luck next time!';

		gameOver.style.display = 'block';
		gameBoard.style.webkitFilter = 'blur(25px)';
		gameBoard.style.filter = 'blur(25px)';

		audio.pauseMusic();

		// update game log and send to server
		this.gameLog += player + ' wins\n';
		this.syncGameLog();

		close.onclick = function(){
			gameOver.style.display = 'none';
			gameBoard.style.webkitFilter = 'blur(0px)';
			gameBoard.style.filter = 'blur(0px)';
		}
	} //=> game over


	this.undo = function() {
		console.log(this.currentPlayer, this.player, gs.winner);
		if(this.currentPlayer !== this.player && gs.winner == 3)
			return;

		var undos = undoPair(gs);

		for(var i = 0; i < undos.length; ++i) {
			if(undos[i] === null)
				continue;
			var box = Math.floor(undos[i] / 10);
			var cell = undos[i] % 10;

			// undo move from cell
			this.cells[box][cell].classList.remove('x-taken');
			this.cells[box][cell].classList.remove('o-taken');
			// undo box to the initial state
			if(this.boxes[box].classList.contains('x-taken') || this.boxes[box].classList.contains('o-taken')) {
				this.boxes[box].classList.remove('x-taken');
				this.boxes[box].classList.remove('o-taken');
			}

			this.currentPlayer = this.currentPlayer === 1 ? 0 : 1;
		}

		this.hideAvailableMoves();

		this.requestMove();
	} //=> undo


	this.syncGameLog = function() {
		ajax.post('/gameLog', this.gameLog, function(res){
			console.log('Server: ' + res);
		});
	} //=> syncGameLog


}


