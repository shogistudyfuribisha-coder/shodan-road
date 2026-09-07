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
    isSuicideDrop,
    isInCheck,
    isLegalMove,
    isLegalDrop,
    canEvadeCheckByMove,
    canEvadeCheckByDrop,
    isCheckmate,
    isUchifuzume,
    getLegalMovesFrom,
    getLegalDrops
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

function isInCheck(board, color) {
    const targetColor = color !== undefined ? color : board.turn;
    return board.isCheck(targetColor);
}

function isLegalMove(board, from, to, promote) {
    return !isSuicideMove(board, from, to, promote);
}
function getLegalMovesFrom(board, from) {
    const piece = board.get(from.x, from.y);

    if (!piece) {
        return [];
    }

    const pseudoMoves = board.getMovesFrom(from.x, from.y);
    const legalMoves = [];

    pseudoMoves.forEach(move => {
        const canMoveWithoutPromotion =
            isLegalMove(
                board,
                from,
                move.to,
                false
            );

        const canMoveWithPromotion =
            isLegalMove(
                board,
                from,
                move.to,
                true
            );

        if (canMoveWithoutPromotion || canMoveWithPromotion) {
            legalMoves.push({
                from: {
                    x: from.x,
                    y: from.y
                },
                to: {
                    x: move.to.x,
                    y: move.to.y
                }
            });
        }
    });

    return legalMoves;
}
function isLegalDrop(board, to, kind, color) {
    if (isSuicideDrop(board, to, kind, color)) {
        return false;
    }
    if (isUchifuzume(board, to, kind, color)) {
        return false;
    }
    return true;
}
function getLegalDrops(board, color) {
    const pseudoDrops = board.getDropsBy(color);

    return pseudoDrops.filter(drop => {
        return isLegalDrop(
            board,
            drop.to,
            drop.kind,
            color
        );
    });
}
function canEvadeCheckByMove(board, from, to, promote) {
    return isLegalMove(board, from, to, promote);
}

function canEvadeCheckByDrop(board, to, kind, color) {
    return isLegalDrop(board, to, kind, color);
}

function isUchifuzume(board, to, kind, color) {
    if (kind !== "FU") {
        return false;
    }

    const targetColor = color !== undefined ? color : board.turn;

    try {
        board.drop(to.x, to.y, kind, targetColor);
    } catch (error) {
        return false;
    }

    // drop後は手番が相手に渡っているため、相手玉の詰みを判定
    const isMate = isCheckmate(board, board.turn);

    board.undrop(to.x, to.y);

    return isMate;
}


function isCheckmate(board, color) {
    const targetColor = color !== undefined ? color : board.turn;
    const originalTurn = board.turn;
    const needRestoreTurn = board.turn !== targetColor;

    if (needRestoreTurn) {
        board.turn = targetColor;
    }

    try {
        // 1. 王手がかかっていなければ詰みではない
        if (!board.isCheck(targetColor)) {
            return false;
        }

        // 2. 盤上の自駒の合法手を探索（1手でも見つかれば詰みではない）
        for (let x = 1; x <= 9; x++) {
            for (let y = 1; y <= 9; y++) {
                const piece = board.get(x, y);
                if (!piece || piece.color !== targetColor) {
                    continue;
                }

                const pseudoMoves = board.getMovesFrom(x, y);
                for (let i = 0; i < pseudoMoves.length; i++) {
                    const move = pseudoMoves[i];
                    if (
                        isLegalMove(board, { x, y }, move.to, false) ||
                        isLegalMove(board, { x, y }, move.to, true)
                    ) {
                        return false;
                    }
                }
            }
        }

        // 3. 持ち駒の合法手（合駒）を探索（1手でも見つかれば詰みではない）
        const pseudoDrops = board.getDropsBy(targetColor);
        for (let i = 0; i < pseudoDrops.length; i++) {
            const drop = pseudoDrops[i];
            if (isLegalDrop(board, drop.to, drop.kind, targetColor)) {
                return false;
            }
        }

        // 4. 王手がかかっており、回避できる合法手が0件のため詰み
        return true;
    } finally {
        if (needRestoreTurn) {
            board.turn = originalTurn;
        }
    }
}


