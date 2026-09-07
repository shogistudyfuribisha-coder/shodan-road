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
    canSelectPiece,
    mustPromote,
    isSuicideMove,
    isSuicideDrop
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

function mustPromote(fromX, fromY, toX, toY, ShogiAPI, board) {
    const piece = board.get(fromX, fromY);

    if (!piece) {
        return false;
    }

    if (piece.kind === "FU" || piece.kind === "KY") {
        return piece.color === ShogiAPI.Color.Black
            ? toY === 1
            : toY === 9;
    }

    if (piece.kind === "KE") {
        return piece.color === ShogiAPI.Color.Black
            ? toY <= 2
            : toY >= 8;
    }

    return false;
}

function isSuicideMove(board, from, to, promote) {
    const movingPiece = board.get(from.x, from.y);
    if (!movingPiece) {
        return true;
    }

    const color = movingPiece.color;
    const targetPiece = board.get(to.x, to.y);
    const captureKind = targetPiece ? targetPiece.kind : undefined;
    const fromKind = movingPiece.kind;

    try {
        board.move(from.x, from.y, to.x, to.y, promote);
    } catch (error) {
        return true;
    }

    const isCheck = board.isCheck(color);
    const afterPiece = board.get(to.x, to.y);
    const didPromote = afterPiece ? (fromKind !== afterPiece.kind) : promote;

    board.unmove(from.x, from.y, to.x, to.y, didPromote, captureKind);

    return isCheck;
}

function isSuicideDrop(board, to, kind, color) {
    try {
        board.drop(to.x, to.y, kind, color);
    } catch (error) {
        return true;
    }

    const isCheck = board.isCheck(color);

    board.undrop(to.x, to.y);

    return isCheck;
}