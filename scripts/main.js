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

        for (j = 1; j < landPoints[i].length - 2; j += Math.round(5 / zoomLevel)) {
            //if (landPoints[i][j].x < 0 || landPoints[i][j].x > display.width) continue;
            //if (landPoints[i][j].y < 0 || landPoints[i][j].y > display.height) continue;
            
            var xc = (landPoints[i][j].x + landPoints[i][j + 1].x) / 2;
            var yc = (landPoints[i][j].y + landPoints[i][j + 1].y) / 2;
            ctx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, xc, yc);
        }

        ctx.quadraticCurveTo(landPoints[i][landPoints[i].length - 2].x, landPoints[i][landPoints[i].length - 2].y, landPoints[i][landPoints[i].length - 1].x, landPoints[i][landPoints[i].length - 1].y);

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
