# AI for IoT - Smart Energy Consumption Prediction Project

## Project Overview
This project develops an end-to-end deep learning pipeline to **forecast electricity demand** (active power in Watts) for IoT smart energy monitoring systems using real PZEM + ESP32 high-resolution electrical telemetry.

## Project Structure & Roadmap

### Part 1: Data Preprocessing and Sequence Preparation
- **Notebook:** `notebooks/01_data_preprocessing.ipynb`
- **Objective:** Timestamp conversion to UTC, sampling gap segmentation, robust feature standardization with `StandardScaler` (fitted strictly on training data), and chronological sliding-window generation.
- **Output Artifacts:**
  - `data/processed/X_train.npy` (110,678 sequences, 30 lookback, 5 features)
  - `data/processed/y_train.npy` (110,678 targets)
  - `data/processed/X_test.npy` (27,714 sequences, 30 lookback, 5 features)
  - `data/processed/y_test.npy` (27,714 targets)
  - `models/feature_scaler.pkl` & `models/target_scaler.pkl`
  - `data/processed/sequence_metadata.json`

### Part 2: LSTM Model Training
- **Notebook:** `notebooks/02_lstm_training.ipynb`
- **Objective:** Build, compile, and train a recurrent LSTM neural network for next 1-minute power demand prediction using chronological validation.
- **Model Architecture:**
  - Input: `(30, 5)` (30 historical 1-minute steps across voltage, current, frequency, power factor, power)
  - LSTM(64, return_sequences=True) + Dropout(0.2)
  - LSTM(32, return_sequences=False) + Dropout(0.2)
  - Dense(16, activation='relu') + Dense(1, activation=linear)
  - Total parameters: 30,881 (Trainable: 30,881)
- **Validation Strategy:** Non-shuffled chronological split (90% train = 99,611 sequences; 10% validation = 11,067 sequences) to preserve causality and prevent lookahead data leakage. Test set (27,714 sequences) left completely untouched.
- **Training Results:** Early stopping triggered at Epoch 21 with best weights restored from Epoch 14 (Val Loss MSE: 0.245853, Val MAE: 0.061955).
- **Output Artifacts:**
  - `models/lstm_model.keras` (Best trained model weights)
  - `models/training_metadata.json` (Hyperparameters and per-epoch convergence logs)
  - `results/training_loss.png` & `results/training_mae.png` (Convergence plots)

### Part 3: Model Evaluation and Electricity-Demand Forecasting
- **Notebook:** `notebooks/03_evaluation.ipynb`
- **Objective:** Evaluate the trained LSTM model on the unseen test dataset (`X_test.npy`, `y_test.npy`), quantify regression accuracy in physical units (Watts), analyze prediction errors, and prepare clean, production-ready forecast artifacts for frontend integration.
- **Evaluation Methodology & Leakage Protection:**
  - The model was evaluated on 27,714 completely unseen chronological test sequences (April 13 – May 3, 2026).
  - Test data was never seen during training or hyperparameter optimization.
  - The `target_scaler` was NOT refitted on test data.
  - Zero data leakage was introduced.
- **Evaluation Metrics (Unscaled, Physical Watts):**
  - **Mean Absolute Error (MAE):** `3.3016 W`
  - **Mean Squared Error (MSE):** `942.9799 W²`
  - **Root Mean Squared Error (RMSE):** `30.7080 W`
  - **Coefficient of Determination (R²):** `0.252099`
  - **Mean Bias Error:** `-0.1490 W` (Virtually zero systematic bias)
- **Test Prediction vs. Future Forecasting:**
  - **Test Predictions (`test_predictions.csv`):** Authentic one-step-ahead (1-minute) predictions where the model receives preceding 30-minute real multivariate sensor telemetry.
  - **Future Forecasting (`future_forecast_60min`):** 60-minute forward autoregressive demonstration beyond test horizon where exogenous variables (voltage, current, frequency, power factor) are held at baseline persistence while active power is recursively fed back.
- **Generated Output Artifacts:**
  - `results/test_predictions.csv` — Full 27,714-row chronological evaluation table (`timestamp`, `actual_power_w`, `predicted_power_w`, `error_w`).
  - `results/evaluation_metrics.json` — Machine-readable evaluation metrics and error spread statistics.
  - `results/forecast_data.json` — Lightweight, dashboard-ready JSON payload with metrics, recent 180-min series, and 60-min forward forecast.
  - `results/FRONTEND_DATA_GUIDE.md` — Complete developer integration manual for dashboard and UI engineers.
  - `results/actual_vs_predicted.png` — Dual-panel time-series tracking plot (high-resolution 3-day window and full test profile).
  - `results/actual_vs_predicted_scatter.png` — Scatter plot with ideal $y = x$ reference line.
  - `results/error_distribution.png` — Residual error distribution histogram and boxplot.
