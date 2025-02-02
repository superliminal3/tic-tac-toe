const game = (function() {
    let gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const getGameboardState = () => {return gameboard};
    const setGameboardState = (arr) => {
        gameboard = arr;
    };

    const changeGameboardState = (pos, n) => {
        if (gameboard[pos] == 0) {
            gameboard[pos] = n;
        }
    };

    return {getGameboardState, changeGameboardState};
})();

const gameStatus = (function(gameObj) {
    const i_parent = this;
    let canPlay = true;
    let roundCounter = 0;

    const checkGame = () => {
        if (roundCounter === 8) {
            declareWinner(3);
        }
        roundCounter++;

        const gameboardState = gameObj.getGameboardState();

        const compare = (arr) => {
            if (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === 1) {
                return 1;
            };
            if (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === 2) {
                return 2;
            };
            return 0;
        };

        checkTable = ["012", "345", "678", "036", "147", "258", "048", "246"];
        checkTable.forEach((v, i, a) => {
            checkTableDivided = Array.from(a[i]).map((v) => parseInt(v));
            gameboardIndexed = [];
            checkTableDivided.forEach((v) => gameboardIndexed.push(gameboardState[v]));
            winner = compare(gameboardIndexed);

            switch (winner) {
                case 1: i_parent.declareWinner(1); break;
                case 2: i_parent.declareWinner(2); break;
                default: break;
            };
        });
    };
    
    play = (pos, playerNumber) => {
        if (!!canPlay) {
            gameObj.changeGameboardState(pos, playerNumber);
            checkGame();
        }
    };

    let winner = 0;

    declareWinner = (playerNumber) => {
        canPlay = false;
        switch (playerNumber) {
            case 1: case 2: winner = playerNumber; break;
            case 3: winner = 3; break;
            default: break;
        }
        console.log(winner);
    };

    const getWinner = () => {
        console.log(winner);
        return winner;
    }

    const getCanPlay = () => {
        return canPlay;
    }

    return {play, getCanPlay, getWinner};
})(game);

const activePlayer = (function(gameStatusObj) {
    nr = 1;

    play = (pos) => {
        if (game.getGameboardState()[pos] === 0 && !!gameStatusObj.getCanPlay()) {
            gameStatus.play(pos, nr);
            swap();
        }
    };

    swap = () => {
        if (nr === 2) {
            nr--;
        } else if (nr === 1) {
            nr++;
        }
    }

    get = () => {
        if (!!gameStatusObj.getCanPlay()) {
            switch (nr) {
                case 1: return "O";
                case 2: return "X";
            }
        } else {
            return "";
        }
    }

    getNr = () => nr;

    return {play, get, swap, getNr};
})(gameStatus);

const display = (function(activePlayerObj, gameStatusObj) {
    const topContainer = document.querySelector("#top-container");

    const currentPlayerDisplay = document.createElement("div");
    const winnerDisplay = document.createElement("div");

    currentPlayerDisplay.setAttribute("class", "top-display");
    winnerDisplay.setAttribute("class", "top-display");

    refreshWinnerDisplay = () => {
        let winner = gameStatusObj.getWinner();
        switch (winner) {
            case 1: case 2: winnerDisplay.textContent = winner + " is the winner"; break;
            case 3: winnerDisplay.textContent = "no winner"; break;
            default: winnerDisplay.textContent = ""; break;
        }
    }

    refreshCurrentPlayerDisplay = () => {
        currentPlayerDisplay.textContent = "Current player: " + activePlayerObj.getNr();
    }

    init = () => {
        topContainer.appendChild(currentPlayerDisplay);
        topContainer.appendChild(winnerDisplay);
        currentPlayerDisplay.textContent = "Current player: " + activePlayerObj.getNr();
        winnerDisplay.textContent = "";

    }

    return {init, refreshWinnerDisplay, refreshCurrentPlayerDisplay}
})(activePlayer, gameStatus);

const gameboardContainer = document.querySelector("#gameboard-container");
display.init();

function spawnTiles() {
    const tiles = [];
    for (let z = 0; z < 9; z++) {
        tiles[z] = document.createElement("div");
        tiles[z].addEventListener("click", () => {
            tiles[z].textContent = activePlayer.get();
            activePlayer.play(z);
            display.refreshCurrentPlayerDisplay();
            display.refreshWinnerDisplay();
        });
        tiles[z].setAttribute("class", "tile");
        gameboardContainer.appendChild(tiles[z]);
    }
}

spawnTiles();
