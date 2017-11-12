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
        
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(landPoints[i][0].x + 1, landPoints[i][0].y + 1);

        for (let j = 1; j < landPoints[i].length - 3; j += 2) {
            ctx.bezierCurveTo(landPoints[i][j].x + 1, landPoints[i][j].y + 1, landPoints[i][j + 1].x + 1, landPoints[i][j + 1].y + 1, landPoints[i][j + 2].x + 1, landPoints[i][j + 2].y + 1, landPoints[i][j + 3].x + 1, landPoints[i][j + 3].y + 1);
        }

        ctx.closePath();
        ctx.fill();
    
        ctx.beginPath();
        ctx.moveTo(landPoints[i][0].x - 1, landPoints[i][0].y - 1);
        
        for (let j = 1; j < landPoints[i].length - 3; j += 2) {
            ctx.bezierCurveTo(landPoints[i][j].x - 1, landPoints[i][j].y - 1, landPoints[i][j + 1].x - 1, landPoints[i][j + 1].y - 1, landPoints[i][j + 2].x - 1, landPoints[i][j + 2].y - 1, landPoints[i][j + 3].x - 1, landPoints[i][j + 3].y - 1);
        }

        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(landPoints[i][0].x, landPoints[i][0].y);
        
        for (let j = 1; j < landPoints[i].length - 3; j += 2) {
            ctx.bezierCurveTo(landPoints[i][j].x, landPoints[i][j].y, landPoints[i][j + 1].x, landPoints[i][j + 1].y, landPoints[i][j + 2].x, landPoints[i][j + 2].y, landPoints[i][j + 3].x, landPoints[i][j + 3].y);
        }
        
        
        ctx.closePath();
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
