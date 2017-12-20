function main() {
    update();
    render();
}

function update() {

}

function render() {
    ctx.clearRect(0, 0, display.width, display.height);
}

function drawMap() {
    for (let i = 0; i < landPoints.length; i++) {
        mtx.strokeStyle = "black";
        mtx.lineWidth = 2;
        mtx.lineJoin = "round";
        mtx.lineCap = "round";
        
        mtx.fillStyle = "green";
        mtx.beginPath();
        mtx.moveTo(landPoints[i][0].x, landPoints[i][0].y);

        for (j = 1; j < landPoints[i].length - 2; j++) {
            var xc = (landPoints[i][j].x + landPoints[i][j + 1].x) / 2;
            var yc = (landPoints[i][j].y + landPoints[i][j + 1].y) / 2;
            mtx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, xc, yc);
        }

        mtx.quadraticCurveTo(landPoints[i][j].x, landPoints[i][j].y, landPoints[i][j + 1].x, landPoints[i][j + 1].y);

        mtx.closePath();
        mtx.stroke();
        mtx.fill();
    }

    mtx.fillStyle = "rgba(255, 0, 0, 0.3)";
    mtx.lineWidth = 3;
    for (let id in property) {
        mtx.beginPath();
        mtx.moveTo(property[id].x, property[id].y);
        for (let point of property[id]) {
            mtx.lineTo(point.x, point.y);
        }
        mtx.closePath();
        mtx.fill();
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
drawMap();
