from flask import Flask, render_template
import json

app = Flask(__name__)


def load_questions():
    with open("questions.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    questions = load_questions()
    return render_template("index.html", questions=questions)


if __name__ == "__main__":
    app.run(debug=True)