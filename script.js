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
    stopGame = (n) => {
        play(10, n);
    };

    const checkGame = () => {
        const gameboardState = game.getGameboardState();

        const compare = (n1, n2, n3) => {
            if (n1 === n2 && n2 === n3 && n3 === 1) {
                return 1;
            };
            if (n1 === n2 && n2 === n3 && n3 === 2) {
                return 2;
            };
            return 0;
        };

        checkTable = ["012", "345", "678", "036", "147", "258", "048", "246"];
        checkTable.forEach((v, i, a) => {
            checkTableDivided = Array.from(a[i]).map((v) => parseInt(v));
            gameboardIndexed = [];
            checkTableDivided.forEach((v) => gameboardIndexed.push(gameboardState[v]));
            winner = compare(gameboardIndexed[0], gameboardIndexed[1], gameboardIndexed[2])
            switch (winner) {
                case 1: i_parent.stopGame(1); break;
                case 2: i_parent.stopGame(2); break;
                default: break;
            };
        });
    };

    let i = 0;
    play = (pos, playerNumber) => {
        if (pos === 10) {
            declareWinner(playerNumber);
            i = 9;
        } else {
            if (i < 8) {
                gameObj.changeGameboardState(pos, playerNumber);
                checkGame();
                i++;
            }
            if (i === 8) {
                declareWinner(3);
            }
        }
    };

    declareWinner = (playerNumber) => {
        if (playerNumber === 3) {
            console.log("tie");
        } else {
            console.log(playerNumber + " is the winner");
        }

    };

    return {play};
})(game);

const player1 = (function(gameStatusObj) {
    const play = (pos) => {
        if (game.getGameboardState()[pos] === 0) {
            gameStatus.play(pos, 1);
        }
        console.log(pos);
    };

    return {play};
})(gameStatus);

const player2 = (function(gameStatusObj) {
    const play = (pos) => {
        if (game.getGameboardState()[pos] === 0) {
            gameStatus.play(pos, 2);
        }
        console.log(pos);
    };

    return {play};
})(gameStatus);

player1.play(8);
player2.play(1);
player1.play(4);
player2.play(0);
player1.play(6);
player2.play(2);
player1.play(5);
player2.play(3);
