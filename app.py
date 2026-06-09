from flask import Flask, send_from_directory, jsonify
import json, pathlib

app = Flask(__name__)
ROOT = pathlib.Path(__file__).parent
DATA = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))

@app.route("/")
def index():
    return send_from_directory(ROOT, "setview.html")

@app.route("/data.json")
def data():
    return jsonify(DATA)

if __name__ == "__main__":
    app.run(debug=True)
