from flask import Flask, render_template, jsonify
import json, pathlib

app = Flask(__name__)
ROOT = pathlib.Path(__file__).parent
DATA = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))

@app.route("/")
def index():
    return render_template("setview.html")

@app.route("/data.json")
def data():
    return jsonify(DATA)

if __name__ == "__main__":
    app.run(debug=True)
