const PIECE_KIND_MAP = {
    "歩": "FU",
    "香": "KY",
    "桂": "KE",
    "銀": "GI",
    "金": "KI",
    "角": "KA",
    "飛": "HI",
    "玉": "OU",
    "と": "TO",
    "成香": "NY",
    "成桂": "NK",
    "成銀": "NG",
    "馬": "UM",
    "龍": "RY"
};

const PIECE_NAME_MAP = {
    "FU": "歩",
    "KY": "香",
    "KE": "桂",
    "GI": "銀",
    "KI": "金",
    "KA": "角",
    "HI": "飛",
    "OU": "玉",
    "TO": "と",
    "NY": "成香",
    "NK": "成桂",
    "NG": "成銀",
    "UM": "馬",
    "RY": "龍"
};

function questionBoardToShogi(row, col) {
    return {
        x: 9 - col,
        y: row + 1
    };
}

function shogiToQuestionBoard(x, y) {
    return {
        row: y - 1,
        col: 9 - x
    };
}

function ownerToColor(owner, ShogiAPI) {
    return owner === "S"
        ? ShogiAPI.Color.Black
        : ShogiAPI.Color.White;
}

function createShogiBoard(question, ShogiAPI) {
    const board = new ShogiAPI.Shogi();

    board.editMode(true);

    clearShogiBoard(board);
    setupBoardPieces(board, question, ShogiAPI);
    setupHands(board, question, ShogiAPI);
    setupTurn(board, question, ShogiAPI);

    board.editMode(false);

    return board;
}

function clearShogiBoard(board) {
    for (let y = 1; y <= 9; y++) {
        for (let x = 1; x <= 9; x++) {
            board.set(x, y, null);
        }
    }
}

function setupBoardPieces(board, question, ShogiAPI) {
    question.board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (!piece) {
                return;
            }

            const owner = piece.charAt(0);
            const pieceName = piece.slice(1);
            const kind = PIECE_KIND_MAP[pieceName];

            if (!kind) {
                throw new Error(`未対応の駒: ${pieceName}`);
            }

            const { x, y } =
                questionBoardToShogi(rowIndex, colIndex);

            const color =
                ownerToColor(owner, ShogiAPI);

            const csa =
                color === ShogiAPI.Color.Black
                    ? `+${kind}`
                    : `-${kind}`;

            board.set(
                x,
                y,
                new ShogiAPI.Piece(csa)
            );
        });
    });
}

function setupHands(board, question, ShogiAPI) {
    setupHand(
        board,
        question.hand.先手,
        ShogiAPI.Color.Black,
        ShogiAPI
    );

    setupHand(
        board,
        question.hand.後手,
        ShogiAPI.Color.White,
        ShogiAPI
    );
}

function setupHand(board, pieces, color, ShogiAPI) {
    pieces.forEach(pieceName => {
        const kind = PIECE_KIND_MAP[pieceName];

        if (!kind) {
            throw new Error(`未対応の駒: ${pieceName}`);
        }

        const csa =
            color === ShogiAPI.Color.Black
                ? `+${kind}`
                : `-${kind}`;

        board.pushToHand(
            new ShogiAPI.Piece(csa)
        );
    });
}

function setupTurn(board, question, ShogiAPI) {
    const move = question.move;

    if (move.from_hand) {
        const owner = move.piece.charAt(0);

        board.setTurn(
            ownerToColor(owner, ShogiAPI)
        );

        return;
    }

    const [file, rank] = move.from;

    const { row, col } =
        shogiToQuestionBoard(file, rank);

    const piece = question.board[row][col];

    if (!piece) {
        throw new Error(
            `移動元に駒がありません: ${file}${rank}`
        );
    }

    const owner = piece.charAt(0);

    board.setTurn(
        ownerToColor(owner, ShogiAPI)
    );
}

function executeCorrectMove(board, move, ShogiAPI) {
    if (move.from_hand) {
        dropPiece(board, move, ShogiAPI);
    } else {
        movePiece(board, move);
    }
}

function dropPiece(board, move, ShogiAPI) {
    const [file, rank] = move.to;

    const pieceName = move.piece.slice(1);
    const kind = PIECE_KIND_MAP[pieceName];

    if (!kind) {
        throw new Error(
            `未対応の駒: ${pieceName}`
        );
    }

    const owner = move.piece.charAt(0);
    const color = ownerToColor(owner, ShogiAPI);

    board.drop(
        file,
        rank,
        kind,
        color
    );
}

function movePiece(board, move) {
    const [fromFile, fromRank] = move.from;
    const [toFile, toRank] = move.to;

    board.move(
        fromFile,
        fromRank,
        toFile,
        toRank,
        move.promote || false
    );
}

const shogiBoard = {
    PIECE_KIND_MAP,
    PIECE_NAME_MAP,
    questionBoardToShogi,
    shogiToQuestionBoard,
    ownerToColor,
    createShogiBoard,
    executeCorrectMove
};

if (typeof module !== "undefined") {
    module.exports = shogiBoard;
} else {
    globalThis.shogiBoard = shogiBoard;
}