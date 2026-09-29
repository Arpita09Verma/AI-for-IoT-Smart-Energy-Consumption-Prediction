"""
AI for IoT - Smart Energy Consumption Prediction
Part 2: LSTM Model Training Script

Objective:
Forecast electricity demand by predicting next 1-minute active power (Watts)
from 30 consecutive 1-minute electrical measurements across 5 features:
1. voltage (V rms)
2. current (A rms)
3. frequency (Hz)
4. pf (power factor)
5. power (W)
"""

import os
import json
import time
import joblib
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Input, LSTM, Dropout, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Define paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(SCRIPT_DIR, "AI_IoT_Project")
DATA_DIR = os.path.join(PROJECT_DIR, "data", "processed")
MODELS_DIR = os.path.join(PROJECT_DIR, "models")
RESULTS_DIR = os.path.join(PROJECT_DIR, "results")
os.makedirs(RESULTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

def main():
    print("=" * 60)
    print("1. LOADING PREPARED DATASETS")
    print("=" * 60)
    X_train_path = os.path.join(DATA_DIR, "X_train.npy")
    y_train_path = os.path.join(DATA_DIR, "y_train.npy")
    X_test_path = os.path.join(DATA_DIR, "X_test.npy")
    y_test_path = os.path.join(DATA_DIR, "y_test.npy")
    metadata_path = os.path.join(DATA_DIR, "sequence_metadata.json")
    target_scaler_path = os.path.join(MODELS_DIR, "target_scaler.pkl")

    X_train = np.load(X_train_path)
    y_train = np.load(y_train_path)
    X_test = np.load(X_test_path)
    y_test = np.load(y_test_path)

    with open(metadata_path, "r") as f:
        seq_meta = json.load(f)

    print(f"X_train shape: {X_train.shape} (dtype: {X_train.dtype})")
    print(f"y_train shape: {y_train.shape} (dtype: {y_train.dtype})")
    print(f"X_test shape:  {X_test.shape}  (dtype: {X_test.dtype})")
    print(f"y_test shape:  {y_test.shape}  (dtype: {y_test.dtype})")
    print(f"NaN count in X_train: {np.isnan(X_train).sum()}")
    print(f"NaN count in y_train: {np.isnan(y_train).sum()}")
    print(f"Features: {seq_meta.get('feature_names')}")
    print(f"Target:   {seq_meta.get('target_name')}")
    print(f"Lookback: {seq_meta.get('lookback')} timesteps")

    print("\n" + "=" * 60)
    print("2. CHRONOLOGICAL VALIDATION SPLIT (NO SHUFFLE)")
    print("=" * 60)
    val_ratio = 0.10
    val_size = int(len(X_train) * val_ratio)
    X_tr, y_tr = X_train[:-val_size], y_train[:-val_size]
    X_val, y_val = X_train[-val_size:], y_train[-val_size:]

    print(f"Total training pool sequences: {len(X_train):,}")
    print(f"Chronological train set: {X_tr.shape[0]:,} sequences (shape: {X_tr.shape})")
    print(f"Chronological val set:   {X_val.shape[0]:,} sequences (shape: {X_val.shape})")
    print(f"Test set (untouched):    {X_test.shape[0]:,} sequences (shape: {X_test.shape})")

    print("\n" + "=" * 60)
    print("3. BUILDING LSTM MODEL ARCHITECTURE")
    print("=" * 60)
    model = Sequential([
        Input(shape=(30, 5), name="input_sequence"),
        LSTM(64, return_sequences=True, name="lstm_layer_1"),
        Dropout(0.2, name="dropout_1"),
        LSTM(32, return_sequences=False, name="lstm_layer_2"),
        Dropout(0.2, name="dropout_2"),
        Dense(16, activation="relu", name="dense_layer_1"),
        Dense(1, activation=None, name="output_power")
    ], name="LSTM_Power_Forecaster")

    optimizer = Adam(learning_rate=0.001)
    model.compile(optimizer=optimizer, loss="mse", metrics=["mae", "mse"])
    model.summary()

    print("\n" + "=" * 60)
    print("4. TRAINING MODEL WITH EARLY STOPPING & REDUCE LR")
    print("=" * 60)
    early_stopping = EarlyStopping(
        monitor="val_loss",
        patience=7,
        restore_best_weights=True,
        verbose=1
    )

    reduce_lr = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=3,
        min_lr=1e-5,
        verbose=1
    )

    start_time = time.time()
    history = model.fit(
        X_tr, y_tr,
        validation_data=(X_val, y_val),
        epochs=50,
        batch_size=128,
        shuffle=False,
        callbacks=[early_stopping, reduce_lr],
        verbose=1
    )
    training_duration = time.time() - start_time
    epochs_trained = len(history.history["loss"])
    best_epoch = int(np.argmin(history.history["val_loss"]))

    print(f"\nTraining completed in {training_duration:.2f} seconds across {epochs_trained} epochs.")
    print(f"Best epoch: {best_epoch + 1}")
    print(f"Best Validation Loss (MSE): {history.history['val_loss'][best_epoch]:.6f}")
    print(f"Best Validation MAE:        {history.history['val_mae'][best_epoch]:.6f}")
    print(f"Final Train Loss (MSE):     {history.history['loss'][best_epoch]:.6f}")
    print(f"Final Train MAE:            {history.history['mae'][best_epoch]:.6f}")

    print("\n" + "=" * 60)
    print("5. SAVING TRAINED MODEL")
    print("=" * 60)
    saved_model_path = os.path.join(MODELS_DIR, "lstm_model.keras")
    model.save(saved_model_path)
    print(f"Model successfully saved to: {saved_model_path}")
    print(f"Saved model file size: {os.path.getsize(saved_model_path):,} bytes")

    print("\n" + "=" * 60)
    print("6. GENERATING AND SAVING TRAINING HISTORY PLOTS")
    print("=" * 60)
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    epochs_range = range(1, epochs_trained + 1)

    # Plot 1: Loss (MSE)
    fig_loss, ax_loss = plt.subplots(figsize=(9, 5), dpi=300)
    ax_loss.plot(epochs_range, history.history["loss"], label="Train Loss (MSE)", color="#1f77b4", lw=2, marker='o', markersize=4)
    ax_loss.plot(epochs_range, history.history["val_loss"], label="Val Loss (MSE)", color="#ff7f0e", lw=2, marker='s', markersize=4)
    ax_loss.axvline(best_epoch + 1, color="#2ca02c", linestyle="--", lw=1.5, label=f"Best Epoch ({best_epoch + 1})")
    ax_loss.set_title("LSTM Model Training & Validation Loss (MSE)", fontsize=13, fontweight="bold", pad=12)
    ax_loss.set_xlabel("Epoch", fontsize=11)
    ax_loss.set_ylabel("Mean Squared Error (Scaled)", fontsize=11)
    ax_loss.legend(frameon=True, facecolor="white", edgecolor="#cccccc", fontsize=10)
    ax_loss.grid(True, linestyle=":", alpha=0.6)
    plt.tight_layout()
    loss_plot_path = os.path.join(RESULTS_DIR, "training_loss.png")
    fig_loss.savefig(loss_plot_path, dpi=300)
    plt.close(fig_loss)
    print(f"Saved Loss plot to: {loss_plot_path}")

    # Plot 2: MAE
    fig_mae, ax_mae = plt.subplots(figsize=(9, 5), dpi=300)
    ax_mae.plot(epochs_range, history.history["mae"], label="Train MAE", color="#2b5c8f", lw=2, marker='o', markersize=4)
    ax_mae.plot(epochs_range, history.history["val_mae"], label="Val MAE", color="#d95f02", lw=2, marker='s', markersize=4)
    ax_mae.axvline(best_epoch + 1, color="#2ca02c", linestyle="--", lw=1.5, label=f"Best Epoch ({best_epoch + 1})")
    ax_mae.set_title("LSTM Model Training & Validation MAE", fontsize=13, fontweight="bold", pad=12)
    ax_mae.set_xlabel("Epoch", fontsize=11)
    ax_mae.set_ylabel("Mean Absolute Error (Scaled)", fontsize=11)
    ax_mae.legend(frameon=True, facecolor="white", edgecolor="#cccccc", fontsize=10)
    ax_mae.grid(True, linestyle=":", alpha=0.6)
    plt.tight_layout()
    mae_plot_path = os.path.join(RESULTS_DIR, "training_mae.png")
    fig_mae.savefig(mae_plot_path, dpi=300)
    plt.close(fig_mae)
    print(f"Saved MAE plot to: {mae_plot_path}")

    print("\n" + "=" * 60)
    print("7. SAVING TRAINING METADATA")
    print("=" * 60)
    training_metadata = {
        "model_name": "LSTM_Power_Forecaster",
        "architecture": [
            {"layer": "Input", "shape": [30, 5]},
            {"layer": "LSTM", "units": 64, "return_sequences": True},
            {"layer": "Dropout", "rate": 0.2},
            {"layer": "LSTM", "units": 32, "return_sequences": False},
            {"layer": "Dropout", "rate": 0.2},
            {"layer": "Dense", "units": 16, "activation": "relu"},
            {"layer": "Dense", "units": 1, "activation": "linear"}
        ],
        "total_parameters": int(model.count_params()),
        "input_shape": [30, 5],
        "lookback": 30,
        "num_features": 5,
        "feature_names": seq_meta.get("feature_names"),
        "target": "power (W)",
        "batch_size": 128,
        "max_epochs": 50,
        "actual_epochs_trained": epochs_trained,
        "best_epoch": best_epoch + 1,
        "optimizer": "Adam",
        "learning_rate": 0.001,
        "loss_function": "Mean Squared Error (MSE)",
        "metrics": ["mae", "mse"],
        "training_sequence_count": int(X_tr.shape[0]),
        "validation_sequence_count": int(X_val.shape[0]),
        "test_sequence_count_untouched": int(X_test.shape[0]),
        "early_stopping_triggered": bool(epochs_trained < 50),
        "early_stopping_patience": 7,
        "reduce_lr_patience": 3,
        "training_duration_seconds": round(training_duration, 2),
        "final_train_loss": float(history.history["loss"][best_epoch]),
        "final_val_loss": float(history.history["val_loss"][best_epoch]),
        "final_train_mae": float(history.history["mae"][best_epoch]),
        "final_val_mae": float(history.history["val_mae"][best_epoch]),
        "training_completion_status": "COMPLETED_SUCCESSFULLY",
        "history": {k: [float(v) for v in vals] for k, vals in history.history.items()}
    }

    meta_save_path = os.path.join(MODELS_DIR, "training_metadata.json")
    with open(meta_save_path, "w") as f:
        json.dump(training_metadata, f, indent=2)
    print(f"Training metadata saved to: {meta_save_path}")

    print("\n" + "=" * 60)
    print("8. MODEL SANITY CHECK & VERIFICATION")
    print("=" * 60)
    reloaded_model = load_model(saved_model_path)
    sample_inputs = X_val[:10]
    sample_targets = y_val[:10]
    sample_preds = reloaded_model.predict(sample_inputs, verbose=0)

    assert sample_preds.shape == (10, 1)
    assert not np.isnan(sample_preds).any()
    assert not np.isinf(sample_preds).any()

    target_scaler = joblib.load(target_scaler_path)
    sample_preds_watts = target_scaler.inverse_transform(sample_preds)
    sample_actual_watts = target_scaler.inverse_transform(sample_targets)

    print("Sample Predictions (First 5 validation samples):")
    for i in range(5):
        print(f"  Sample {i+1}: Actual = {sample_actual_watts[i, 0]:.2f} W | Predicted = {sample_preds_watts[i, 0]:.2f} W | Diff = {abs(sample_actual_watts[i, 0] - sample_preds_watts[i, 0]):.2f} W")

    print("\n" + "=" * 60)
    print("SANITY CHECK PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()
