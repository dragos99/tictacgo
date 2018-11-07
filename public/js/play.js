// initialize game demo
var gamePreview = new GamePreview('demo');
gamePreview.init();

window.addEventListener('resize', onResize);

onResize();

function onResize(){
	var width = window.innerWidth - 280;
	var height = window.innerHeight;

	var val = width < height ? width : height;

	document.querySelector('.game-container').style.width = val + 'px';
	document.querySelector('.game-container').style.height = val + 'px';

}