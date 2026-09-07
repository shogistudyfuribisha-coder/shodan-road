import { describe, test, expect } from "vitest";
import { Shogi, Color, Piece } from "shogi.js";
import shogiQuestion from "../static/shogi-question.js";

const ShogiAPI = {
  Color,
};

describe("canPromote", () => {
  test("先手の駒が敵陣に入る場合、成れる", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("+FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 3, ShogiAPI, board)).toBe(true);
  });

  test("先手の駒が敵陣外に移動する場合、成れない", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("+FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 4, ShogiAPI, board)).toBe(false);
  });
  test("後手の駒が敵陣に入る場合、成れる", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("-FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 7, ShogiAPI, board)).toBe(true);
  });

  test("後手の駒が敵陣外に移動する場合、成れない", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("-FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 6, ShogiAPI, board)).toBe(false);
  });
  test("先手の駒が敵陣から出る場合、成れる", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 3, new Piece("+FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 3, 5, 4, ShogiAPI, board)).toBe(true);
  });

  test("後手の駒が敵陣から出る場合、成れる", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 7, new Piece("-FU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 7, 5, 6, ShogiAPI, board)).toBe(true);
  });
  test("金は成れない", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("+KI"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 3, ShogiAPI, board)).toBe(false);
  });

  test("玉は成れない", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("+OU"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 3, ShogiAPI, board)).toBe(false);
  });

  test("すでに成っている歩はさらに成れない", () => {
    const board = new Shogi();

    board.editMode(true);

    board.set(5, 5, new Piece("+TO"));

    board.editMode(false);

    expect(shogiQuestion.canPromote(5, 5, 5, 3, ShogiAPI, board)).toBe(false);
  });
  test("歩・香・桂・銀・角・飛は敵陣で成れる", () => {
    const promotableKinds = ["FU", "KY", "KE", "GI", "KA", "HI"];

    promotableKinds.forEach((kind) => {
      const board = new Shogi();

      board.editMode(true);

      board.set(5, 5, new Piece(`+${kind}`));

      board.editMode(false);

      expect(shogiQuestion.canPromote(5, 5, 5, 3, ShogiAPI, board)).toBe(true);
    });
  });
  describe("isCorrectMove", () => {
    test("盤上の正しい着手に対して駒打ちをすると不正解になる", () => {
      const correctMove = {
        from: [5, 5],
        to: [5, 4],
      };

      const userMove = {
        from_hand: true,
        piece: "S歩",
        to: {
          x: 5,
          y: 4,
        },
      };

      expect(shogiQuestion.isCorrectMove(userMove, correctMove)).toBe(false);
    });

    test("正しい駒打ちに対して盤上の移動をすると不正解になる", () => {
      const correctMove = {
        from_hand: true,
        piece: "S金",
        to: [5, 2],
      };

      const userMove = {
        from: {
          x: 5,
          y: 3,
        },
        to: {
          x: 5,
          y: 2,
        },
        promote: false,
      };

      expect(shogiQuestion.isCorrectMove(userMove, correctMove)).toBe(false);
    });
  });
  describe("canSelectPiece", () => {
    test("自分の駒は選択できる", () => {
      const piece = new Piece("+FU");

      expect(shogiQuestion.canSelectPiece(piece, Color.Black, ShogiAPI)).toBe(
        true,
      );
    });

    test("相手の駒は選択できない", () => {
      const piece = new Piece("-FU");

      expect(shogiQuestion.canSelectPiece(piece, Color.Black, ShogiAPI)).toBe(
        false,
      );
    });

    test("駒がないマスは選択できない", () => {
      expect(shogiQuestion.canSelectPiece(null, Color.Black, ShogiAPI)).toBe(
        false,
      );
    });
  });
  describe("mustPromote", () => {

    test("先手の歩が1段目に入る場合、必ず成る", () => {
        const board = new Shogi();

        board.editMode(true);

        board.set(
            5,
            2,
            new Piece("+FU")
        );

        board.editMode(false);

        expect(
            shogiQuestion.mustPromote(
                5,
                2,
                5,
                1,
                ShogiAPI,
                board
            )
        ).toBe(true);
    });

    test("先手の歩が2段目に入る場合、必ず成る", () => {
        const board = new Shogi();

        board.editMode(true);

        board.set(
            5,
            3,
            new Piece("+FU")
        );

        board.editMode(false);

        expect(
            shogiQuestion.mustPromote(
                5,
                3,
                5,
                2,
                ShogiAPI,
                board
            )
        ).toBe(false);
    });

    test("先手の桂馬が2段目に入る場合、必ず成る", () => {
        const board = new Shogi();

        board.editMode(true);

        board.set(
            5,
            4,
            new Piece("+KE")
        );

        board.editMode(false);

        expect(
            shogiQuestion.mustPromote(
                5,
                4,
                6,
                2,
                ShogiAPI,
                board
            )
        ).toBe(true);
    });

    test("金は必ず成る対象ではない", () => {
        const board = new Shogi();

        board.editMode(true);

        board.set(
            5,
            5,
            new Piece("+KI")
        );

        board.editMode(false);

        expect(
            shogiQuestion.mustPromote(
                5,
                5,
                5,
                4,
                ShogiAPI,
                board
            )
        ).toBe(false);
    });

});

describe("isSuicideMove & isSuicideDrop (自殺手・王手放置の禁止)", () => {
    function createEmptyBoard() {
        const board = new Shogi();
        board.editMode(true);
        for (let y = 1; y <= 9; y++) {
            for (let x = 1; x <= 9; x++) {
                board.set(x, y, null);
            }
        }
        return board;
    }

    test("玉が相手の利きがあるマスに移動しようとすると自殺手（true）と判定される", () => {
        const board = createEmptyBoard();
        board.set(7, 9, new Piece("+OU"));
        board.set(8, 2, new Piece("-HI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 7九の玉を8筋（8九）に動かすと相手飛車の利きに入る
        expect(
            shogiQuestion.isSuicideMove(board, { x: 7, y: 9 }, { x: 8, y: 9 }, false)
        ).toBe(true);
    });

    test("玉が安全なマスに移動する場合は自殺手ではない（false）と判定される", () => {
        const board = createEmptyBoard();
        board.set(7, 9, new Piece("+OU"));
        board.set(8, 2, new Piece("-HI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 7九の玉を7八に動かすのは安全
        expect(
            shogiQuestion.isSuicideMove(board, { x: 7, y: 9 }, { x: 7, y: 8 }, false)
        ).toBe(false);
    });

    test("ピンされている駒を横に動かすと自殺手（true）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 7, new Piece("+KI"));
        board.set(5, 1, new Piece("-HI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5七の金を4七に横移動すると後ろの玉が飛車に取られる
        expect(
            shogiQuestion.isSuicideMove(board, { x: 5, y: 7 }, { x: 4, y: 7 }, false)
        ).toBe(true);
    });

    test("ピンされている駒を射線上前方に動かす手は安全（false）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 7, new Piece("+KI"));
        board.set(5, 1, new Piece("-HI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5七の金を5六に前進させるのは射線を防ぎ続けるため安全
        expect(
            shogiQuestion.isSuicideMove(board, { x: 5, y: 7 }, { x: 5, y: 6 }, false)
        ).toBe(false);
    });

    test("王手をかけられている時、王手と無関係な駒を動かす手は自殺手（true）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 王手
        board.set(1, 7, new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 1七の歩を1六に動かす手は王手放置なので自殺手
        expect(
            shogiQuestion.isSuicideMove(board, { x: 1, y: 7 }, { x: 1, y: 6 }, false)
        ).toBe(true);
    });

    test("王手をかけられている時、王手している相手駒を取る手は安全（false）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 8, new Piece("-KI")); // 至近距離で王手
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5九の玉で5八の金を取る手は王手解除なので安全
        expect(
            shogiQuestion.isSuicideMove(board, { x: 5, y: 9 }, { x: 5, y: 8 }, false)
        ).toBe(false);
    });

    test("王手されている時に、合駒として王手を遮断する持ち駒打ちは安全（false）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 王手
        board.pushToHand(new Piece("+KI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5五に金を打って合駒にする手は安全
        expect(
            shogiQuestion.isSuicideDrop(board, { x: 5, y: 5 }, "KI", Color.Black)
        ).toBe(false);
    });

    test("王手されている時に、王手を防げないマスへの持ち駒打ちは自殺手（true）と判定される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 王手
        board.pushToHand(new Piece("+KI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 1五に金を打つ手は王手放置なので自殺手
        expect(
            shogiQuestion.isSuicideDrop(board, { x: 1, y: 5 }, "KI", Color.Black)
        ).toBe(true);
    });

    test("判定後も盤面の状態・持ち駒・手番が完全に元に戻っていること", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI"));
        board.pushToHand(new Piece("+KI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        shogiQuestion.isSuicideDrop(board, { x: 5, y: 5 }, "KI", Color.Black);
        shogiQuestion.isSuicideDrop(board, { x: 1, y: 5 }, "KI", Color.Black);

        expect(board.get(5, 9)?.kind).toBe("OU");
        expect(board.get(5, 1)?.kind).toBe("HI");
        expect(board.get(5, 5)).toBeNull();
        expect(board.get(1, 5)).toBeNull();
        expect(board.hands[Color.Black]).toHaveLength(1);
        expect(board.turn).toBe(Color.Black);
    });
});
});

