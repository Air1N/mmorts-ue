const display = document.getElementById("canvas");
const ctx = display.getContext("2d");

var socket = io();

let landPoints = [];
let continents = 10;

let mouseDown = false;

let lmx = 0;
let lmy = 0;

let userID = null;

let landComplexity = 1;

let property = [];

let players = 200;

let zoomLevel = 1;

let zoomLayers = 1;

const landSize = 0.005;

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
		for (let i = 0; i < landPoints.length; i++) {
			for (let point of landPoints[i]) {
				point.x += mousex - lmx;
				point.y += mousey - lmy;
			}
		}
		
		for (let id in property) {
			for (let point of property[id]) {
				point.x += mousex - lmx;
				point.y += mousey - lmy;
			}
		}
	}

	lmx = mousex;
	lmy = mousey;
};

window.onmousewheel = function(e) {
	delta = e.wheelDelta / 60;
	mousex = (e.clientX - display.getBoundingClientRect().left) * (display.width / display.clientWidth);
	mousey = (e.clientY - display.getBoundingClientRect().top) * (display.height / display.clientHeight);

	if (delta > 0 && zoomLevel < Infinity) {
		zoomLevel *= delta;
		
		for (let i = 0; i < landPoints.length; i++) {
			for (let point of landPoints[i]) {
				point.x *= delta;
				point.y *= delta;
				

				point.x -= mousex;
				point.y -= mousey;
			}
		}
		
		for (let id in property) {
			for (let point of property[id]) {
				point.x *= delta;
				point.y *= delta;
				
				point.x -= mousex;
				point.y -= mousey;
			}
		}
	}
	
	if (delta < 0 && zoomLevel > 0) {
		zoomLevel /= Math.abs(delta);
		
		for (let i = 0; i < landPoints.length; i++) {
			for (let point of landPoints[i]) {
				point.x /= Math.abs(delta);
				point.y /= Math.abs(delta);
				
				
				point.x += mousex / Math.abs(delta);
				point.y += mousey / Math.abs(delta);
			}
		}
		
		for (let id in property) {
			for (let point of property[id]) {
				point.x /= Math.abs(delta);
				point.y /= Math.abs(delta);
		
				point.x += mousex / Math.abs(delta);
				point.y += mousey / Math.abs(delta);
			}
		}
	}
};
