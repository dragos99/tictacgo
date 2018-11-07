'use strict';



var audio = new function() {
	this.music = true;
	this.sound = true;
	this.click = new Audio('./img/click.mp3');
	this.sounds = [
		new Audio('./img/o.mp3'),
		new Audio('./img/x.mp3')
	];
	this.chill = new Audio('./img/chill.mp3');
	this.chill.volume = 0.2;
	this.chill.loop = true;


	this.toggleMusic = function() {
		if(this.music === true) {
			this.music = false;
			this.chill.pause();
		} else {
			this.music = true;
			if(game) this.chill.play();
		}
	}

	this.toggleSound = function() {
		if(this.sound === true) {
			this.sound = false;
		} else {
			this.sound = true;
		}
	}

	this.clickSound = function() {
		if(this.sound === true)
			this.click.play();
	}

	this.playMusic = function() {
		if(this.music === true){
			this.chill.play();
		}
	}

	this.pauseMusic = function() {
		this.chill.pause();
	}

	this.gameSound = function(n) {
		if(this.sound === true)
			this.sounds[n].play();
	}
}







/**
 *
 * Page
 *
 */

// initialize game demo
var gamePreview = new GamePreview('demo', '.game-preview');
var learnPage = document.querySelector('.learn-page');
var playPage = document.querySelector('.play-page');
gamePreview.init();

// initialize page navigation
var nav = new TabView('body', 0, 'body', function(){
	// toggle overflow on learn page
	if(this.activeTab === '2') {
		learnPage.style.overflow = 'auto';
	} else {
		learnPage.style.overflow = 'hidden';
	}

	// animate playPage on first visit
	if(this.playPage === false && this.activeTab === '1'){
		var elements = playPage.querySelectorAll('*[class*="fade-in-"]');

		for(var i = 0; i < elements.length; ++i){
			elements[i].classList.remove('fade-in-left');
			elements[i].classList.add('fade-in-left-' + i);
		}

		this.playPage = true;
	}

	// play/pause gamePreview
	if(this.activeTab === '0') {
		if(gamePreview.paused === true) {
			gamePreview.play();
		}
	} else {
		gamePreview.pause();
	}

	// show/hide game actions
	if(this.activeTab === '1') {
		if(game) 
			gameActions.style.display = 'block';
	} else {
		gameActions.style.display = 'none';
	}
});

nav.playPage = false;
nav.init();

var header = document.querySelector('.header');
function openMenu(btn) {
    btn.classList.toggle('change');
    header.classList.toggle('full');
}


/**
 *
 * Game container
 *
 */
window.addEventListener('resize', onResize);
var gameContainer = document.querySelector('.game-container');

function onResize(){
	var width = window.innerWidth;
	var height = window.innerHeight - 50;

	var val = (width < height) ? width : height;

	gameContainer.style.width = val + 'px';
	gameContainer.style.height = val + 'px';
}
onResize();





/**
 *
 * Play
 *
 */
var game;
var gs;
var botik;

var gameActions = document.querySelector('.game-actions');
var gameOptions = document.querySelector('.game-options');
var gameBoard = gameContainer.querySelector('.game-board');
var settingsModal = document.querySelector('.settings-modal');
var gameOver = gameContainer.querySelector('.game-over');
var undoBtn = document.querySelector('.undo-btn');
var changeBtn = document.querySelector('.change-btn');
var settingsBtn = document.querySelector('.settings-btn');

var difficultyBtns = document.querySelectorAll('.game-options > .option-btn');
var orderBtns = document.querySelectorAll('.option-btn-container > .option-btn');
var startBtn = document.querySelector('.start-btn');
var playBand = document.querySelector('.play-band');

// event listener for difficulty buttons
var btn;
for(var i = 0; btn = difficultyBtns[i]; ++i) {
	btn.onclick = function() {
		audio.clickSound();
		for(var i = 0; i < difficultyBtns.length; ++i) {
			difficultyBtns[i].classList.remove('selected');
		}
		this.classList.add('selected');
	}
}

// event listener for who plays first buttons
for(var i = 0; btn = orderBtns[i]; ++i) {
	btn.onclick = function() {
		audio.clickSound();

		for(var i = 0; i < orderBtns.length; ++i) {
			orderBtns[i].classList.remove('selected');
		}
		this.classList.add('selected');
	}
}


/* Game start button event */
startBtn.onclick = function(){
	audio.clickSound();

	// fade-out animation for game-options
	var elements = playPage.querySelectorAll('*[class*="fade-in-"]');
	for(var i = 0; i < elements.length; ++i){
		elements[i].classList.remove('fade-in-left-' + i);
		elements[i].classList.add('fade-out-left-' + i);
	}
	setTimeout(() => {
		gameOptions.style.display = 'none';
	}, 900);
	playBand.classList.add('full-band');


	// get the selected difficulty
	var difficulty;
	for(var i = 0; btn = difficultyBtns[i]; ++i){
		if(btn.classList.contains('selected')){
			difficulty = btn.getAttribute('data-value');
			break;
		}
	}

	// setup the game
	setTimeout(function(){
		game = new Game();
		gs = new GameState();
		botik = new Bot(difficulty);
		game.difficulty = difficulty;

		// setup player's order
		if(orderBtns[0].classList.contains('selected')){
			game.player = 1;
			game.bot = 0;
		} else {
			game.player = 0;
			game.bot = 1;
		}

		// setup game level
		var level;
		if(difficulty == 2){
			level = 'easy';
		} else if(difficulty == 4){
			level = 'medium';
		} else {
			level = 'hard';
		}
		var levelLabel = document.querySelector('.game-actions .level');
		levelLabel.innerHTML = 'Level: ' + level;


		// show the game container
		gameContainer.style.display = 'block';
		gameActions.style.display = 'block';

		game.init();
	}, 1000);
}


/* Change level button event */
changeBtn.onclick = function(){
	audio.clickSound();

	// hide game UI
	gameContainer.style.display = 'none';
	gameActions.style.display = 'none';
	gameOver.style.display = 'none';

	// band animation
	playBand.classList.remove('full-band');
	// navigate to play page
	nav.navigate(1);
	// stop chilling music
	audio.chill.pause();

	// show game options
	gameOptions.style.display = 'block';

	// fade-in game options
	var elements = playPage.querySelectorAll('*[class*="fade-out-"]');
	for(var i = 0; i < elements.length; ++i){
		elements[i].classList.remove('fade-out-left-' + i);
		elements[i].classList.add('fade-in-left-' + i);
	}

	// delete game instances
	game = undefined;
	botik = undefined;
	gs = undefined;
}


/* Undo button event */
undoBtn.onclick = function() {
	game.undo();

	audio.clickSound();
}





/**
 *
 * Settings
 *
 */
var settingsModal = document.querySelector('.settings-modal');
var settingsBtn = document.querySelector('.settings-btn');
var musicBtn = document.querySelector('.music-btn');
var soundBtn = document.querySelector('.sound-btn');
var closeBtn = settingsModal.querySelector('.close-modal');

// event listener for music
musicBtn.onclick = function() {
	audio.toggleMusic();
}
soundBtn.onclick = function() {
	audio.toggleSound();
}

/* Settings button event */
settingsBtn.onclick = function() {
	settingsModal.style.display = 'block';
}

closeBtn.onclick = function() {
	settingsModal.style.display = 'none';
}



















 //=> window onload