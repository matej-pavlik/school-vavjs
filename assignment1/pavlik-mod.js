/**
 * u1 - Matej Pavlík
 *
 * Images source:
 * https://opengameart.org/content/colorful-bricks (CC0)
 *
 * Audio source:
 * https://freemusicarchive.org/music/Blue_Dot_Sessions/Glacier_Quartet/Sweetly/ (CC)
 */

'use strict';

{
    // These are actual computed css cell sizes
    const CELL_WIDTH = 12.8; // 10
    const CELL_HEIGHT = 9.8; // 7

    let debug = false;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    let downcountTimeout; // For correct reset button functionality

    const score = document.createElement('span');
    const speed = document.createElement('span');

    function debugMessage(...args) {
        if (debug) {
            console.log('DEBUG:', ...args);
        }
    }

    function loadImage(src) {
        const img = new Image();

        return {
            img,
            promise: new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            }),
        };
    }

    const images = {
        cursor: loadImage('https://opengameart.org/sites/default/files/blue.svg'),
        default: loadImage('https://opengameart.org/sites/default/files/green.svg'),
        endpoint: loadImage('https://opengameart.org/sites/default/files/yellow.svg'),
        road: loadImage('https://opengameart.org/sites/default/files/grey.svg'),
        train: loadImage('https://opengameart.org/sites/default/files/red.svg'),
    };

    // Creates 2D array for keeping track of currently rendered image in the cell. It is needed for renderRoad().
    const cells = [...Array(window.gameWidth)].map(() => Array(window.gameHeight).fill(images.default));

    function renderCell(x, y, image = images.default) {
        cells[x][y] = image;
        ctx.drawImage(image.img, x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }

    function renderGrid() {
        debugMessage('Rendering grid');
        for (let y = 0; y < window.gameHeight; y += 1) {
            for (let x = 0; x < window.gameWidth; x += 1) {
                renderCell(x, y);
            }
        }
    }

    function renderCursor() {
        debugMessage('Rendering cursor');
        renderCell(window.coursor.x, window.coursor.y, images.cursor);
    }

    function renderEndpoint() {
        debugMessage('Rendering endpoint');
        renderCell(window.endpoint.x, window.endpoint.y, images.endpoint);

        // Update speed here so we don't need to rewrite the looping() function
        speed.textContent = window.speed;
    }

    function renderRoad() {
        debugMessage('Rendering road');
        window.road.forEach(({ x, y }) => {
            if (cells[x][y] !== images.train) {
                renderCell(x, y, images.road);
            }
        });
    }

    function renderTrain(points) {
        debugMessage('Rendering train');
        points.forEach(({ x, y }) => renderCell(x, y, images.train));
    }

    function unrenderCursor() {
        debugMessage('Unrendering cursor');
        renderCell(window.coursor.x, window.coursor.y, images.default);
    }

    function keyboardListener({ code }) {
        // Blurs focused buttons so that when pressing enter, it doesn't trigger button click event
        document.activeElement.blur();

        if (code === 'Enter') {
            const index = window.road.findIndex(
                ({ x, y }) => window.coursor.x === x && window.coursor.y === y,
            );

            if (index > -1) {
                // Replacement for line 236 from game.js
                renderCell(window.coursor.x, window.coursor.y, images.default);
            }
        } else if (code === 'KeyW' && window.coursor.y > 0) {
            unrenderCursor();
            window.coursor.y -= 1;
        } else if (code === 'KeyS' && window.coursor.y < window.gameHeight - 1) {
            unrenderCursor();
            window.coursor.y += 1;
        } else if (code === 'KeyA' && window.coursor.x > 0) {
            unrenderCursor();
            window.coursor.x -= 1;
        } else if (code === 'KeyD' && window.coursor.x < window.gameWidth - 1) {
            unrenderCursor();
            window.coursor.x += 1;
        }

        renderRoad();
        renderCursor();
    }

    function initGame() {
        canvas.width = window.gameWidth * CELL_WIDTH;
        canvas.height = window.gameHeight * CELL_HEIGHT;

        renderGrid();
        renderTrain(window.train);
        renderEndpoint();
        renderCursor();

        window.addEventListener('keydown', keyboardListener);

        document.querySelector('.game-container').append(canvas);
    }

    function initGameInfo() {
        const scoreWrapper = document.createElement('div');
        scoreWrapper.textContent = 'Score: ';
        scoreWrapper.append(score);

        const speedWrapper = document.createElement('div');
        speedWrapper.textContent = 'Speed: ';
        speedWrapper.append(speed);

        score.textContent = 0;
        speed.textContent = window.speed;

        document.body.append(scoreWrapper, speedWrapper);
    }

    function createButton(text, callbackFn) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.addEventListener('click', callbackFn);

        return btn;
    }

    function initAudio() {
        // prettier-ignore
        const audio = new Audio('https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Blue_Dot_Sessions/Glacier_Quartet/Blue_Dot_Sessions_-_05_-_Sweetly.mp3');
        audio.loop = true;

        const buttons = [
            createButton('Play', () => audio.play()),
            createButton('Pause', () => audio.pause()),
        ];

        document.body.append(...buttons);
    }

    function downcount(secs) {
        document.querySelector('#downcount').innerHTML = secs;

        // Only allow one timer at a time
        clearTimeout(downcountTimeout);

        if (secs === window.downcounter) {
            score.textContent = Number(score.textContent) + 1;
        } else if (secs === 'FAILED') {
            score.textContent = -1; // After this call, the game will reset, and the condition above will apply
        }

        if (typeof secs === 'number') {
            downcountTimeout = setTimeout(() => {
                if (secs === 0) window.looping();
                else if (secs > 0) downcount(secs - 1);
            }, 2000);
        }
    }

    function initReset() {
        const btn = createButton('Reset game', () => {
            debugMessage('Resetting game');

            window.reset();
            renderGrid();
            renderTrain(window.train);
            renderEndpoint();

            score.textContent = 0;
            speed.textContent = window.speed;
        });
        btn.style.display = 'block';

        document.body.append(btn);
    }

    function init() {
        if (window.location.href.includes('?debug')) {
            debug = true;
        }

        // Only hide the original table so that line 236 from game.js doesn't throw errors
        document.querySelector('#game-table').style.display = 'none';

        initGameInfo();
        initReset();
        initAudio();

        // Initialize the game if all the images are successfully loaded
        Promise.all(Object.values(images).map(({ promise }) => promise))
            .then(initGame)
            .catch((e) => debugMessage('ERROR: Failed to load some images', e));

        window.downcount = downcount;
        window.renderAllWhite = renderGrid;
        window.renderCoursor = renderCursor;
        window.renderEndpoint = renderEndpoint;
        window.renderRoad = renderRoad;
        window.renderTrain = renderTrain;
        window.unrenderCoursor = unrenderCursor;
    }

    init();
}
