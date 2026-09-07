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
});
