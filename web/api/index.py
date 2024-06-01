import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

from preparation import strata_test_set

final_model_reloaded = joblib.load("./api/california_housing_model.pkl")

app = Flask(__name__)


@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    input_features = np.array(data['features'])
    dp = pd.DataFrame([input_features], columns=strata_test_set.columns.tolist())
    predictions = final_model_reloaded.predict(dp)
    return jsonify({"prediction": predictions.tolist()[0]})


if __name__ == '__main__':
    app.run(debug=True)
