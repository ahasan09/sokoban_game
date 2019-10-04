
let mazeDiv = document.getElementById("mazeDiv");
let playerDiv = document.createElement("div");
playerDiv.classList.add("player", "cellDiv");
const offset = {
    "ArrowDown": { row: +1, column: +0 },
    "ArrowUp": { row: -1, column: +0 },
    "ArrowLeft": { row: +0, column: -1 },
    "ArrowRight": { row: +0, column: +1 },
}

function newVector() {
    return [
        "  WWWWW ",
        "WWW   W ",
        "WOSB  W ",
        "WWW BOW ",
        "WOWWB W ",
        "W W O WW",
        "WB XBBOW",
        "W   O  W",
        "WWWWWWWW"
    ];
}

let map = newVector();
let player = {
    x: 2,
    y: 2
};

function canMove(playerCell, boxCell) {
    if (playerCell.dataset.type === "wall") return false;
    if (playerCell.classList.contains("box") && (boxCell.classList.contains("box") || boxCell.dataset.type === "wall")) return false;

    return true;
}

function getplayerPosition(keyName) {

    return [offset[keyName].row, offset[keyName].column];
}

function findNextCell(row, column) {
    return document.querySelector("#mazeDiv .rowDiv " + "[data-row-index='" + row + "']" + "[data-cell-index='" + column + "']");
}

function checkPlayerWin() {
    let destinations = document.querySelectorAll(".boxDestination")
    let boxDestinations = document.querySelectorAll(".boxDestination.box")
    if (destinations.length === boxDestinations.length) {
        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: 'Congratulations! You Win!',
            text: "Good Job!!",
            type: 'success',
            confirmButtonColor: '#8bc34a',
            confirmButtonText: 'Play again!',
            showCancelButton: true,
            cancelButtonColor: '#e91e63'
        }).then(function (isConfirm) {
            if (isConfirm) {
                resetGame();
            }
        })
    }
}

let isStartRemoved = false;

function playerMove(rowIndex, columnIndex, playerOffset) {
    const [row, column] = playerOffset;
    const playerNextCell = findNextCell(rowIndex + row, columnIndex + column);
    const nextRow = row === 0 ? 0 : row + row
    const nextColumn = column == 0 ? 0 : column + column
    const boxNextCell = findNextCell(rowIndex + nextRow, columnIndex + nextColumn);
    if (canMove(playerNextCell, boxNextCell)) {
        if (!isStartRemoved) {
            document.querySelector(".start").classList.remove("start");
            isStartRemoved = true;
        }
        playerNextCell.appendChild(playerDiv);
        player.x += row;
        player.y += column;

        if (playerNextCell.classList.contains("box")) {
            boxNextCell.classList.add("box");
        }
        playerNextCell.classList.remove("box");

        checkPlayerWin()
    }
}

function createCellDiv(val, rowIndex, cellIndex) {
    let cellElement = document.createElement('div');
    switch (val) {
        case "W":
            cellElement.dataset.type = "wall"
            cellElement.classList.add("wall")
            break
        case " ":
            cellElement.dataset.type = "hall"
            cellElement.classList.add("hall")
            break
        case "S":
            cellElement.dataset.type = "hall"
            cellElement.classList.add("start")
            break
        case "B":
            cellElement.dataset.type = "hall"
            cellElement.classList.add("box")
            break
        case "O":
            cellElement.dataset.type = "hall"
            cellElement.classList.add("boxDestination");
            break
        case "X":
            cellElement.dataset.type = "hall"
            cellElement.classList.add("box", "boxDestination")
            break
    }

    cellElement.classList.add(cellElement.dataset.type, "cellDiv")
    cellElement.dataset.rowIndex = rowIndex;
    cellElement.dataset.cellIndex = cellIndex;
    return cellElement
}

function draw() {
    mazeDiv.innerHTML = "";
    for (let y = 0; y < map.length; y++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('rowDiv');
        mazeDiv.appendChild(rowDiv);
        const row = map[y];

        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            const cellDiv = createCellDiv(cell, y, x);
            if (cellDiv.dataset.type === "start") {
                cellDiv.appendChild(playerDiv);
            }
            rowDiv.appendChild(cellDiv);
        }
    }
}

function resetGame() {
    isStartRemoved = false;
    map = newVector();
    player.x = 2;
    player.y = 2;
    draw();
}

function initGame() {
    draw();
    document.getElementById("startNewGame").onclick = function () {
        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: 'Are you sure?',
            text: "Your progress will be Lost!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8bc34a',
            cancelButtonColor: '#e91e63',
            confirmButtonText: 'Yes, Restart Game!'
        }).then(function (isConfirm) {
            if (isConfirm) {
                resetGame();
            }
        })
    }
}

document.addEventListener('keydown', (event) => {
    let keyName = event.key;
    let row = player.x;
    let column = player.y;
    const playerOffset = offset[keyName];
    if (playerOffset) {
        playerMove(row, column, [playerOffset.row, playerOffset.column]);
    }
});

initGame();






