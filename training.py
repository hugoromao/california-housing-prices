import numpy as np
from scipy.stats import randint
import joblib

from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import RandomizedSearchCV

from preparation import preprocessing, strata_test_set, housing_train, housing_train_labels

np.random.seed(42)

full_pipeline = Pipeline([
    ("preprocessing", preprocessing),
    ("random_forest", RandomForestRegressor(random_state=42)),
])

param_distribs = {'preprocessing__geo__n_clusters': randint(low=3, high=50),
                  'random_forest__max_features': randint(low=2, high=20)}

rnd_search = RandomizedSearchCV(
    full_pipeline, param_distributions=param_distribs, n_iter=10, cv=3,
    scoring='neg_root_mean_squared_error', random_state=42)

rnd_search.fit(housing_train, housing_train_labels)

final_model = rnd_search.best_estimator_

X_test = strata_test_set.drop("median_house_value", axis=1)
y_test = strata_test_set["median_house_value"].copy()

final_predictions = final_model.predict(X_test)
final_rmse = root_mean_squared_error(y_test, final_predictions)
print(f'RMSE: {final_rmse}')

joblib.dump(final_model, "california_housing_model.pkl")
