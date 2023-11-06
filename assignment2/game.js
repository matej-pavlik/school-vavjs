// Roman Bronis, Matej Pavlík
// Images sources: https://opengameart.org/content/colorful-bricks (CC0), https://www.svgrepo.com/svg/397681/orange-square (CC)
/* eslint-disable */
import { randomUUID } from 'node:crypto';
import { generateToken } from './security.js';

export async function createGame() {
    const connections = [];

    // public API
    const publicObject = {
        id: randomUUID(),
        controlToken: await generateToken(),
        isActive: false,
        bestSpeed: 1000,
        bestScore: 0,
        addConnection,
        removeConnection,
        sendEvent,
        changeTrainImage,
    };

    function addConnection(ws) {
        if (connections.length === 0) {
            runGame();
        }

        connections.push(ws);
    }

    function removeConnection(ws) {
        connections.splice(connections.indexOf(ws), 1);

        if (connections.length === 0) {
            stopGame();
        }
    }

    function sendEvent({ type }) {
        if (type === 'ENTER') {
            const index = road.findIndex(({ x, y }) => coursor.x === x && coursor.y === y);

            if (index > -1) {
                road.splice(index, 1);
                renderCell(coursor.x, coursor.y, images.default);
            } else {
                road.push({ x: coursor.x, y: coursor.y });
            }
        } else if (type === 'UP' && coursor.y > 0) {
            unrenderCursor();
            coursor.y -= 1;
        } else if (type === 'DOWN' && coursor.y < gameHeight - 1) {
            unrenderCursor();
            coursor.y += 1;
        } else if (type === 'LEFT' && coursor.x > 0) {
            unrenderCursor();
            coursor.x -= 1;
        } else if (type === 'RIGHT' && coursor.x < gameWidth - 1) {
            unrenderCursor();
            coursor.x += 1;
        }

        renderRoad();
        renderCursor();
    }

    function changeTrainImage({ type }) {
        if (type === 'RED') {
            images.train = 'https://opengameart.org/sites/default/files/red.svg';
        } else if (type === 'ORANGE') {
            images.train = 'https://www.svgrepo.com/show/397681/orange-square.svg';
        }
    }

    function stopGame() {
        reset();
        clearInterval(ival);
        clearTimeout(downcountTimeout);
        publicObject.isActive = false;
    }

    function runGame() {
        if (publicObject.isActive) {
            return;
        }

        reset();
        looping();

        publicObject.isActive = true;
    }

    function onGameInfoUpdate(data) {
        connections.forEach((ws) => {
            ws.send(JSON.stringify({ event: 'GAME_INFO_UPDATE', data }));
        });
    }

    function onGameCellsUpdate(data) {
        connections.forEach((ws) => {
            ws.send(JSON.stringify({ event: 'GAME_CELLS_UPDATE', data }));
        });
    }

    const images = {
        cursor: 'https://opengameart.org/sites/default/files/blue.svg',
        default: 'https://opengameart.org/sites/default/files/green.svg',
        endpoint: 'https://opengameart.org/sites/default/files/yellow.svg',
        road: 'https://opengameart.org/sites/default/files/grey.svg',
        train: 'https://opengameart.org/sites/default/files/red.svg',
    };

    function random(min, max) {
        if (typeof max === 'undefined') {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var gameWidth = 80;
    var gameHeight = 40;
    var trainLength = 4;
    var speed = 1000;
    var speedStep = 100;
    let score = 0;

    // Creates 2D array for keeping track of currently rendered image in the cell. It is needed for renderRoad().
    const cells = [...Array(gameWidth)].map(() => Array(gameHeight).fill(images.default));

    function renderCell(x, y, image = images.default, triggerUpdate = true) {
        cells[x][y] = image;

        if (triggerUpdate) {
            onGameCellsUpdate([{ x, y, image }]);
        }
    }

    function renderTrain(points) {
        points.forEach(({ x, y }) => renderCell(x, y, images.train));
    }

    var train = [];
    function initTrain() {
        train = [
            {
                x: Math.floor(gameWidth / 2),
                y: Math.floor(gameHeight / 2),
            },
        ];
        for (var i = 1; i < trainLength; i++) {
            train.push({
                x: train[i - 1].x,
                y: train[i - 1].y + 1,
            });
        }
    }
    initTrain();

    renderTrain(train);

    function noNextMove() {
        return (
            road.filter(function (point) {
                return (
                    (train[0].y - 1 === point.y && train[0].x === point.x) ||
                    (train[0].x - 1 === point.x && train[0].y === point.y) ||
                    (train[0].x + 1 === point.x && train[0].y === point.y) ||
                    (train[0].y + 1 === point.y && train[0].x === point.x)
                );
            }).length <= 0
        );
    }

    function nextMove() {
        train.pop();
        var t = train[0];
        var match = -1;
        for (var i = 0; i < road.length; i++) {
            var point = road[i];
            if (
                (t.y - 1 === point.y && t.x === point.x) ||
                (t.x - 1 === point.x && t.y === point.y) ||
                (t.x + 1 === point.x && t.y === point.y) ||
                (t.y + 1 === point.y && t.x === point.x)
            ) {
                match = i;
                break;
            }
        }

        if (match >= 0) {
            train.unshift({
                x: road[match].x,
                y: road[match].y,
            });

            road.splice(match, 1);
        }
    }

    function renderGrid() {
        const cellsUpdate = [];
        for (let y = 0; y < gameHeight; y += 1) {
            for (let x = 0; x < gameWidth; x += 1) {
                renderCell(x, y, images.default, false);
                cellsUpdate.push({ x, y, image: images.default });
            }
        }

        onGameCellsUpdate(cellsUpdate);
    }

    var road = [];
    var counter = 0;
    var ival = null;

    var endpoint = null;
    function initEndpoint() {
        endpoint = {
            x: random(0, gameWidth),
            y: random(0, gameHeight),
        };
    }
    initEndpoint();

    function renderEndpoint() {
        renderCell(endpoint.x, endpoint.y, images.endpoint);
    }
    renderEndpoint();

    function isEndpoint() {
        return (
            typeof train === 'object' &&
            typeof train[0] === 'object' &&
            train[0].x === endpoint.x &&
            train[0].y === endpoint.y
        );
    }

    function looping() {
        ival = setInterval(function () {
            renderRoad();

            if (noNextMove()) {
                downcount('FAILED');
                reset();
            }
            nextMove();
            if (isEndpoint()) {
                nextLevel();
            }
            renderGrid();
            renderTrain(train);
            renderRoad();
            renderEndpoint();

            if (counter % 500 === 0 && counter > 0) {
                speedUp();
            }
            counter++;

            onGameInfoUpdate({
                count: downcountSecs,
                score,
                speed,
                bestScore: publicObject.bestScore,
                bestSpeed: publicObject.bestSpeed,
            });
        }, speed);
    }

    let downcountTimeout; // For correct reset button functionality
    let downcountSecs = 5;
    var downcounter = 5;
    function downcount(secs) {
        downcountSecs = secs;
        onGameInfoUpdate({
            count: downcountSecs,
            score,
            speed,
            bestScore: publicObject.bestScore,
            bestSpeed: publicObject.bestSpeed,
        });

        // Only allow one timer at a time
        clearTimeout(downcountTimeout);

        if (typeof secs === 'number') {
            downcountTimeout = setTimeout(() => {
                if (secs === 0) looping();
                else if (secs > 0) downcount(secs - 1);
            }, 2000);
        }
    }
    downcount(downcounter);

    function speedUp() {
        clearInterval(ival);
        speed -= speedStep;
        if (speed < 0) speed = 0;

        if (speed < publicObject.bestSpeed) {
            publicObject.bestSpeed = speed;
        }

        looping();
    }

    function reset() {
        clearInterval(ival);
        speed = 1000;
        score = 0;
        counter = 0;
        road = [];
        initEndpoint();
        initTrain();

        onGameInfoUpdate({
            count: downcountSecs,
            score,
            speed,
            bestScore: publicObject.bestScore,
            bestSpeed: publicObject.bestSpeed,
        });

        downcount(downcounter);
    }

    function nextLevel() {
        score += 1;

        if (score > publicObject.bestScore) {
            publicObject.bestScore = score;
        }

        clearInterval(ival);
        road = [];
        initEndpoint();
        initTrain();
        downcount(downcounter);
    }

    function renderRoad() {
        road.forEach(({ x, y }) => {
            if (cells[x][y] !== images.train) {
                renderCell(x, y, images.road);
            }
        });
    }

    function renderCursor() {
        renderCell(coursor.x, coursor.y, images.cursor);
    }

    function unrenderCursor() {
        renderCell(coursor.x, coursor.y, images.default);
    }

    var coursor = {
        x: 0,
        y: 0,
    };
    renderCursor();

    stopGame();

    return publicObject;
}
