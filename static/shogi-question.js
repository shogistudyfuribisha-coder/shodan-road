function isCorrectMove(userMove, correctMove) {
    if (correctMove.from_hand) {
        if (!userMove.from_hand) {
            return false;
        }

        return (
            userMove.piece === correctMove.piece &&
            userMove.to.x === correctMove.to[0] &&
            userMove.to.y === correctMove.to[1]
        );
    }

    if (userMove.from_hand) {
        return false;
    }

    return (
        userMove.from.x === correctMove.from[0] &&
        userMove.from.y === correctMove.from[1] &&
        userMove.to.x === correctMove.to[0] &&
        userMove.to.y === correctMove.to[1] &&
        userMove.promote === (correctMove.promote || false)
    );
}

const shogiQuestion = {
    isCorrectMove,
    canPromote,
    canSelectPiece
};

if (typeof module !== "undefined") {
    module.exports = shogiQuestion;
} else {
    globalThis.shogiQuestion = shogiQuestion;
}

function canSelectPiece(piece, turn, ShogiAPI) {
    if (!piece) {
        return false;
    }

    return piece.color === turn;
}

function canPromote(
    fromX,
    fromY,
    toX,
    toY,
    ShogiAPI,
    board
) {
    const piece = board.get(fromX, fromY);

    if (!piece) {
        return false;
    }

    const promotableKinds = [
        "FU",
        "KY",
        "KE",
        "GI",
        "KA",
        "HI"
    ];

    if (!promotableKinds.includes(piece.kind)) {
        return false;
    }

    const promotedKinds = [
        "TO",
        "NY",
        "NK",
        "NG",
        "UM",
        "RY"
    ];

    if (promotedKinds.includes(piece.kind)) {
        return false;
    }

    const enemyZone =
        piece.color === ShogiAPI.Color.Black
            ? toY <= 3
            : toY >= 7;

    const fromEnemyZone =
        piece.color === ShogiAPI.Color.Black
            ? fromY <= 3
            : fromY >= 7;

    return enemyZone || fromEnemyZone;
}