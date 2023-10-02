function addDowncount() {
    var div = document.createElement('DIV');
    div.innerHTML = '<h1 id="downcount"></h1>';
    document.body.appendChild(div);
}
addDowncount();

function random(min,max) {
    if(typeof max === 'undefined') {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max-min))+min;
}

function addStyle() {
    document.getElementById('style').innerHTML = ''+
        'table { border-collapse: collapse; }'+
        'table tr td { width: 10px; height: 7px; border: 1px solid grey; }';
}
addStyle();

function initTable(width,height) {
    var table = document.createElement('TABLE');
    table.id = 'game-table';
    document.querySelector('.game-container').appendChild(table);
    for(var y=0;y<height;y++) {
        var tableLine = document.createElement('TR');
        tableLine.className = 'y-'+y;
        for(var x=0;x<width;x++) {
            var tableCell = document.createElement('TD');
            tableCell.className = 'x-'+x;
            tableCell.addEventListener('click',function(){
                var x = parseInt(this.className.split('-')[1]);
                var y = parseInt(this.parentNode.className.split('-')[1]);
                var color = this.style.backgroundColor;
            });
            tableLine.appendChild(tableCell);
        }
        table.appendChild(tableLine);
    }
}

var gameWidth = 80;
var gameHeight = 40;
var trainLength = 4;
var speed = 1000;
var speedStep = 100;

initTable(gameWidth,gameHeight);

function renderTrainPoint(x,y) {
    document.querySelector('.y-'+y+' .x-'+x).style.backgroundColor = 'red';
}

function renderTrain(train) {
    train.forEach(point => renderTrainPoint(point.x, point.y));
}


var train = [];
function initTrain() {
    train=[{
        x: Math.floor(gameWidth/2),
        y: Math.floor(gameHeight/2)
    }];
    for(var i=1;i<trainLength;i++) {
        train.push({
            x: train[i-1].x,
            y: train[i-1].y+1
        });
    }
}
initTrain();

renderTrain(train);

function noNextMove() {
    return road.filter(function(point) {
        return (((train[0].y-1) === point.y && train[0].x === point.x) ||
            ((train[0].x-1) === point.x && train[0].y === point.y) ||
            ((train[0].x+1) === point.x && train[0].y === point.y) ||
            ((train[0].y+1) === point.y && train[0].x === point.x)); 
    }).length <= 0;
}

function nextMove() {
    train.pop();
    var t = train[0];
    var match = -1;
    for(var i=0;i<road.length;i++) {
        var point = road[i];
        if ( ((t.y-1) === point.y && t.x === point.x) ||
             ((t.x-1) === point.x && t.y === point.y) ||
             ((t.x+1) === point.x && t.y === point.y) ||
             ((t.y+1) === point.y && t.x === point.x)
        ) {
            match = i;
            break;
        }
    }
    
    if(match >= 0) { 
        train.unshift({
            x: road[match].x,
            y: road[match].y
        });

        road.splice(match,1);
    }
}

function renderAllWhite() {
    for(var y = 0;y<gameHeight;y++) {
        for(var x=0;x<gameWidth;x++) {
            document.querySelector('.y-'+y+' .x-'+x).style.backgroundColor = 'white';
        }
    }
}

var road = [];
var counter = 0;
var ival = null;

var endpoint = null;
function initEndpoint() {
    endpoint = {
        x: random(0,gameWidth),
        y: random(0,gameHeight)
    };
}
initEndpoint();
function renderEndpoint() {
    document.querySelector('.y-'+endpoint.y+' .x-'+endpoint.x).style.backgroundColor = 'yellow';
}
renderEndpoint();

function isEndpoint() {
    return typeof train === 'object' && typeof train[0] === 'object' && train[0].x === endpoint.x && train[0].y === endpoint.y;
}


function looping() {
    ival = setInterval(function() {
        renderRoad();
        
        if(noNextMove()) {
            downcount('FAILED');
            reset();
        }
        nextMove();
        if(isEndpoint()) {
            nextLevel();
        }
        renderAllWhite();
        renderTrain(train);
        renderRoad();
        renderEndpoint();
    
        if(counter % 500 === 0 && counter > 0) {
            speedUp();
        }
        counter++;
    },speed);
}

var downcounter = 5;
function downcount(secs) {
    document.getElementById('downcount').innerHTML = secs;
    if(typeof secs === 'number') {
        setTimeout(function() {
            if(secs === 0) looping();
            else if(secs > 0) downcount(secs-1);
        },2000);
    }
}
downcount(downcounter);

function speedUp() {
    clearInterval(ival);
    speed -= speedStep;
    if(speed < 0) speed = 0;
    looping();
}

function reset() {
    clearInterval(ival);
    speed = 1000;
    counter = 0;
    road = [];
    initEndpoint();
    initTrain();
    downcount(downcounter);
}

function nextLevel() {
    clearInterval(ival);
    road = [];
    initEndpoint();
    initTrain();
    downcount(downcounter);
}

window.addEventListener('keydown',function(event) {
    if(event.keyCode === 40) {
        unrenderCoursor();
        coursor.y++;
        if(coursor.y >= gameHeight) coursor.y = gameHeight-1;
    }
    else if(event.keyCode === 38) {
        unrenderCoursor();
        coursor.y--;
        if(coursor.y < 0) coursor.y = 0;
    }
    else if(event.keyCode === 39) {
        unrenderCoursor();
        coursor.x++;
        if(coursor.x >= gameWidth) coursor.x = gameWidth-1;
    }
    else if(event.keyCode === 37) {
        unrenderCoursor();
        coursor.x--;
        if(coursor.x < 0) coursor.x = 0;
    }
    else if(event.keyCode === 13) {
        var element = document.querySelector('.y-'+coursor.y+' .x-'+coursor.x);
        var index = -1;
        for(var i=0;i<road.length;i++) {
            if(road[i].x === coursor.x && road[i].y === coursor.y) {
                index = i;
                break;
            }
        }
        if(index > -1) {
            road.splice(index,1);
            element.style.backgroundColor = 'white';
        }
        else {
            road.push({x: coursor.x, y: coursor.y});
        }
    }
    renderRoad();
    renderCoursor();
});

function renderRoad() {
    road.forEach(point => {
        var element = document.querySelector('.y-'+point.y+' .x-'+point.x);
        if(element !== null) {
            var originalColor = element.style.backgroundColor;
            if(originalColor !== 'red') element.style.backgroundColor = 'green';
        }
    });
}

function renderCoursor() {
    var x = coursor.x;
    var y = coursor.y;
    coursor.prevColor = document.querySelector('.y-'+y+' .x-'+x).style.backgroundColor;
    document.querySelector('.y-'+y+' .x-'+x).style.backgroundColor = 'blue';
}

function unrenderCoursor() {
    var x = coursor.x;
    var y = coursor.y; 
    document.querySelector('.y-'+y+' .x-'+x).style.backgroundColor = 'white';
}

var coursor = {
    'x': 0,
    'y': 0,
    'prevColor': 'white'
};
renderCoursor();
