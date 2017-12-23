var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;
var fs = require('fs');
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

function loadLand() {
  fs.readFile(__dirname + '/assets/landPoints.txt', 'utf8', function(err, data){
    if(err){
      console.log(err);
    }
    
    landPoints = JSON.parse(data);
  });
}

function saveLand() {
  fs.writeFile(__dirname + '/assets/landPoints.txt', JSON.stringify(landPoints), function(err) {
        if(err) {
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
    let randomx = Math.round((landSize * Math.round(Math.random() * 8 - 4) / 4) * 100) / 100;
    let randomy = Math.round((landSize * Math.round(Math.random() * 8 - 4) / 4) * 100) / 100;

    let currentx = landPoints[k][landPoints[k].length - 1].x;
    let currenty = landPoints[k][landPoints[k].length - 1].y;

    let biasx = 0;
    let biasy = 0;

    if (f >= landComplexity * initialSize - landComplexity * initialSize / 10) {
        biasx = Math.round((landPoints[k][0].x - currentx) / (landComplexity * initialSize - f) * 100) / 100;
        biasy = Math.round((landPoints[k][0].y - currenty) / (landComplexity * initialSize - f) * 100) / 100;
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
    for (let j = 1; j < 10; j++) {
        for (let i = 0; i < landPoints[k].length - 1; i += 2) {
            landPoints[k].splice(i + 1, 0, {
                x: Math.round((landPoints[k][i].x + ((landPoints[k][i + 1].x - landPoints[k][i].x) / 2) + (Math.random() * 2 - 1) * landSize / (j * j) * 2) * 100) / 100, 
                y: Math.round((landPoints[k][i].y + ((landPoints[k][i + 1].y - landPoints[k][i].y) / 2) + (Math.random() * 2 - 1) * landSize / (j * j) * 2) * 100) / 100
            });
        }
        
        console.log('enhance step ' + j + '/9');
    }
    
    console.log('final enhance');
    //console.log('step 1/2');
    for (let i = 0; i < landPoints[k].length - 1; i += 6) {
        for (let j = 0; j < 5; j++) {
            landPoints[k].splice(i + 1 + j, 0, {
                x: landPoints[k][i].x + ((landPoints[k][i + 1 + j].x - landPoints[k][i].x) / 7) * (j + 1) + (Math.random() * 2 - 1) * landSize / 100 / 5, 
                y: landPoints[k][i].y + ((landPoints[k][i + 1 + j].y - landPoints[k][i].y) / 7) * (j + 1) + (Math.random() * 2 - 1) * landSize / 100 / 5
            });
        }
    }
    /*console.log('step 2/2');
    for (let i = 0; i < landPoints[k].length - 1; i += 11) {
        for (let j = 0; j < 10; j++) {
            landPoints[k].splice(i + 1 + j, 0, {
                x: landPoints[k][i].x + ((landPoints[k][i + 1 + j].x - landPoints[k][i].x) / 12) * (j + 1) + (Math.random() * 2 - 1) * landSize / 100 / 10, 
                y: landPoints[k][i].y + ((landPoints[k][i + 1 + j].y - landPoints[k][i].y) / 12) * (j + 1) + (Math.random() * 2 - 1) * landSize / 100 / 10
            });
        }
    }*/
    console.log('done enhancing');
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
        let randomx = landSize * Math.round(Math.random() * 4 - 2) / 100;
        let randomy = landSize * Math.round(Math.random() * 4 - 2) / 100;

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
loadLand();

if (landPoints[0].length < 100) {
for (let mm = 0; mm < continents; mm++) {
    console.log('generating continent ' + (mm + 1));
    
    for (let j = 0; j < landComplexity * initialSize; j++) {
        generateLand(mm, j);
        console.log('step ' + j + '/' + (landComplexity * initialSize));
    }
    
    
    console.log('enhancing continent ' + (mm + 1));
    enhanceLand(mm);
}
    
saveLand();
}

console.log('done');
