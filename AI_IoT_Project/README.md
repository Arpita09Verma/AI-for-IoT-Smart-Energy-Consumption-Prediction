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
- **Status:** Upcoming stage
- **Objective:** Evaluate the trained model (`models/lstm_model.keras`) on the untouched test set (`X_test.npy`, `y_test.npy`), compute unscaled physical error metrics (MAE, RMSE, MAPE in Watts), and visualize electricity demand forecasts.
