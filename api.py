import gdown
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

from preparation import strata_test_set

gdown.download("https://drive.google.com/uc?export=download&id=1-x7_xFR2u2J39c-acnhZ1u4Xz6fv_fpS", "california_housing_model.pkl", quiet=False)

final_model_reloaded = joblib.load("california_housing_model.pkl")

app = Flask(__name__)
CORS(app)

@app.route("/")
def hw():
    return "Hugo Romão California housing price regressor"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    input_features = np.array(data['features'])
    dp = pd.DataFrame([input_features], columns=strata_test_set.columns.tolist())
    predictions = final_model_reloaded.predict(dp)
    return jsonify({"prediction": predictions.tolist()[0]})


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)

