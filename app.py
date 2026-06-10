from flask import Flask, render_template, jsonify
import json, pathlib

app = Flask(__name__)
app.json.sort_keys = False
ROOT = pathlib.Path(__file__).parent

@app.route("/")
def index():
    return render_template("setview.html")

@app.route("/data.json")
def data():
    data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
