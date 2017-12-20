const display = document.getElementById("canvas");
const ctx = display.getContext("2d");

const mtx = map.getContext("2d");

var socket = io();

let landPoints = [];
let continents = 10;

let mouseDown = false;

let lmx = 0;
let lmy = 0;

let cropx = 0;
let cropy = 0;

let cropsize = 1;

let userID = null;

let landComplexity = 10000;

let property = [];

let players = 200;

const landSize = 1;

window.onmousedown = function(e) {
	mouseDown = true;
};

window.onmouseup = function(e) {
	mouseDown = false;
};

window.onmousemove = function(e) {
	mousex = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
	mousey = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);

	if (mouseDown) {
		cropx -= mousex - lmx;
		cropy -= mousey - lmy;
	}

	lmx = mousex;
	lmy = mousey;
};

window.onmousewheel = function(e) {
	delta = e.wheelDelta / 60;
	mousex = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
	mousey = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);

	if (delta > 0) {
		cropsize *= delta;

		cropx -= mousex;
		cropy -= mousey;
	} else {
		cropsize /= Math.abs(delta);
		
		cropx += mousex / Math.abs(delta);
		cropy += mousey / Math.abs(delta);
	}
};
