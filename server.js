var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

let userID = 0;

let landComplexity = 10000;

let landPoints = [];

let property = [];

let continents = 10;
let players = 200;

for (let i = 0; i < continents; i++) {
    landPoints.push([{
        x: Math.random() * 200000 - 100000,
        y: Math.random() * 200000 - 100000
    }]);
}

const landSize = 10;

for (let i = 0; i < continents; i++) {
    for (let j = 0; j < landComplexity; j++) {
        generateLand(i, j);
    }
}

io.on('connection', function(socket) {
    userID = socket.handshake.address;
    
    userID = userID.replace(/::ffff:/gi, "").replace(/\./gi, "");
    
    console.log('ID: ' + userID + ' connected.');

    generateProperty(userID);

    io.emit('updateValues', {
        landPoints: landPoints,
        property: property,
        continents: continents,
        landSize: landSize,
        players: players
    });

    /*setInterval(io.emit, 1000 / 3, 'updateValues', {
        landPoints: landPoints,
        property: property,
        continents: continents,
        landSize: landSize,
        players: players
    });*/
});

http.listen(port, function() {
    console.log('listening on *:' + (port).toString());
});

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