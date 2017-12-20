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
        
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(landPoints[i][0].x, landPoints[i][0].y);

        for (j = 1; j < landPoints[i].length - landPoints[i][j + Math.max(Math.round(8 / zoomLevel), 1) - 1; j += Math.max(Math.round(8 / zoomLevel), 1)) {
            if (landPoints[i][j].x < 0 - 500 * zoomLevel || landPoints[i][j].x > display.width + 500 * zoomLevel) continue;
            if (landPoints[i][j].y < 0 - 500 * zoomLevel || landPoints[i][j].y > display.height + 500 * zoomLevel) continue;
            
            var xc = (landPoints[i][j].x + landPoints[i][j + Math.max(Math.round(8 / zoomLevel), 1)].x) / 2;
            var yc = (landPoints[i][j].y + landPoints[i][j + Math.max(Math.round(8 / zoomLevel), 1)].y) / 2;
            ctx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, xc, yc);
        }

        ctx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, landPoints[i][landPoints[i].length - 1].x, landPoints[i][landPoints[i].length - 1].y);

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.lineWidth = 3;
    for (let id in property) {
        ctx.beginPath();
        ctx.moveTo(property[id].x, property[id].y);
        for (let point of property[id]) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
    }
}

socket.on('initValues', function(data) {
    landPoints = data.landPoints;
    property = data.property;
    continents = data.continents;
    players = data.players;
});

socket.on('id', function(uID) {
    if (userID === null) userID = uID;
});

setInterval(main, 1000 / 100);
