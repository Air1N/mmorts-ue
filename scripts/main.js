function main() {
	update();
	render();
}

function update() {

}

function render() {
	ctx.clearRect(0, 0, display.width, display.height);
	
	for (let i = 0; i < landPoints.length; i++) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(landPoints[i][0].x, landPoints[i][0].y);
		for (let point of landPoints[i]) {
			ctx.lineTo(point.x, point.y);
		}
		ctx.closePath();
		ctx.stroke();
	
		ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.moveTo(landPoints[i][0].x, landPoints[i][0].y);
		for (let point of landPoints[i]) {
			ctx.lineTo(point.x, point.y);
		}
		ctx.closePath();
		ctx.fill();
	}
	
	ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
	ctx.lineWidth = 3;
	for (let i = 0; i < property.length; i++) {
		ctx.beginPath();
		ctx.moveTo(property[i][0].x, property[i][0].y);
		for (let point of property[i]) {
			ctx.lineTo(point.x, point.y);
		}
		ctx.closePath();
		ctx.fill();
	}
}

setInterval(main, 1000 / 100);