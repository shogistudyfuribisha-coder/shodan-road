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
    isCorrectMove
};

if (typeof module !== "undefined") {
    module.exports = shogiQuestion;
} else {
    globalThis.shogiQuestion = shogiQuestion;
}