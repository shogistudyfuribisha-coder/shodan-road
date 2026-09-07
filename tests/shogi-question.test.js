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

describe("王手中の合法手・王手回避 (canEvadeCheck & isLegalMove)", () => {
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

    test("isInCheck: 王手されている局面とされていない局面を正しく判定できる", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 王手
        board.setTurn(Color.Black);
        board.editMode(false);

        expect(shogiQuestion.isInCheck(board, Color.Black)).toBe(true);
        expect(shogiQuestion.isInCheck(board)).toBe(true);

        // 王手を防ぐ合駒を置く
        board.editMode(true);
        board.set(5, 5, new Piece("+KI"));
        board.editMode(false);

        expect(shogiQuestion.isInCheck(board, Color.Black)).toBe(false);
    });

    test("王手回避 1: 玉を安全なマスへ逃がす手は合法手として許可される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 5筋からの王手
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5九の玉を4九に逃がす（安全）
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 4, y: 9 }, false)
        ).toBe(true);
        expect(
            shogiQuestion.canEvadeCheckByMove(board, { x: 5, y: 9 }, { x: 4, y: 9 }, false)
        ).toBe(true);

        // 5九の玉を6八に逃がす（安全）
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 6, y: 8 }, false)
        ).toBe(true);
    });

    test("王手回避 1: 玉が逃げた先も相手駒の利きがある場合は拒否される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 5筋からの王手
        board.set(4, 7, new Piece("-FU")); // 4八に歩の利きがある
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5九の玉を4八に逃がそうとするが、相手の歩の利きがあるため自殺手
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 4, y: 8 }, false)
        ).toBe(false);
    });

    test("王手回避 2: 王手している相手駒を取る手は合法手として許可される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 8, new Piece("-KI")); // 5八の金が至近距離で王手
        board.set(6, 7, new Piece("+GI")); // 6七の銀が5八に利いている
        board.setTurn(Color.Black);
        board.editMode(false);

        // 6七の銀で王手駒（5八金）を取る
        expect(
            shogiQuestion.isLegalMove(board, { x: 6, y: 7 }, { x: 5, y: 8 }, false)
        ).toBe(true);

        // 5九の玉で王手駒（5八金）を取る
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 5, y: 8 }, false)
        ).toBe(true);
    });

    test("王手回避 2: 王手している駒を取っても相手のヒモが付いている場合は拒否される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 8, new Piece("-KI")); // 5八金で王手
        board.set(5, 1, new Piece("-HI")); // 5八金に5一飛車のヒモが付いている
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5九の玉で5八金を取ると、直後に飛車で取られるため自殺手（拒否）
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 5, y: 8 }, false)
        ).toBe(false);
    });

    test("王手回避 3: 盤上の駒を移動させて合駒とする手は合法手として許可される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 5筋の王手
        board.set(6, 6, new Piece("+GI")); // 6六の銀
        board.setTurn(Color.Black);
        board.editMode(false);

        // 6六の銀を5五に移動させて王手の射線を遮断する（移動合）
        expect(
            shogiQuestion.isLegalMove(board, { x: 6, y: 6 }, { x: 5, y: 5 }, false)
        ).toBe(true);
    });

    test("王手回避 3: 持ち駒を打って合駒とする手は合法手として許可される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 5筋の王手
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5八〜5二のどこかに歩を打って王手を遮断する（打ち合駒）
        expect(
            shogiQuestion.isLegalDrop(board, { x: 5, y: 7 }, "FU", Color.Black)
        ).toBe(true);
        expect(
            shogiQuestion.canEvadeCheckByDrop(board, { x: 5, y: 7 }, "FU", Color.Black)
        ).toBe(true);
    });

    test("王手を解除できない他の駒の着手は拒否される", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(5, 1, new Piece("-HI")); // 5筋の王手
        board.set(1, 7, new Piece("+FU")); // 無関係な1筋の歩
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 1七の歩を1六に突く（王手放置）
        expect(
            shogiQuestion.isLegalMove(board, { x: 1, y: 7 }, { x: 1, y: 6 }, false)
        ).toBe(false);

        // 2五に歩を打つ（王手放置）
        expect(
            shogiQuestion.isLegalDrop(board, { x: 2, y: 5 }, "FU", Color.Black)
        ).toBe(false);
    });

    test("通常の王手されていない局面では、従来どおり合法手を指せる", () => {
        const board = createEmptyBoard();
        board.set(5, 9, new Piece("+OU"));
        board.set(7, 7, new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 平穏時の歩突き（7七 -> 7六）
        expect(
            shogiQuestion.isLegalMove(board, { x: 7, y: 7 }, { x: 7, y: 6 }, false)
        ).toBe(true);

        // 平穏時の玉移動（5九 -> 5八）
        expect(
            shogiQuestion.isLegalMove(board, { x: 5, y: 9 }, { x: 5, y: 8 }, false)
        ).toBe(true);
    });
});

describe("詰み判定 (isCheckmate)", () => {
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

    test("1. 王手されているが逃げ道がある局面は詰みではない", () => {
        const board = createEmptyBoard();
        // 5一後手玉に対し、4二から金が王手（5一玉は6一や6二に逃げられる）
        board.set(5, 1, new Piece("-OU"));
        board.set(4, 2, new Piece("+KI"));
        board.set(4, 3, new Piece("+FU")); // 金のヒモ
        board.setTurn(Color.White);
        board.editMode(false);

        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(false);
    });

    test("2. 王手駒を取れる局面は詰みではない", () => {
        const board = createEmptyBoard();
        // 5一後手玉に対し、5二にヒモのない金が王手（玉で金を取れる）
        board.set(5, 1, new Piece("-OU"));
        board.set(5, 2, new Piece("+KI"));
        board.setTurn(Color.White);
        board.editMode(false);

        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(false);
    });

    test("3. 合駒できる局面は詰みではない", () => {
        const board = createEmptyBoard();
        // 5一後手玉に対し、5九から飛車が王手。後手に持ち駒「歩」がある（合駒可能）
        board.set(5, 1, new Piece("-OU"));
        board.set(5, 9, new Piece("+HI"));
        board.pushToHand(new Piece("-FU"));
        board.setTurn(Color.White);
        board.editMode(false);

        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(false);
    });

    test("4. 王手されていて合法手がない局面は詰みと判定される", () => {
        const board = createEmptyBoard();
        // 頭金の詰み: 後手玉 5一、先手金 5二、先手歩 5三（金のヒモ）
        // 5一玉は金を取れず（5三歩のヒモ）、周囲のマス（4一, 6一, 4二, 5二, 6二）もすべて金の利き
        board.set(5, 1, new Piece("-OU"));
        board.set(5, 2, new Piece("+KI"));
        board.set(5, 3, new Piece("+FU"));
        board.setTurn(Color.White);
        board.editMode(false);

        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(true);
    });

    test("5. 王手されていない平穏な局面は詰みではない", () => {
        const board = createEmptyBoard();
        board.set(5, 1, new Piece("-OU"));
        board.set(5, 9, new Piece("+OU"));
        board.setTurn(Color.White);
        board.editMode(false);

        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(false);
    });

    test("手番と異なる側の玉の詰み判定も、手番を乱さずに正しく判定できる", () => {
        const board = createEmptyBoard();
        board.set(5, 1, new Piece("-OU"));
        board.set(5, 2, new Piece("+KI"));
        board.set(5, 3, new Piece("+FU"));
        board.setTurn(Color.Black); // 先手手番のまま
        board.editMode(false);

        // 先手手番のまま後手玉（Color.White）の詰みを判定
        expect(shogiQuestion.isCheckmate(board, Color.White)).toBe(true);
        // 判定後も先手手番が維持されていること
        expect(board.turn).toBe(Color.Black);
    });
});

describe("打ち歩詰め (isUchifuzume)", () => {
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

    test("1. 打った歩が王手にならない場合は合法（打ち歩詰めではない）", () => {
        const board = createEmptyBoard();
        board.set(5, 1, new Piece("-OU"));
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 5五に歩を打つ（王手にならない）
        expect(shogiQuestion.isUchifuzume(board, { x: 5, y: 5 }, "FU", Color.Black)).toBe(false);
        expect(shogiQuestion.isLegalDrop(board, { x: 5, y: 5 }, "FU", Color.Black)).toBe(true);
    });

    test("2. 打った歩が王手になるが相手に回避手がある場合は合法（打ち歩詰めではない）", () => {
        const board = createEmptyBoard();
        // 1一後手玉、2一後手歩（逃げ道を塞ぐ壁）。
        // 先手が1二に歩を打つが、1三にヒモがないため、1一玉が1二歩を取れる
        board.set(1, 1, new Piece("-OU"));
        board.set(2, 1, new Piece("-FU"));
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        expect(shogiQuestion.isUchifuzume(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(false);
        expect(shogiQuestion.isLegalDrop(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(true);
    });

    test("3. 打った歩で詰みになる場合は不合法（打ち歩詰め）", () => {
        const board = createEmptyBoard();
        // 1一後手玉、2一後手歩、1三先手と金（1二にヒモ＋2二を封鎖）。
        // 先手が1二に歩を打つと、後手玉は逃げ場がなく歩も取れず詰みとなる。
        board.set(1, 1, new Piece("-OU"));
        board.set(2, 1, new Piece("-FU"));
        board.set(1, 3, new Piece("+TO"));
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        expect(shogiQuestion.isUchifuzume(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(true);
        expect(shogiQuestion.isLegalDrop(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(false);
    });

    test("4. 二歩とは独立して判定される（二歩の筋への歩打ちは打ち歩詰めではない）", () => {
        const board = createEmptyBoard();
        // 1一後手玉、1三に先手歩（同筋に歩がある二歩の状態）
        board.set(1, 1, new Piece("-OU"));
        board.set(1, 3, new Piece("+FU"));
        board.pushToHand(new Piece("+FU"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 二歩のマスへの歩打ちは、打ち歩詰め（isUchifuzume）ではなく false
        expect(shogiQuestion.isUchifuzume(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(false);
        // しかし二歩のため合法的（isLegalDrop）でもない
        expect(shogiQuestion.isLegalDrop(board, { x: 1, y: 2 }, "FU", Color.Black)).toBe(false);
    });

    test("5. 歩以外の駒（金など）で同じ局面で打って詰ませる場合は合法（打ち歩詰めではない）", () => {
        const board = createEmptyBoard();
        board.set(1, 1, new Piece("-OU"));
        board.set(2, 1, new Piece("-FU"));
        board.set(1, 3, new Piece("+TO"));
        board.pushToHand(new Piece("+KI"));
        board.setTurn(Color.Black);
        board.editMode(false);

        // 金を打って詰ませるのは「頭金」であり合法（打ち歩詰めではない）
        expect(shogiQuestion.isUchifuzume(board, { x: 1, y: 2 }, "KI", Color.Black)).toBe(false);
        expect(shogiQuestion.isLegalDrop(board, { x: 1, y: 2 }, "KI", Color.Black)).toBe(true);
    });
});
});


