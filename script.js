const game = (function() {
    let gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const getGameboardState = () => gameboard;
    const resetGameboardState = () => gameboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const changeGameboardState = (pos, n) => {
        if (gameboard[pos] == 0) {
            gameboard[pos] = n;
        }
    };

    return {getGameboardState, resetGameboardState, changeGameboardState}
})();

const player1 = (function() {
    let active = false;
    let name = "";

    setName = (n) => {name = n};
    getName = () => name;
    getActive = () => active;
    flipActive = (n) => active = !active;

    return {getActive, flipActive, setName, getName}
})();

const player2 = (function() {
    let active = false;
    let name = "";

    setName = (n) => name = n;
    getName = () => name;
    getActive = () => active;
    flipActive = (n) => active = !active;

    return {getActive, flipActive, setName, getName}
})();

const gameStatus = (function(gameObj, player1obj, player2obj) {
    let canPlay = true;
    let roundCounter = 0;
    let winner = 0;

    const checkGame = () => {
        if (roundCounter === 8) {
            declareWinner(3)
        }
        roundCounter++;

        const gameboardState = gameObj.getGameboardState();

        const compare = (arr) => {
            if (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === 1) {return 1};
            if (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === 2) {return 2};
            return 0;
        }

        checkTable = ["012", "345", "678", "036", "147", "258", "048", "246"];
        checkTable.forEach((v, i, a) => {
            checkTableDivided = Array.from(a[i]).map((v) => parseInt(v));
            gameboardIndexed = [];
            checkTableDivided.forEach((v) => gameboardIndexed.push(gameboardState[v]));
            const winner = compare(gameboardIndexed);
            switch (winner) {
                case 1: declareWinner(1); break;
                case 2: declareWinner(2); break;
                default: break;
            }
        });
    }

    swap = () => {
        player1obj.flipActive();
        player2obj.flipActive();
    }
    
    play = (pos) => {
        if (canPlay && gameObj.getGameboardState()[pos] === 0) {
            gameObj.changeGameboardState(pos, getActivePlayer());
            checkGame();
            swap();
        }
    }

    getActivePlayer = () => {
        let nr = 0;
        player1obj.getActive() ? nr = 1 : nr = 2;
        return nr;
    }

    getActivePlayerSymbol = () => {
        if (canPlay) {
            switch (getActivePlayer()) {
                case 1: return "O";
                case 2: return "X";
            }
        } else {
            return "";
        }
    }

    getActivePlayerName = () => {
        return player1obj.getActive() ? player1obj.getName() : player2obj.getName();
    }

    declareWinner = (playerNumber) => {
        canPlay = false;
        winner = playerNumber;
        swap();
    }

    const reset = () => {
        gameObj.resetGameboardState();
        canPlay = true;
        roundCounter = 0;
        winner = 0;
    }

    const getWinner = () => winner;
    const getCanPlay = () => canPlay;

    return {play, getWinner, getCanPlay, reset, getActivePlayer, getActivePlayerSymbol, getActivePlayerName}
})(game, player1, player2);

const display = (function(gameObj, gameStatusObj, player1obj, player2obj) {
    const topContainer = document.querySelector("#top-container");
    const gameboardContainer = document.querySelector("#gameboard-container");

    const currentPlayerDisplay = document.createElement("div");
    const winnerDisplay = document.createElement("div");
    const resetButton = document.createElement("div");

    currentPlayerDisplay.setAttribute("class", "top-display");
    winnerDisplay.setAttribute("class", "top-display");

    let tiles = [];

    const spawnResetButton = () => {
        resetButton.textContent = "reset";
        resetButton.setAttribute("class", "button-div");
        resetButton.addEventListener("click", () => {
            gameStatusObj.reset();
            resetButton.textContent = "";
            resetTiles();
        });
    }

    const refreshResetButtonStatus = () => {
        if (!gameStatusObj.getCanPlay()) {spawnResetButton()};
    }

    const refreshWinnerDisplay = () => {
        let winner = gameStatusObj.getWinner();
        switch (winner) {
            case 1: winnerDisplay.textContent = "player " + player1obj.getName() + " is the winner"; break;
            case 2: winnerDisplay.textContent = "player " + player2obj.getName() + " is the winner"; break;
            case 3: winnerDisplay.textContent = "no winner"; break;
            default: winnerDisplay.textContent = ""; break;
        }
    }

    const resetTiles = () => {
        tiles.forEach((node, i) => node.parentNode.removeChild(tiles[i]));
        winnerDisplay.textContent = "";
        spawnTiles();
    }

    const refreshCurrentPlayerDisplay = () => {
        currentPlayerDisplay.textContent = "Current player: " + gameStatusObj.getActivePlayerName();
    }

    function spawnTiles() {
        for (let z = 0; z < 9; z++) {
            tiles[z] = document.createElement("div");
            tiles[z].addEventListener("click", () => {
                if (gameObj.getGameboardState()[z] === 0) {
                    tiles[z].appendChild(document.createTextNode(gameStatusObj.getActivePlayerSymbol()));
                }
                gameStatusObj.play(z);
                refreshCurrentPlayerDisplay();
                refreshWinnerDisplay();
                refreshResetButtonStatus();
            });
            tiles[z].setAttribute("class", "tile");
            gameboardContainer.appendChild(tiles[z]);
        }
    }

    const init = () => {
        topContainer.appendChild(currentPlayerDisplay);
        topContainer.appendChild(winnerDisplay);
        topContainer.appendChild(resetButton);
        currentPlayerDisplay.textContent = "Current player: " + gameStatusObj.getActivePlayerName();
        winnerDisplay.textContent = "";
        spawnTiles();
    }

    return {init}
})(game, gameStatus, player1, player2);

const dialog = (function(player1obj, player2obj, displayObj) {
    const dialogBox = document.querySelector("#dialog");
    let name1 = document.querySelector("#name-1");
    let name2 = document.querySelector("#name-2");
    const startButton = document.querySelector("#start-button");

    init = () => {
        startButton.addEventListener("click", () => {
            player1obj.setName(name1.value);
            player2obj.setName(name2.value);
            name1.value = "";
            name2.value = "";
            player1.flipActive();
            dialogBox.close();

            displayObj.init();
        });
    }

    return {init}
})(player1, player2, display);

dialog.init();
