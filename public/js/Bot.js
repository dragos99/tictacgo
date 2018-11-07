function Bot(maxDepth){

	this.ready = false;
	this.maxDepth = maxDepth;
	this.INF = 99999999;
	this.powers = [1, 3, 9, 27, 81, 243, 729, 2187, 6561];
	this.wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

	var normalM = ['00', '01', '02', '10', '11', '12', '20', '21', '22', '03', '04', '05', '13', '14', '15', '23', '24', '25', '06', '07', '08', '16', '17', '18', '26', '27', '28', '30', '31', '32', '40', '41', '42', '50', '51', '52', '33', '34', '35', '43', '44', '45', '53', '54', '55', '36', '37', '38', '46', '47', '48', '56', '57', '58', '60', '61', '62', '70', '71', '72', '80', '81', '82', '63', '64', '65', '73', '74', '75', '83', '84', '85', '66', '67', '68', '76', '77', '78', '86', '87', '88'];
	var r1 = ['66', '63', '60', '36', '33', '30', '06', '03', '00', '67', '64', '61', '37', '34', '31', '07', '04', '01', '68', '65', '62', '38', '35', '32', '08', '05', '02', '76', '73', '70', '46', '43', '40', '16', '13', '10', '77', '74', '71', '47', '44', '41', '17', '14', '11', '78', '75', '72', '48', '45', '42', '18', '15', '12', '86', '83', '80', '56', '53', '50', '26', '23', '20', '87', '84', '81', '57', '54', '51', '27', '24', '21', '88', '85', '82', '58', '55', '52', '28', '25', '22'];
	var r2 = ['88', '87', '86', '78', '77', '76', '68', '67', '66', '85', '84', '83', '75', '74', '73', '65', '64', '63', '82', '81', '80', '72', '71', '70', '62', '61', '60', '58', '57', '56', '48', '47', '46', '38', '37', '36', '55', '54', '53', '45', '44', '43', '35', '34', '33', '52', '51', '50', '42', '41', '40', '32', '31', '30', '28', '27', '26', '18', '17', '16', '08', '07', '06', '25', '24', '23', '15', '14', '13', '05', '04', '03', '22', '21', '20', '12', '11', '10', '02', '01', '00'];
	var r3 = ['22', '25', '28', '52', '55', '58', '82', '85', '88', '21', '24', '27', '51', '54', '57', '81', '84', '87', '20', '23', '26', '50', '53', '56', '80', '83', '86', '12', '15', '18', '42', '45', '48', '72', '75', '78', '11', '14', '17', '41', '44', '47', '71', '74', '77', '10', '13', '16', '40', '43', '46', '70', '73', '76', '02', '05', '08', '32', '35', '38', '62', '65', '68', '01', '04', '07', '31', '34', '37', '61', '64', '67', '00', '03', '06', '30', '33', '36', '60', '63', '66'];
	var dp = ['00', '03', '06', '30', '33', '36', '60', '63', '66', '01', '04', '07', '31', '34', '37', '61', '64', '67', '02', '05', '08', '32', '35', '38', '62', '65', '68', '10', '13', '16', '40', '43', '46', '70', '73', '76', '11', '14', '17', '41', '44', '47', '71', '74', '77', '12', '15', '18', '42', '45', '48', '72', '75', '78', '20', '23', '26', '50', '53', '56', '80', '83', '86', '21', '24', '27', '51', '54', '57', '81', '84', '87', '22', '25', '28', '52', '55', '58', '82', '85', '88'];
	var ds = ['88', '85', '82', '58', '55', '52', '28', '25', '22', '87', '84', '81', '57', '54', '51', '27', '24', '21', '86', '83', '80', '56', '53', '50', '26', '23', '20', '78', '75', '72', '48', '45', '42', '18', '15', '12', '77', '74', '71', '47', '44', '41', '17', '14', '11', '76', '73', '70', '46', '43', '40', '16', '13', '10', '68', '65', '62', '38', '35', '32', '08', '05', '02', '67', '64', '61', '37', '34', '31', '07', '04', '01', '66', '63', '60', '36', '33', '30', '06', '03', '00'];
	var v = ['22', '21', '20', '12', '11', '10', '02', '01', '00', '25', '24', '23', '15', '14', '13', '05', '04', '03', '28', '27', '26', '18', '17', '16', '08', '07', '06', '52', '51', '50', '42', '41', '40', '32', '31', '30', '55', '54', '53', '45', '44', '43', '35', '34', '33', '58', '57', '56', '48', '47', '46', '38', '37', '36', '82', '81', '80', '72', '71', '70', '62', '61', '60', '85', '84', '83', '75', '74', '73', '65', '64', '63', '88', '87', '86', '78', '77', '76', '68', '67', '66'];
	var h = ['66', '67', '68', '76', '77', '78', '86', '87', '88', '63', '64', '65', '73', '74', '75', '83', '84', '85', '60', '61', '62', '70', '71', '72', '80', '81', '82', '36', '37', '38', '46', '47', '48', '56', '57', '58', '33', '34', '35', '43', '44', '45', '53', '54', '55', '30', '31', '32', '40', '41', '42', '50', '51', '52', '06', '07', '08', '16', '17', '18', '26', '27', '28', '03', '04', '05', '13', '14', '15', '23', '24', '25', '00', '01', '02', '10', '11', '12', '20', '21', '22'];

	var _this = this;


	ajax.get('/heuristic', undefined, function(data) {
		_this.heuristic = data;
		_this.ready = true;
	});

	function randomize(move, gs) {
		var moves = disponibleMoves(gs);
		var choose = [move];
		var temp;
		var index = normalM.indexOf(move);

		temp = moves.indexOf(r1[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(r2[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(r3[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(dp[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(ds[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(v[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}

		temp = moves.indexOf(h[index]);
		if ( temp !== -1 && choose.indexOf(moves[temp]) === -1 ) {
			choose.push(moves[temp]);
		}		

		console.log(move, choose);

		return choose[Math.floor(Math.random() * choose.length)];
	}

	this.takeMove = function(diff, gs, player) {
		// check if ready
		if (this.ready === false) {
	        console.log('bot not ready');
	        return 'notReady';
	    }

		if ( '2' === diff ) {
			var tmp;
			if ( Math.floor(Math.random() * 8) <= 2 ) {
				console.log('MUT RANDOM SI TOT TE BAT :))');
				var moves = disponibleMoves(gs);
				tmp = moves[Math.floor(Math.random() * moves.length)];
			} else {
				this.maxDepth = 2;
				tmp = this.minMax(gs, 2, -this.INF, this.INF, player);
			}
		} else {
			tmp = this.minMax(gs, this.maxDepth, -this.INF, this.INF, player);
		}
		return randomize(tmp, gs);
	}

	this.minMax = function(gs, depth, alpha, beta, player) {
		
		var enemy = (1 == player) ? 0 : 1;

		if ( 3 != gs.winner ) {
			if ( player == gs.winner ) {
				return this.INF;
			}
			if ( enemy == gs.winner ) {
				return -this.INF;
			}
			return 0;
		}

		var val;
		var my_win = [0,0,0,0,0,0,0,0,0];
		var enemy_win = [0,0,0,0,0,0,0,0,0];

		if ( 0 === depth ) {

			for ( var i = 0; i < 9; ++i ) {
				val = 0;
				for ( var j = 0; j < 9; ++j ) {
					if ( 3 === gs.board[i].cells[j] ) {
						val += 2 * this.powers[j];
					} else {
						val += gs.board[i].cells[j] * this.powers[j];
					}
				}
				
				my_win[i] = this.heuristic[val][player];
				enemy_win[i] = this.heuristic[val][enemy];

			}

			val = 0;
			for ( var i = 0; i < 8; ++i ) {
				val += Math.round(my_win[this.wins[i][0]] * my_win[this.wins[i][1]] * my_win[this.wins[i][2]]);
				val -= Math.round(enemy_win[this.wins[i][0]] * enemy_win[this.wins[i][1]] * enemy_win[this.wins[i][2]]);
			}

			return val;
		}

		var ags = new GameState(), aux, pos=0;

		var moves = disponibleMoves(gs);

		if ( gs.currentPlayer == player ) {
			val = -this.INF;
			for ( var i = 0; i < moves.length; ++i ) {
				copyGameState(ags, gs);
				//ags = clone(gs);
				putInGameState(moves[i], ags);
				aux = this.minMax(ags, depth - 1, alpha, beta, player);
				if ( aux > val ) {
					val = aux;
					pos = i;
				}
				if ( val > alpha ) {
					alpha = val;
				}
				if ( alpha >= beta ) {
					break;
				}
			}

		} else {
			val = this.INF;
			for ( var i = 0; i < moves.length; ++i ) {
				copyGameState(ags, gs);
				//ags = clone(gs);
				putInGameState(moves[i], ags);
				aux = this.minMax(ags, depth - 1, alpha, beta, player);
				if ( aux < val ) {
					val = aux;
					pos = i;
				}
				if ( val < beta ) {
					beta = val;
				}
				if ( alpha >= beta ) {
					break;
				}
			}
			return val;
		}

		if ( depth === this.maxDepth ) {
			return moves[pos];
		}
		
		return val;
	}
}
