/**
 * u1 - Matej Pavlík
 *
 * Images source:
 * https://opengameart.org/content/colorful-bricks (CC0)
 */

'use strict';

// TODO maybe put these constants into {}?

// TODO explain why these values
const CELL_WIDTH = 12.8; // TODO 10
const CELL_HEIGHT = 9.8; // TODO 7

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: false });

{
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

    // TODO is this function needed?
    function create2DArray(x, y, defaultValue) {
        return [...Array(x)].map(() => Array(y).fill(defaultValue));
    }

    // This is needed for renderRoad()
    const cells = create2DArray(window.gameWidth, window.gameHeight, images.default);

    function renderCell(x, y, image = images.default) {
        cells[x][y] = image;
        ctx.drawImage(image.img, x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }

    function renderGrid() {
        for (let y = 0; y < window.gameHeight; y += 1) {
            for (let x = 0; x < window.gameWidth; x += 1) {
                renderCell(x, y);
            }
        }
    }

    function renderCursor() {
        renderCell(window.coursor.x, window.coursor.y, images.cursor);
    }

    function renderEndpoint() {
        renderCell(window.endpoint.x, window.endpoint.y, images.endpoint);
    }

    function renderRoad() {
        window.road.forEach(({ x, y }) => {
            if (cells[x][y] !== images.train) {
                renderCell(x, y, images.road);
            }
        });
    }

    function renderTrain(points) {
        points.forEach(({ x, y }) => renderCell(x, y, images.train));
    }

    function unrenderCursor() {
        renderCell(window.coursor.x, window.coursor.y, images.default);
    }

    function addKeyboardListener() {
        window.addEventListener('keydown', ({ code }) => {
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
        });
    }

    function initGame() {
        canvas.width = window.gameWidth * CELL_WIDTH;
        canvas.height = window.gameHeight * CELL_HEIGHT;

        renderGrid();
        renderTrain(window.train);
        renderEndpoint();
        renderCursor();

        addKeyboardListener();

        document.querySelector('.game-container').appendChild(canvas);
    }

    function init() {
        // Only hide the original table so that line 236 from game.js doesn't throw errors
        document.querySelector('#game-table').style.display = 'none';

        // TODO comment on this
        Promise.all(Object.values(images).map(({ promise }) => promise)).then(initGame);

        window.renderAllWhite = renderGrid;
        window.renderCoursor = renderCursor;
        window.renderEndpoint = renderEndpoint;
        window.renderRoad = renderRoad;
        window.renderTrain = renderTrain;
        window.unrenderCoursor = unrenderCursor;
    }

    init();
}
