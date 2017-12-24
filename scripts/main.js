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
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        
        ctx.beginPath();
        ctx.moveTo(landPoints[i][0].x, landPoints[i][0].y);
        
        for (j = 1; j < landPoints[i].length - Math.max(Math.round(zoomLayers / zoomLevel), 1) - 1; j += Math.max(Math.round(zoomLayers / zoomLevel), 1)) {
            /*if (landPoints[i][j].x < 0 - 150 * zoomLevel || landPoints[i][j].x > display.width + 150 * zoomLevel) {
                continue;
            }
            
            if (landPoints[i][j].y < 0 - 250 * zoomLevel || landPoints[i][j].y > display.height + 250 * zoomLevel) {
                continue;
            }*/
            
            var xc = (landPoints[i][j].x + landPoints[i][j + Math.max(Math.round(zoomLayers / zoomLevel), 1)].x) / 2;
            var yc = (landPoints[i][j].y + landPoints[i][j + Math.max(Math.round(zoomLayers / zoomLevel), 1)].y) / 2;
            ctx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, xc, yc);
        }

        ctx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, landPoints[i][landPoints[i].length - 1].x, landPoints[i][landPoints[i].length - 1].y);
        ctx.fillStyle = "green";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.lineWidth = 3;
    for (let id in property) {
        ctx.beginPath();
        ctx.moveTo(property[id][0].x, property[id][0].y);
        for (let point of property[id]) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = "rgba(255, 0, 0, 1)";
        ctx.fillRect(property[id][0].x - 5, property[id][0].y - 5, 10, 10);
    }
}

socket.on('initValues', function(data) {
    landPoints = JSON.parse(data.landPoints);
    property = data.property;
    continents = data.continents;
    players = data.players;
    
    for (let point of landPoints[0]) {
	point.x -= 1920;
	point.y -= 1080;
	
        point.x *= 5000;
	point.y *= 5000;
	    
	point.x += 1920;
	point.y += 1080;
    }
});

socket.on('id', function(uID) {
    if (userID === null) userID = uID;
});

setInterval(main, 1000 / 100);
