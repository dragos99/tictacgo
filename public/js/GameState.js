
/*
0 - zero
1 - x
2 - draw
3 - liber
*/

function Box() {

	this.cells = [3, 3, 3, 3, 3, 3, 3, 3, 3];
	this.winner = 3;
	this.row = [[0, 0], [0, 0], [0, 0]];
	this.col = [[0, 0], [0, 0], [0, 0]];
	this.dp = [0, 0];
	this.ds = [0, 0];
	this.cellNumber = [0, 0];
	
	/*disponibleM
	put --d 
	checkW --d
	undo/redo
	copy --d
	
	move
	minimax
	montecarlo
	heuristic
	*/
}

function GameState() {

	this.board = [new Box(), new Box(), new Box(), new Box(), new Box(), new Box(), new Box(), new Box(), new Box()];
	this.winner = 3;
	this.row = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	this.col = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	this.dp = [0, 0, 0];
	this.ds = [0, 0, 0];
	this.stack = [];
	this.boardNumber = [0, 0, 0];
	this.currentPlayer = 1;
	this.currentBoard = -1;

}

function disponibleMoves(gs){
	var result = [];
	if ( -1 === gs.currentBoard ) {
		for ( var i = 0; i < 9; ++i ) {
			if ( 3 === gs.board[i].winner ) {
				for ( var j = 0; j < 9; ++j ) {
					if ( 3 === gs.board[i].cells[j] ) {
						result.push(i + '' + j);
					}
				}
			}
		}
	} else {
		for ( var i = 0; i < 9; ++i ) {
			if ( 3 === gs.board[gs.currentBoard].cells[i] ) {
				result.push(gs.currentBoard + '' + i);
			}
		}
	}
	return result;
}

function undo(gs) {
	
	if ( 1 <= gs.stack.length ) {
		var toUndo = gs.stack.pop();
		var box = Math.floor(toUndo / 10);
		var cell = toUndo % 10;
		var player = (0 === gs.currentPlayer) ? 1 : 0;

		// daca mutarea a fost pe diagonala
		if ( 0 === cell % 2 ) {
			if ( 4 === cell ) {
				gs.board[box].dp[player]--;
				gs.board[box].ds[player]--;
			} else if ( 0 === cell % 4 ) {
				gs.board[box].dp[player]--;
			} else {
				gs.board[box].ds[player]--;
			}
		}

		gs.board[box].cellNumber[player]--;
		gs.board[box].col[cell % 3][player]--;
		gs.board[box].row[Math.floor(cell / 3)][player]--;

		gs.board[box].cells[cell] = 3;

		var boxWinner = gs.board[box].winner;
		if ( 3 !== boxWinner ) {
			gs.boardNumber[boxWinner]--;
			// Daca mutarea a fost pe diagonala
			if (0 === box % 2) {
				if (4 === box) {
					gs.dp[boxWinner]--;
					gs.ds[boxWinner]--;
				} else if (0 === box % 4){
					gs.dp[boxWinner]--;
				} else {
					gs.ds[boxWinner]--;
				}
			}
			// Daca mutarea a fost pe coloane / linii
			gs.col[box % 3][boxWinner]--;
			gs.row[Math.floor(box / 3)][boxWinner]--;
			gs.winner = 3;
		}
		gs.board[box].winner = 3;
		gs.currentPlayer = player;

		if ( 1 <= gs.stack.length ) {
			var tmp = gs.stack[gs.stack.length - 1];
			if ( 3 !== gs.board[tmp % 10].winner ){
				gs.currentBoard = -1;
			} else {
				gs.currentBoard = tmp % 10;
			}
		} else {
			gs.currentBoard = -1;
		}

		return toUndo;
	}
	return null;
}

function undoPair(gs) {
	return [undo(gs), undo(gs)];
}

function putInGameState(pos, gs) {
	var box = Math.floor(pos / 10);
	var cell = pos % 10;

	gs.stack.push(pos);
	putInBox(cell, gs.board[box], gs.currentPlayer);

	var boxWinner = gs.board[box].winner;

	// actualizare player
	gs.currentPlayer = (gs.currentPlayer == 1) ? 0 : 1;
	// actualizare board
	if(3 !== gs.board[cell].winner){
		gs.currentBoard = -1;
	} else {
		gs.currentBoard = cell;
	}

	// Cancel if box is free
	if (3 === boxWinner) {
		return;
	}
	

	gs.boardNumber[boxWinner]++; // increment number of boxes won by player

	// Daca mutarea e pe diagonala
	if (0 === box % 2) {
		if (4 === box) {
			gs.dp[boxWinner]++;
			gs.ds[boxWinner]++;
		} else if (0 === box % 4){
			gs.dp[boxWinner]++;
		} else {
			gs.ds[boxWinner]++;
		}

		if(2 !== boxWinner && (3 === gs.dp[boxWinner] || 3 === gs.ds[boxWinner])){
			gs.winner = boxWinner;
			return;
		}
	}

	// Daca mutarea e pe coloane / linii
	if (2 !== boxWinner) {
		if (3 === ++gs.col[box % 3][boxWinner]) {
			gs.winner = boxWinner;
			return;
		}
		if (3 === ++gs.row[Math.floor(box / 3)][boxWinner]) {
			gs.winner = boxWinner;
			return;
		}
	}

	if(9 === gs.boardNumber[0] + gs.boardNumber[1] + gs.boardNumber[2]){
		gs.winner = 2;
		return;
	}

}


function putInBox(pos, box, player) {
	box.cells[pos] = player;					// PARSE TO INT
	box.cellNumber[player]++;

	// daca mutarea e pe diagonala
	if (0 === pos % 2) {
		if (4 === pos) {
			box.dp[player]++;
			box.ds[player]++;
		} else if (0 === pos % 4) {
			box.dp[player]++;
		} else {
			box.ds[player]++;
		}

		if(3 === box.dp[player] || 3 === box.ds[player]){
			box.winner = player;
			return;
		}
	}

	// daca mutarea e pe linii / coloane
	if (3 === ++box.col[pos % 3][player]) {
		box.winner = player;
		return;
	}
	if (3 === ++box.row[Math.floor(pos / 3)][player]) {
		box.winner = player;
		return;
	}
	if (9 === box.cellNumber[0] + box.cellNumber[1]) {
		box.winner = 2;
		return;
	}
}



function copyGameState(dest, src) {
	dest.winner = src.winner;
	dest.currentBoard = src.currentBoard;
	dest.currentPlayer = src.currentPlayer;
	for ( var i = 0; i < src.stack.length; ++i ) {
		dest.stack.push(src.stack[i]);
	}
	for ( var i = 0; i < 3; ++i ) {
		dest.boardNumber[i] = src.boardNumber[i];
		dest.dp[i] = src.dp[i];
		dest.ds[i] = src.ds[i];
		for ( var j = 0; j < 3; ++j ) {
			dest.row[i][j] = src.row[i][j];
			dest.col[i][j] = src.col[i][j];
		}
	}
	for ( var i = 0; i < 9; ++i ) {
		dest.board[i].winner = src.board[i].winner;
		for ( var j = 0; j < 9; ++j ) {
			dest.board[i].cells[j] = src.board[i].cells[j];
		}
		for ( var j = 0; j < 2; ++j ) {
			dest.board[i].dp[j] = src.board[i].dp[j];
			dest.board[i].ds[j] = src.board[i].ds[j];
			dest.board[i].cellNumber[j] = src.board[i].cellNumber[j];
		}
		for ( var j = 0; j < 3; ++j ) {
			for ( var k = 0; k < 2; ++k ) {
				dest.board[i].row[j][k] = src.board[i].row[j][k];
				dest.board[i].col[j][k] = src.board[i].col[j][k];
			}
		}
	}
}


function clone(obj) {
	var r = {};

	// number / string / boolean / null / undefined ?
	if (obj === null || obj === 'undefined' || typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean') {
		r = obj;
		return r;
	}

	// array ?
	if (obj.constructor === Array) {
		r = [];

		for(let element of obj){
			r.push(clone(element));
		}

		return r;
	}

	// object ?
	if (typeof obj === 'object') {
		for (let key in obj) {
			r[key] = clone(obj[key]);
		}

		return r;
	}

	// function ?
	if (typeof obj === 'function') {
		r = obj;

		return r;
	}


	return undefined;
}



var a = new GameState();

function cloneTest() {
	var now = Date.now();
	for(let i = 0; i < 100000; ++i) {
		var ags = new GameState();
		copyGameState(ags, a);
	}
	console.log(Date.now() - now);

	var now = Date.now();
	for(let i = 0; i < 100000; ++i) {
		var ags = clone(a);
	}
	console.log(Date.now() - now);

}



 
