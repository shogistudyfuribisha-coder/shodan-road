import { describe, test, expect } from "vitest";
import questions from "../questions.json";

describe("questions.json", () => {

    test("20問存在する", () => {
        expect(questions).toHaveLength(21);
    });

    test("すべての問題に必要な項目がある", () => {
        questions.forEach(question => {
            expect(question).toHaveProperty("id");
            expect(question).toHaveProperty("category");
            expect(question).toHaveProperty("question");
            expect(question).toHaveProperty("choices");
            expect(question).toHaveProperty("answer");
            expect(question).toHaveProperty("explanation");
            expect(question).toHaveProperty("board");
            expect(question).toHaveProperty("move");
            expect(question).toHaveProperty("hand");
        });
    });

    test("すべての盤面が9×9である", () => {
        questions.forEach(question => {
            expect(question.board).toHaveLength(9);

            question.board.forEach(row => {
                expect(row).toHaveLength(9);
            });
        });
    });

    test("すべての問題の選択肢が3つある", () => {
        questions.forEach(question => {
            expect(question.choices).toHaveLength(3);
        });
    });

    test("正解番号が選択肢の範囲内である", () => {
        questions.forEach(question => {
            expect(question.answer).toBeGreaterThanOrEqual(0);
            expect(question.answer).toBeLessThan(
                question.choices.length
            );
        });
    });

    test("すべての問題に先手・後手の持ち駒がある", () => {
        questions.forEach(question => {
            expect(question.hand).toHaveProperty("先手");
            expect(question.hand).toHaveProperty("後手");

            expect(Array.isArray(question.hand.先手)).toBe(true);
            expect(Array.isArray(question.hand.後手)).toBe(true);
        });
    });

    test("問題IDが1〜20で重複していない", () => {
        const ids = questions.map(question => question.id);

        expect(new Set(ids).size).toBe(questions.length);
        expect(ids.sort((a, b) => a - b)).toEqual(
            Array.from({ length: 21 }, (_, i) => i + 1)
        );
    });

});