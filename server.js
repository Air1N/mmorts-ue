var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;
var fs = require('fs');

var landVersion = 1;
var count = 0;
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

function loadLand() {
    fs.readFile(__dirname + '/assets/landPoints.txt', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }

        landPoints = JSON.parse(data);
    });
}

function saveLand() {
    fs.writeFile(__dirname + '/assets/landPoints.txt', JSON.stringify(landPoints), function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

let userID = 0;

let clientID = 0;

let landComplexity = 1;

let landPoints = [];

let property = {};

let idList = [];

let continents = 1;
let players = 200;

let initialSize = 5;

io.on('connection', function(socket) {
    userID = socket.handshake.address;
    userID = userID.replace(/::ffff:/gi, "").replace(/\./gi, "");

    console.log('ID: ' + userID + ' connected.');

    if (idList.indexOf(userID) == -1) {
        generateProperty(userID);
        idList.push(userID);
    }

    io.emit('initValues', {
        landPoints: "[]",
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
    let randomx = Math.round(landSize * Math.round(Math.random() * 2 - 1) * 100) / 100;
    let randomy = Math.round(landSize * Math.round(Math.random() * 2 - 1) * 100) / 100;

    let currentx = landPoints[k][landPoints[k].length - 1].x;
    let currenty = landPoints[k][landPoints[k].length - 1].y;

    let biasx = 0;
    let biasy = 0;

    for (let i = 0; i < landPoints[k].length; i++) {
        if (landPoints[k][i].x == currentx + randomx && landPoints[k][i].y == currenty + randomy && f < 9) {
            return;
        }
    }

    landPoints[k].push({
        x: currentx + randomx,
        y: currenty + randomy
    });

    if (f == landComplexity * initialSize - 1) {
        landPoints[k].push({
            x: landPoints[k][0].x,
            y: landPoints[k][0].y
        });
    }
}

function enhanceLand(k) {
    for (let i = 0; i < 100; i++) {
        count += 2;
    
        if (count > landPoints[k].length - 2) {
            count = 0;
            console.log('enhance step ' + landVersion);
            landVersion++;
        
            saveLand();
        }
    
        landPoints[k].splice(count + 1, 0, {
            x: Math.round((landPoints[k][count].x + ((landPoints[k][count + 1].x - landPoints[k][count].x) / 2) + Math.round((Math.random() * 2 - 1)) * landSize / Math.pow(2, (landVersion + 1) / 1.3)) * 100) / 100,
            y: Math.round((landPoints[k][count].y + ((landPoints[k][count + 1].y - landPoints[k][count].y) / 2) + Math.round((Math.random() * 2 - 1)) * landSize / Math.pow(2, (landVersion + 1) / 1.3)) * 100) / 100
        });
    }

    io.emit('initValues', {
        landPoints: JSON.stringify(landPoints),
        property: property,
        continents: continents,
        landSize: landSize,
        players: players
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
        let randomx = landSize * Math.round(Math.random() * 4 - 2) / 1000;
        let randomy = landSize * Math.round(Math.random() * 4 - 2) / 1000;

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

const landSize = 5000;

for (let mm = 0; mm < continents; mm++) {
    console.log('generating continent ' + (mm + 1));

    for (let j = 0; j < landComplexity * initialSize; j++) {
        generateLand(mm, j);
        console.log('step ' + (j + 1) + '/' + (landComplexity * initialSize));
    }

    setInterval(enhanceLand, 50, mm);
}

console.log('done');
