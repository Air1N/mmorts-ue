const display = document.getElementById("canvas");
const ctx = display.getContext("2d");

let landPoints = [];

let property = [
	[]
];

let continents = 10;
let players = 200;

for (let i = 0; i < continents; i++) {
	landPoints.push([{
		x: Math.random() * 200000 - 100000,
		y: Math.random() * 200000 - 100000
	}]);
}

let landComplexity = 10000;

let roundPoints = [];

let mouseDown = false;

let lmx = 0;
let lmy = 0;

const landSize = 10;

function generateLand(k, f) {
	let randomx = landSize * Math.round(Math.random() * 4 - 2);
	let randomy = landSize * Math.round(Math.random() * 4 - 2);

	let currentx = landPoints[k][landPoints[k].length - 1].x;
	let currenty = landPoints[k][landPoints[k].length - 1].y;

	let biasx = 0;
	let biasy = 0;

	if (f >= landComplexity - landComplexity / 10) {
		biasx = Math.round((landPoints[k][0].x - currentx) / (landComplexity - f + 50)) * landSize;
		biasy = Math.round((landPoints[k][0].y - currenty) / (landComplexity - f + 50)) * landSize;
	} else {
		for (let i = 0; i < landPoints[k].length; i++) {
			if (landPoints[k][i].x == currentx + randomx && landPoints[k][i].y == currenty + randomy) {
				return;
			}
		}
	}

	landPoints[k].push({
		x: currentx + randomx + biasx,
		y: currenty + randomy + biasy
	});
}

for (let k = 0; k < continents; k++) {
	for (let x = 0; x < landComplexity; x++) {
		generateLand(k, x);
	}
}

function generateProperty(k) {
	property[k] = [];
	let continent = Math.floor(Math.random() * continents);
	let random = Math.floor(Math.random() * landPoints[continent].length);

	let randompoint = landPoints[continent][random];
	property[k].push({
		x: randompoint.x,
		y: randompoint.y
	});

	for (let j = 0; j < 20; j++) {
		let randomx = landSize * Math.round(Math.random() * 4 - 2);
		let randomy = landSize * Math.round(Math.random() * 4 - 2);

		let currentx = property[k][property[k].length - 1].x;
		let currenty = property[k][property[k].length - 1].y;
		
		for (let i = 0; i < property[k].length; i++) {
			if (property[k][i].x == currentx + randomx && property[k][i].y == currenty + randomy) {
				return;
			}
		}
		
		property[k].push({
			x: currentx + randomx,
			y: currenty + randomy
		});
	}
}

for (let k = 0; k < players; k++) {
	generateProperty(k);
}

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
		
		for (let i = 0; i < property.length; i++) {
			for (let point of property[i]) {
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

	if (delta > 0) {
		for (let i = 0; i < landPoints.length; i++) {
			for (let point of landPoints[i]) {
				point.x *= delta;
				point.y *= delta;

				point.x -= mousex;
				point.y -= mousey;
			}
		}
		
		for (let i = 0; i < property.length; i++) {
			for (let point of property[i]) {
				point.x *= delta;
				point.y *= delta;
				
				point.x -= mousex;
				point.y -= mousey;
			}
		}
	} else {
		for (let i = 0; i < landPoints.length; i++) {
			for (let point of landPoints[i]) {
				point.x /= Math.abs(delta);
				point.y /= Math.abs(delta);
		
				point.x += mousex / Math.abs(delta);
				point.y += mousey / Math.abs(delta);
			}
		}
		
		for (let i = 0; i < property.length; i++) {
			for (let point of property[i]) {
				point.x /= Math.abs(delta);
				point.y /= Math.abs(delta);
		
				point.x += mousex / Math.abs(delta);
				point.y += mousey / Math.abs(delta);
			}
		}
	}
};