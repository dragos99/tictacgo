function GamePreview(gameLogId, parent){
	/* Get reference to html entities */
	this.firstPlayerLabel = document.querySelector(parent + ' .player-first .name');
	this.secondPlayerLabel = document.querySelector(parent + ' .player-second .name');
	this.gameBoard = document.querySelector(parent + ' .game-board');

	/* Constructor */
	this.timeout = 1200;
	this.gameLogId = gameLogId;
	this.boxes = [];
	this.cells = [];
	this.gameLog = [];
	this.lastMove = {
		box: -1,
		cell: -1
	};
	this.currentPlayer = 1;
	this.paused = false;


	/* Methods */
	this.init = function (){
		// Setup board UI
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
			}
			this.cells.push(cells);
		}

		var _this = this;
		this.requestGameLog(this.gameLogId, function(firstPlayer, secondPlayer, gl) {
			// Setup game preview info
			_this.firstPlayer = firstPlayer;
			_this.secondPlayer = secondPlayer;

			_this.firstPlayerLabel.innerHTML = _this.firstPlayer;
			_this.secondPlayerLabel.innerHTML = _this.secondPlayer;

			_this.gameLog = gl;

			// Start game preview
			_this.nextMove();
		});

	} //=> init


	this.nextMove = function(){
		if(this.paused === true) {
			return;
		}

		var log = this.gameLog[0].split(' ');
		this.gameLog.shift();

		if(log[0] === 'DEPTH') {
			this.nextMove();

			return;
		}

		if(log[0] === 'draw') {
			var _this = this;
			
			setTimeout(function() {
				_this.gameOver('Neither');
			}, 1500);

			return;
		}

		if(log[1] === 'draw') {
			this.boxes[log[0]].classList.add('draw');
			this.nextMove();

			return;
		}


		if(log[0] === '1' || log[0] === '0'){ // this must be the player turn
			if(log[1] === 'place_move'){
				var _this = this;
				setTimeout(function() {
					_this.showAvailableMoves();
					_this.showTurn();

					setTimeout(function() {
						_this.placeMove(log[2], log[0]);
						_this.nextMove();
					}, _this.timeout);
				}, _this.timeout);

				return;
			}


			if(log[1] === 'takes'){
				var boxType = (log[0] === '1') ? 'x-taken' : 'o-taken';
				this.boxes[parseInt(log[2])].classList.add(boxType);
				this.nextMove();

				return;
			}

			if(log[1] === 'wins'){
				var winner = '';
				if(log[0] === '1') {
					winner = this.firstPlayer;
				} else if(log[0] === '0') {
					winner = this.secondPlayer;
				} 

				var _this = this;
				setTimeout(function() {
					_this.gameOver(winner);
				}, 1500);
				

				return;
			}

			

		}

	} //=> nextMove


	this.placeMove = function (pos, player){
		var box = Math.floor(pos / 10);
		var cell = pos % 10;

		var cellType = (player == '1') ? 'x-taken' : 'o-taken';

		this.lastMove.box = box;
		this.lastMove.cell = cell;

		this.cells[box][cell].classList.add(cellType);
		this.hideAvailableMoves();
		this.cells[box][cell].classList.add((this.currentPlayer === 1) ? 'x-available' : 'o-available');

		this.currentPlayer = (player == '1') ? 0 : 1;
	} //=> placeMove


	this.showAvailableMoves = function (){
		var availability = (this.currentPlayer === 1) ? 'x-available' : 'o-available';

		if(this.lastMove.cell === -1 || (this.boxes[this.lastMove.cell].classList.contains('x-taken') || this.boxes[this.lastMove.cell].classList.contains('o-taken') || this.boxes[this.lastMove.cell].classList.contains('draw'))){
			for(var i = 0; i < 9; ++i){
				for(var j = 0; j < 9; ++j){
					if(!(this.cells[i][j].classList.contains('x-taken') || this.cells[i][j].classList.contains('o-taken') || this.boxes[i].classList.contains('x-taken')|| this.boxes[i].classList.contains('o-taken')))
					this.cells[i][j].classList.add(availability);
				}
			}
		} else {
			for(var i = 0; i < 9; ++i){
				if(!(this.cells[this.lastMove.cell][i].classList.contains('x-taken') || this.cells[this.lastMove.cell][i].classList.contains('o-taken') || this.boxes[this.lastMove.cell].classList.contains('x-taken')|| this.boxes[this.lastMove.cell].classList.contains('o-taken'))){
					this.cells[this.lastMove.cell][i].classList.add(availability);
				}

			}

		}
		
	} //=> showAvailableMoves


	this.hideAvailableMoves = function (){
		for(var i = 0; i < 9; ++i){
			for(var j = 0; j < 9; ++j){
				this.cells[i][j].classList.remove('x-available');
				this.cells[i][j].classList.remove('o-available');
			}

		}

	} //=> hideAvailableMoves


	this.showTurn = function (){
		if(this.currentPlayer === 1){
			this.secondPlayerLabel.classList.remove('o-turn');
			this.firstPlayerLabel.classList.add('x-turn');
		} else {
			this.secondPlayerLabel.classList.add('o-turn');
			this.firstPlayerLabel.classList.remove('x-turn');
		}

	}


	this.requestGameLog = function (id, callback){
		ajax.get('/getGameLog', id, function(data) {
			var gl = data.split('\n');
			var line = gl[0].split(' ');
			var firstPlayer = line[1] + ' ' + (line[2] ? line[2] : '');
			gl.shift();

			line = gl[0].split(' '); 
			var secondPlayer = line[1] + ' ' + (line[2] ? line[2] : '');
			gl.shift();

			callback(firstPlayer, secondPlayer, gl);
		});

	} //=> requestGameLog


	this.play = function() {
		this.paused = false;
		this.nextMove();
	} //=> play


	this.pause = function() {
		this.paused = true;
		return;
	} //=> pause


	this.gameOver = function(win) {
		var gameOver = document.querySelector(parent + ' .game-over');;
		var gameBoard = this.gameBoard;
		var winner = gameOver.querySelector('.winner');
		var msg = gameOver.querySelector('.message');
		var close = gameOver.querySelector('.close');

		winner.style.color = '#60C74E';
		if(win !== '') {
			win = win + ' Won!';
		} else {
			win = 'It\'s a draw';
		}

		winner.innerHTML = win;
		msg.innerHTML = 'Replaying demo in 5 seconds';

		gameOver.style.display = 'block';
		gameBoard.style.webkitFilter = 'blur(25px)';
		gameBoard.style.filter = 'blur(25px)';


		// go again
		var _this = this;
		setTimeout(function() {
			_this.boxes.length = 0;
			_this.cells.length = 0;
			_this.lastMove = {
				box: -1,
				cell: -1
			};
			_this.currentPlayer = 1;

			// reset ui
			_this.gameBoard.innerHTML = '';
			_this.firstPlayerLabel.innerHTML = '';
			_this.secondPlayerLabel.innerHTML = '';
			gameOver.style.display = 'none';
			gameBoard.style.webkitFilter = 'blur(0px)';
			gameBoard.style.filter = 'blur(0px)';

			_this.init();
		}, 5000);

		close.onclick = function(){
			gameOver.style.display = 'none';
			gameBoard.style.webkitFilter = 'blur(0px)';
			gameBoard.style.filter = 'blur(0px)';
		}
	}


}//=> GamePreview

