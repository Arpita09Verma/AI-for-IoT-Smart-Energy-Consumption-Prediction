#!/usr/bin/env python3
"""
AI for IoT - Smart Energy Consumption Prediction
Backend API Server & Application Host

Provides RESTful API endpoints for the trained LSTM model (lstm_model.keras),
running live inference and multi-step electricity demand forecasting in physical Watts (W),
while serving the React dashboard application with SPA routing.
"""

import os
import sys
import json
import csv
from datetime import datetime, timezone

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS

from AI_IoT_Project.inference import EnergyForecaster

app = Flask(__name__, static_folder=None)
CORS(app)

PORT = int(os.environ.get("PORT", 8000))
HOST = os.environ.get("HOST", "127.0.0.1")

# Initialize the trained LSTM inference forecaster
forecaster = EnergyForecaster.get_instance()

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def api_health():
    """Health check endpoint confirming model status and telemetry connectivity."""
    meta = forecaster.get_model_metadata()
    return jsonify({
        "status": "historical",
        "service": "AI for IoT Smart Energy Consumption Forecasting API",
        "telemetry_status": "Historical Mode — Trained on PZEM-004T Data",
        "model_name": meta["model_name"],
        "parameters": meta["total_parameters"],
        "lookback_minutes": meta["lookback_minutes"],
        "unit": meta["forecast_unit"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/api/model/info", methods=["GET"])
def api_model_info():
    """Returns deep neural network architecture and training metadata."""
    try:
        meta = forecaster.get_model_metadata()
        return jsonify(meta)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/metrics", methods=["GET"])
def api_metrics():
    """Returns model evaluation metrics (MAE, RMSE, R2, bias, error statistics)."""
    try:
        metrics = forecaster.evaluation_metrics
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/forecast", methods=["GET"])
def api_forecast():
    """
    Generates dynamic multi-step electricity demand forecast using the live trained LSTM model.
    Query parameters:
      - steps: Forecast horizon in minutes (default: 60, min: 1, max: 180)
    """
    try:
        steps_arg = request.args.get("steps", default=60, type=int)
        steps = max(1, min(180, steps_arg))
        
        forecast_records = forecaster.generate_future_forecast(steps=steps)
        
        return jsonify({
            "status": "success",
            "model": "LSTM_Power_Forecaster",
            "unit": "W",
            "lookback_minutes": 30,
            "forecast_horizon_minutes": steps,
            "predictions_count": len(forecast_records),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "future_forecast": forecast_records
        })
    except Exception as e:
        app.logger.error(f"Forecast generation failed: {e}")
        return jsonify({"error": f"Forecast generation failed: {str(e)}"}), 500

@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Runs one-step power demand prediction on an input sequence (shape: 30 timesteps x 5 features).
    Accepts JSON body:
      {
        "sequence": [[v, i, f, pf, p], ... 30 items]
      }
    """
    try:
        body = request.get_json(force=True, silent=True)
        if not body or "sequence" not in body:
            return jsonify({"error": "Request body must contain 'sequence' key with 30 timesteps x 5 features."}), 400
        
        seq = body["sequence"]
        if len(seq) != 30:
            return jsonify({"error": f"Input sequence must contain exactly 30 timesteps (received {len(seq)})."}), 400
        
        preds = forecaster.predict_sequence(seq)
        
        return jsonify({
            "status": "success",
            "model": "LSTM_Power_Forecaster",
            "unit": "Watts (W)",
            "predicted_power_w": round(float(preds[0]), 2),
            "predicted_at": datetime.now(timezone.utc).isoformat()
        })
    except Exception as e:
        app.logger.error(f"Prediction failed: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/api/feed", methods=["GET"])
def api_feed():
    """
    Comprehensive live dashboard feed:
    Combines live LSTM future forecast with evaluation metrics and recent test predictions.
    """
    try:
        steps = request.args.get("steps", default=60, type=int)
        live_forecast = forecaster.generate_future_forecast(steps=steps)
        
        # Load recent test predictions and methodology notes from results
        results_json_path = os.path.join(BASE_DIR, "AI_IoT_Project", "results", "forecast_data.json")
        recent_preds = []
        methodology = {}
        if os.path.exists(results_json_path):
            with open(results_json_path, "r") as f:
                saved_data = json.load(f)
                recent_preds = saved_data.get("recent_test_predictions", [])
                methodology = saved_data.get("methodology_notes", {})

        payload = {
            "project": "AI for IoT Smart Energy Consumption Prediction",
            "model": "LSTM_Power_Forecaster",
            "target": "power",
            "unit": "W",
            "lookback_minutes": 30,
            "forecast_horizon_minutes": steps,
            "evaluation_metrics": forecaster.evaluation_metrics,
            "recent_test_predictions": recent_preds,
            "future_forecast_60min": live_forecast,
            "methodology_notes": methodology,
            "server_timestamp": datetime.now(timezone.utc).isoformat()
        }
        return jsonify(payload)
    except Exception as e:
        app.logger.error(f"Feed generation failed: {e}")
        return jsonify({"error": f"Feed generation failed: {str(e)}"}), 500

@app.route("/api/historical", methods=["GET"])
def api_historical():
    """
    Returns paginated authentic test predictions from test_predictions.csv.
    Query parameters:
      - offset: starting row index (default: 0)
      - limit: number of rows (default: 100, max: 1000)
    """
    try:
        offset = request.args.get("offset", default=0, type=int)
        limit = min(1000, request.args.get("limit", default=100, type=int))
        
        csv_path = os.path.join(BASE_DIR, "AI_IoT_Project", "results", "test_predictions.csv")
        if not os.path.exists(csv_path):
            return jsonify({"error": "test_predictions.csv not found."}), 404
        
        rows = []
        total_rows = 0
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for idx, r in enumerate(reader):
                total_rows += 1
                if idx >= offset and len(rows) < limit:
                    rows.append({
                        "index": idx + 1,
                        "timestamp": r["timestamp"],
                        "actual_power_w": float(r["actual_power_w"]),
                        "predicted_power_w": float(r["predicted_power_w"]),
                        "error_w": float(r["error_w"])
                    })
                    
        return jsonify({
            "total_rows": total_rows,
            "offset": offset,
            "limit": limit,
            "records": rows
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------------------------
# Static Assets & SPA Client-Side Routing
# ---------------------------------------------------------------------------

@app.route("/frontend/<path:filename>")
def serve_frontend_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, "frontend"), filename)

@app.route("/AI_IoT_Project/<path:filename>")
def serve_project_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, "AI_IoT_Project"), filename)

@app.route("/components/<path:filename>")
def serve_components_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, "components"), filename)

# SPA Routes: Every valid frontend page route serves index.html
SPA_ROUTES = [
    "/",
    "/dashboard",
    "/forecast",
    "/analytics",
    "/model-performance",
    "/performance",
    "/historical",
    "/error-analysis",
    "/methodology"
]

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    # Check if exact static file exists in root (e.g. index.html, favicon.ico)
    full_path = os.path.join(BASE_DIR, path)
    if path and os.path.isfile(full_path):
        return send_from_directory(BASE_DIR, path)
    
    # SPA Page Routes
    return send_file(os.path.join(BASE_DIR, "index.html"))

# ---------------------------------------------------------------------------
# Server Launcher
# ---------------------------------------------------------------------------

def run_server():
    print("=" * 70)
    print(" AI FOR IOT SMART ENERGY CONSUMPTION PREDICTION")
    print(" Backend & LSTM Prediction Server")
    print("=" * 70)
    print(f" * Server running on: http://{HOST}:{PORT}/")
    print(f" * API Health:        http://{HOST}:{PORT}/api/health")
    print(f" * Live Forecast API: http://{HOST}:{PORT}/api/forecast?steps=60")
    print(f" * Model Info API:    http://{HOST}:{PORT}/api/model/info")
    print(f" * Metrics API:       http://{HOST}:{PORT}/api/metrics")
    print(" Available Dashboard Routes:")
    print(f"   - Overview:        http://{HOST}:{PORT}/dashboard")
    print(f"   - Forecast:        http://{HOST}:{PORT}/forecast")
    print(f"   - Performance:     http://{HOST}:{PORT}/analytics")
    print(f"   - Historical Data: http://{HOST}:{PORT}/historical")
    print(f"   - Error Analysis:  http://{HOST}:{PORT}/error-analysis")
    print(f"   - Methodology:     http://{HOST}:{PORT}/methodology")
    print("=" * 70)
    
    app.run(host=HOST, port=PORT, debug=False, threaded=True)

if __name__ == "__main__":
    run_server()
