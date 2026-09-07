import { describe, test, expect } from "vitest";
import { Shogi, Color, Piece } from "shogi.js";
import questions from "../questions.json";
import shogiBoard from "../static/shogi-board.js";
import shogiQuestion from "../static/shogi-question.js";

describe("shogi.js", () => {

    test("盤面を作成して駒を配置できる", () => {
        const board = new Shogi();

        board.editMode(true);

        board.set(
            5,
            5,
            new Piece("+FU")
        );

        board.editMode(false);

        const piece = board.get(5, 5);

        expect(piece).not.toBeNull();
        expect(piece.kind).toBe("FU");
        expect(piece.color).toBe(Color.Black);
    });

    test("20問すべての盤面をshogi.jsで再現できる", () => {
        questions.forEach(question => {

            const board =
                shogiBoard.createShogiBoard(
                    question,
                    { Shogi, Color, Piece }
                );

            question.board.forEach((row, rowIndex) => {
                row.forEach((piece, colIndex) => {

                    const { x, y } =
                        shogiBoard.questionBoardToShogi(
                            rowIndex,
                            colIndex
                        );

                    const actual = board.get(x, y);

                    if (!piece) {
                        expect(actual).toBeNull();
                        return;
                    }

                    const owner = piece.charAt(0);
                    const pieceName = piece.slice(1);

                    expect(actual).not.toBeNull();

                    expect(actual.kind).toBe(
                        shogiBoard.PIECE_KIND_MAP[pieceName]
                    );

                    expect(actual.color).toBe(
                        shogiBoard.ownerToColor(
                            owner,
                            { Color }
                        )
                    );
                });
            });
        });
    });

    test("20問すべての正解手をshogi.jsで実行できる", () => {
        questions.forEach(question => {

            const board =
                shogiBoard.createShogiBoard(
                    question,
                    { Shogi, Color, Piece }
                );

            expect(() => {
                shogiBoard.executeCorrectMove(
                    board,
                    question.move,
                    { Shogi, Color, Piece }
                );
            }).not.toThrow();
        });
    });

    test("20問すべての正解手を実行した後の盤面が正しい", () => {
        questions.forEach(question => {

            const board =
                shogiBoard.createShogiBoard(
                    question,
                    { Shogi, Color, Piece }
                );

            const move = question.move;

            let expectedKind;
            let expectedColor;

            if (move.from_hand) {
                const owner = move.piece.charAt(0);
                const pieceName = move.piece.slice(1);

                expectedKind =
                    shogiBoard.PIECE_KIND_MAP[pieceName];

                expectedColor =
                    shogiBoard.ownerToColor(
                        owner,
                        { Color }
                    );
            } else {
                const [fromFile, fromRank] = move.from;

                const movingPiece =
                    board.get(fromFile, fromRank);

                expect(movingPiece).not.toBeNull();

                expectedKind = movingPiece.kind;
                expectedColor = movingPiece.color;
            }

            shogiBoard.executeCorrectMove(
                board,
                move,
                { Shogi, Color, Piece }
            );

            const [toFile, toRank] = move.to;
            const actual = board.get(toFile, toRank);

            expect(actual).not.toBeNull();

            expect(actual.kind).toBe(expectedKind);
            expect(actual.color).toBe(expectedColor);

            if (!move.from_hand) {
                const [fromFile, fromRank] = move.from;

                expect(
                    board.get(fromFile, fromRank)
                ).toBeNull();
            }
        });
    });

    test("成りを指定した着手が正しく実行される", () => {
        const board = new Shogi();

        board.editMode(true);

        // 7四に先手の歩を配置
        board.set(
            7,
            4,
            new Piece("+FU")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        const move = {
            from: [7, 4],
            to: [7, 3],
            promote: true
        };

        shogiBoard.executeCorrectMove(
            board,
            move,
            { Shogi, Color, Piece }
        );

        const piece = board.get(7, 3);

        expect(piece).not.toBeNull();
        expect(piece.kind).toBe("TO");
        expect(piece.color).toBe(Color.Black);

        expect(
            board.get(7, 4)
        ).toBeNull();
    });

    test("不成を指定した着手では駒が成らない", () => {
        const board = new Shogi();

        board.editMode(true);

        // 7四に先手の歩を配置
        board.set(
            7,
            4,
            new Piece("+FU")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        const move = {
            from: [7, 4],
            to: [7, 3],
            promote: false
        };

        shogiBoard.executeCorrectMove(
            board,
            move,
            { Shogi, Color, Piece }
        );

        const piece = board.get(7, 3);

        expect(piece).not.toBeNull();
        expect(piece.kind).toBe("FU");
        expect(piece.color).toBe(Color.Black);

        expect(
            board.get(7, 4)
        ).toBeNull();
    });

    test("持ち駒から駒を打てる", () => {
        const board = new Shogi();

        board.editMode(true);

        board.pushToHand(
            new Piece("+KI")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        expect(
            board.get(5, 2)
        ).toBeNull();

        board.drop(
            5,
            2,
            "KI",
            Color.Black
        );

        const piece = board.get(5, 2);

        expect(piece).not.toBeNull();
        expect(piece.kind).toBe("KI");
        expect(piece.color).toBe(Color.Black);
    });

    test("持ち駒から駒を打つと持ち駒が1枚減る", () => {
        const board = new Shogi();

        board.editMode(true);

        board.pushToHand(
            new Piece("+KI")
        );

        board.pushToHand(
            new Piece("+KI")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        expect(
            board.hands[Color.Black]
        ).toHaveLength(2);

        board.drop(
            5,
            2,
            "KI",
            Color.Black
        );

        expect(
            board.hands[Color.Black]
        ).toHaveLength(1);

        expect(
            board.get(5, 2).kind
        ).toBe("KI");
    });

    test("持ち駒を打った後の盤面と持ち駒が正しい", () => {
        const board = new Shogi();

        board.editMode(true);

        board.pushToHand(
            new Piece("+KI")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        board.drop(
            5,
            5,
            "KI",
            Color.Black
        );

        const piece = board.get(5, 5);

        expect(piece).not.toBeNull();
        expect(piece.kind).toBe("KI");
        expect(piece.color).toBe(Color.Black);

        expect(
            board.hands[Color.Black]
        ).toHaveLength(0);
    });

    test("不正な持ち駒の打ち方はエラーになる", () => {
        const board = new Shogi();

        board.editMode(true);

        // 5五に先手の歩を配置
        board.set(
            5,
            5,
            new Piece("+FU")
        );

        board.pushToHand(
            new Piece("+FU")
        );

        board.setTurn(Color.Black);

        board.editMode(false);

        expect(() => {
            // すでに駒がある5五には打てない
            board.drop(
                5,
                5,
                "FU",
                Color.Black
            );
        }).toThrow();
    });

    test("盤上の正しい着手を正解と判定できる", () => {
        const userMove = {
            from: {
                x: 6,
                y: 9
            },
            to: {
                x: 7,
                y: 8
            },
            promote: false
        };

        const correctMove = {
            from: [6, 9],
            to: [7, 8]
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(true);
    });

    test("盤上の移動先が違えば不正解になる", () => {
        const userMove = {
            from: {
                x: 6,
                y: 9
            },
            to: {
                x: 6,
                y: 8
            },
            promote: false
        };

        const correctMove = {
            from: [6, 9],
            to: [7, 8]
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(false);
    });

    test("成る・成らないが違えば不正解になる", () => {
        const userMove = {
            from: {
                x: 7,
                y: 4
            },
            to: {
                x: 7,
                y: 3
            },
            promote: false
        };

        const correctMove = {
            from: [7, 4],
            to: [7, 3],
            promote: true
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(false);
    });

    test("正しい駒打ちを正解と判定できる", () => {
        const userMove = {
            from_hand: true,
            piece: "S金",
            to: {
                x: 5,
                y: 2
            }
        };

        const correctMove = {
            from_hand: true,
            piece: "S金",
            to: [5, 2]
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(true);
    });

    test("駒の種類が違う駒打ちは不正解になる", () => {
        const userMove = {
            from_hand: true,
            piece: "S銀",
            to: {
                x: 5,
                y: 2
            }
        };

        const correctMove = {
            from_hand: true,
            piece: "S金",
            to: [5, 2]
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(false);
    });

    test("駒打ちの場所が違えば不正解になる", () => {
        const userMove = {
            from_hand: true,
            piece: "S金",
            to: {
                x: 4,
                y: 2
            }
        };

        const correctMove = {
            from_hand: true,
            piece: "S金",
            to: [5, 2]
        };

        expect(
            shogiQuestion.isCorrectMove(userMove, correctMove)
        ).toBe(false);
    });
});