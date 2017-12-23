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

let clientID = 0;

let landComplexity = 1;

let landPoints = [];

let property = {};

let idList = [];

let continents = 1;
let players = 200;

let initialSize = 100;

io.on('connection', function(socket) {
    userID = socket.handshake.address;
    userID = userID.replace(/::ffff:/gi, "").replace(/\./gi, "");
    
    console.log('ID: ' + userID + ' connected.');
    
    if (idList.indexOf(userID) == -1) {
        generateProperty(userID);
        idList.push(userID);
    }

    io.emit('initValues', {
        landPoints: landPoints,
        property: property,
        continents: continents,
        landSize: landSize,
        players: players
    });
    
    io.emit('id', userID);
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

    if (f >= landComplexity * initialSize - landComplexity * initialSize / 10) {
        biasx = (landPoints[k][0].x - currentx) / (landComplexity * initialSize - f);
        biasy = (landPoints[k][0].y - currenty) / (landComplexity * initialSize - f);
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

function enhanceLand(k) {
    for (let j = 1; j < Math.pow(2, 10); j *= 2) {
    for (let i = 0; i < landPoints[k].length - 1; i += 1 + j) {
        
        for (let v = 0; v < j; v++) {
            landPoints[k].splice(i + 1 + v, 0, {
                x: landPoints[k][i].x + ((landPoints[k][i + 1 + v].x - landPoints[k][i].x) / (j + 1)) * (v + 1) + (Math.random() * 2 - 1) * landSize / j / 4, 
                y: landPoints[k][i].y + ((landPoints[k][i + 1 + v].y - landPoints[k][i].y) / (j + 1)) * (v + 1) + (Math.random() * 2 - 1) * landSize / j / 4
            });
        }
    }
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


for (let i = 0; i < continents; i++) {
    landPoints.push([{
        x: 1920 / 2,
        y: 1080 / 2
    }]);
}

const landSize = 1;

for (let mm = 0; mm < continents; mm++) {
    for (let j = 0; j < landComplexity * initialSize; j++) {
        generateLand(mm, j);
    }
    
    enhanceLand(mm);
}
