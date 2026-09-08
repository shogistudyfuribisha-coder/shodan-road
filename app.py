from flask import Flask, render_template
import json

app = Flask(__name__)


def load_questions():
    with open("questions.json", "r", encoding="utf-8") as f:
        return json.load(f)


def load_three_ply_questions():
    with open("questions-3ply.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    questions = load_questions()
    three_ply_questions = load_three_ply_questions()

    return render_template(
        "index.html",
        questions=questions,
        three_ply_questions=three_ply_questions
    )


if __name__ == "__main__":
    app.run(debug=True)