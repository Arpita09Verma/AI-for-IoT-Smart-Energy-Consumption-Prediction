"""
AI for IoT - Smart Energy Consumption Prediction
Inference & Prediction Pipeline

This module encapsulates the trained LSTM model (lstm_model.keras),
feature scalers (feature_scaler.pkl, target_scaler.pkl), and test dataset
to generate real-time inferences and forward multi-step forecasts in physical Watts (W).
"""

import os
import json
import joblib
import numpy as np
import tensorflow as tf
from datetime import datetime, timezone, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(SCRIPT_DIR, "models")
DATA_DIR = os.path.join(SCRIPT_DIR, "data", "processed")
RESULTS_DIR = os.path.join(SCRIPT_DIR, "results")

class EnergyForecaster:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.model_path = os.path.join(MODELS_DIR, "lstm_model.keras")
        self.feature_scaler_path = os.path.join(MODELS_DIR, "feature_scaler.pkl")
        self.target_scaler_path = os.path.join(MODELS_DIR, "target_scaler.pkl")
        self.training_meta_path = os.path.join(MODELS_DIR, "training_metadata.json")
        self.eval_metrics_path = os.path.join(RESULTS_DIR, "evaluation_metrics.json")
        self.forecast_json_path = os.path.join(RESULTS_DIR, "forecast_data.json")
        self.test_data_path = os.path.join(DATA_DIR, "X_test.npy")
        self.timestamps_path = os.path.join(DATA_DIR, "test_timestamps.json")

        self.model = None
        self.feature_scaler = None
        self.target_scaler = None
        self.training_metadata = {}
        self.evaluation_metrics = {}
        self.test_timestamps = []
        self._X_test_cache = None

        self._load_artifacts()

    def _load_artifacts(self):
        print(f"[EnergyForecaster] Loading trained LSTM model from {self.model_path}...")
        self.model = tf.keras.models.load_model(self.model_path)
        print(f"[EnergyForecaster] Model loaded successfully. Input shape: {self.model.input_shape}")

        if os.path.exists(self.feature_scaler_path):
            self.feature_scaler = joblib.load(self.feature_scaler_path)
        if os.path.exists(self.target_scaler_path):
            self.target_scaler = joblib.load(self.target_scaler_path)

        if os.path.exists(self.training_meta_path):
            with open(self.training_meta_path, "r") as f:
                self.training_metadata = json.load(f)

        if os.path.exists(self.eval_metrics_path):
            with open(self.eval_metrics_path, "r") as f:
                self.evaluation_metrics = json.load(f)

        if os.path.exists(self.timestamps_path):
            with open(self.timestamps_path, "r") as f:
                self.test_timestamps = json.load(f)

    def get_test_sequences(self):
        if self._X_test_cache is None and os.path.exists(self.test_data_path):
            self._X_test_cache = np.load(self.test_data_path)
        return self._X_test_cache

    def predict_sequence(self, sequence_30x5):
        """
        Runs one-step prediction on an input sequence of shape (30, 5) or (N, 30, 5).
        Input values must be either raw (will be scaled) or scaled.
        Returns predicted active power demand in Watts (W).
        """
        arr = np.array(sequence_30x5, dtype=np.float32)
        if arr.ndim == 2:
            arr = np.expand_dims(arr, axis=0) # shape (1, 30, 5)

        preds_scaled = self.model.predict(arr, verbose=0) # shape (N, 1)
        preds_watts = self.target_scaler.inverse_transform(preds_scaled).flatten()
        return preds_watts.tolist()

    def generate_future_forecast(self, steps=60, start_sequence=None, start_time_iso=None):
        """
        Generates recursive multi-step autoregressive future forecast.
        If start_sequence is None, uses the latest sequence from X_test.
        Returns list of predictions with timestamps and steps.
        """
        if start_sequence is None:
            X_test = self.get_test_sequences()
            if X_test is not None and len(X_test) > 0:
                current_window = X_test[-1:].copy() # shape (1, 30, 5)
            else:
                raise ValueError("No start sequence provided and X_test unavailable.")
        else:
            arr = np.array(start_sequence, dtype=np.float32)
            if arr.ndim == 2:
                arr = np.expand_dims(arr, axis=0)
            current_window = arr.copy()

        if start_time_iso:
            try:
                base_time = datetime.fromisoformat(start_time_iso.replace("Z", "+00:00"))
            except Exception:
                base_time = datetime.now(timezone.utc)
        elif self.test_timestamps and len(self.test_timestamps) > 0:
            last_ts_str = self.test_timestamps[-1]
            try:
                base_time = datetime.fromisoformat(last_ts_str.replace("Z", "+00:00"))
            except Exception:
                base_time = datetime.now(timezone.utc)
        else:
            base_time = datetime.now(timezone.utc)

        # Baseline exogenous features (mean of latest window features 0..3: voltage, current, freq, pf)
        exogenous_baseline_scaled = current_window[0, :, :4].mean(axis=0)

        future_records = []
        for step in range(steps):
            pred_step_scaled = self.model.predict(current_window, verbose=0)[0, 0]
            step_watts = float(self.target_scaler.inverse_transform([[pred_step_scaled]])[0, 0])
            
            step_time = base_time + timedelta(minutes=step + 1)
            future_records.append({
                "step": step + 1,
                "horizon_minute": step + 1,
                "timestamp": step_time.isoformat(),
                "forecast_power_w": round(step_watts, 2)
            })

            # Roll sliding window forward: append [exogenous_baseline (4), pred_step (1)]
            next_step_feature = np.zeros((1, 1, 5), dtype=np.float32)
            next_step_feature[0, 0, :4] = exogenous_baseline_scaled
            next_step_feature[0, 0, 4] = pred_step_scaled
            current_window = np.concatenate([current_window[:, 1:, :], next_step_feature], axis=1)

        return future_records

    def get_model_metadata(self):
        """Returns comprehensive model metadata and metrics."""
        return {
            "model_name": "LSTM_Power_Forecaster",
            "framework": f"TensorFlow {tf.__version__}",
            "input_shape": list(self.model.input_shape),
            "output_shape": list(self.model.output_shape),
            "total_parameters": int(self.model.count_params()),
            "lookback_minutes": 30,
            "forecast_unit": "Watts (W)",
            "features": [
                "voltage (V rms)",
                "current (A rms)",
                "frequency (Hz)",
                "pf (power factor)",
                "power (W)"
            ],
            "evaluation_metrics": self.evaluation_metrics,
            "training_summary": {
                "optimizer": self.training_metadata.get("optimizer", "Adam"),
                "learning_rate": self.training_metadata.get("learning_rate", 0.001),
                "actual_epochs_trained": self.training_metadata.get("actual_epochs_trained", 50),
                "best_epoch": self.training_metadata.get("best_epoch", 45),
                "training_duration_seconds": self.training_metadata.get("training_duration_seconds", 0)
            }
        }
