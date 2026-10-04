// Auto-generated embedded fallback data for offline / file:// protocol execution
// Generated strictly from authentic project files: AI_IoT_Project/results/forecast_data.json and AI_IoT_Project/models/training_metadata.json

window.EMBEDDED_FORECAST_DATA = {
  "project": "AI for IoT Smart Energy Consumption Prediction",
  "stage": "Part 3 - Model Evaluation and Electricity Demand Forecast",
  "model": "LSTM_Power_Forecaster",
  "target": "power",
  "unit": "W",
  "lookback_minutes": 30,
  "forecast_horizon_minutes": 60,
  "evaluation_metrics": {
    "model_name": "LSTM_Power_Forecaster",
    "target": "power",
    "target_unit": "W",
    "test_samples": 27714,
    "mae_w": 3.3016,
    "mse_w2": 942.9799,
    "rmse_w": 30.708,
    "r2": 0.252099,
    "error_statistics_w": {
      "mean_error": -0.149,
      "std_error": 30.7076,
      "max_abs_error": 1010.1036,
      "min_error": -714.6592,
      "max_error": 1010.1036
    },
    "data_ranges_w": {
      "actual_min": 16.73,
      "actual_max": 1245.2,
      "actual_mean": 23.43,
      "predicted_min": 10.65,
      "predicted_max": 812.57,
      "predicted_mean": 23.58
    }
  },
  "data_files": {
    "full_test_predictions_csv": "AI_IoT_Project/results/test_predictions.csv",
    "evaluation_metrics_json": "AI_IoT_Project/results/evaluation_metrics.json",
    "frontend_guide": "AI_IoT_Project/results/FRONTEND_DATA_GUIDE.md"
  },
  "recent_test_predictions": [
    {
      "timestamp": "2026-05-02T22:00:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 17.01,
      "error_w": 0.04
    },
    {
      "timestamp": "2026-05-02T22:01:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 16.85,
      "error_w": 0.19
    },
    {
      "timestamp": "2026-05-02T22:02:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 16.79,
      "error_w": 0.46
    },
    {
      "timestamp": "2026-05-02T22:03:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 16.79,
      "error_w": 0.36
    },
    {
      "timestamp": "2026-05-02T22:04:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 16.86,
      "error_w": 0.13
    },
    {
      "timestamp": "2026-05-02T22:05:00+00:00",
      "actual_power_w": 16.95,
      "predicted_power_w": 16.6,
      "error_w": 0.35
    },
    {
      "timestamp": "2026-05-02T22:06:00+00:00",
      "actual_power_w": 16.93,
      "predicted_power_w": 16.07,
      "error_w": 0.86
    },
    {
      "timestamp": "2026-05-02T22:07:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 15.77,
      "error_w": 1.2
    },
    {
      "timestamp": "2026-05-02T22:08:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 15.85,
      "error_w": 1.13
    },
    {
      "timestamp": "2026-05-02T22:09:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 15.98,
      "error_w": 1.07
    },
    {
      "timestamp": "2026-05-02T22:10:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 16.07,
      "error_w": 1.1
    },
    {
      "timestamp": "2026-05-02T22:11:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 16.33,
      "error_w": 0.92
    },
    {
      "timestamp": "2026-05-02T22:12:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.62,
      "error_w": 0.48
    },
    {
      "timestamp": "2026-05-02T22:13:00+00:00",
      "actual_power_w": 16.95,
      "predicted_power_w": 16.68,
      "error_w": 0.27
    },
    {
      "timestamp": "2026-05-02T22:14:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 16.89,
      "error_w": 0.22
    },
    {
      "timestamp": "2026-05-02T22:15:00+00:00",
      "actual_power_w": 17.02,
      "predicted_power_w": 17.24,
      "error_w": -0.22
    },
    {
      "timestamp": "2026-05-02T22:16:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 17.53,
      "error_w": -0.41
    },
    {
      "timestamp": "2026-05-02T22:17:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 17.7,
      "error_w": -0.7
    },
    {
      "timestamp": "2026-05-02T22:18:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.68,
      "error_w": -0.61
    },
    {
      "timestamp": "2026-05-02T22:19:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.52,
      "error_w": -0.45
    },
    {
      "timestamp": "2026-05-02T22:20:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.42,
      "error_w": -0.26
    },
    {
      "timestamp": "2026-05-02T22:21:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 17.27,
      "error_w": -0.04
    },
    {
      "timestamp": "2026-05-02T22:22:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 17.17,
      "error_w": -0.12
    },
    {
      "timestamp": "2026-05-02T22:23:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 17.09,
      "error_w": -0.04
    },
    {
      "timestamp": "2026-05-02T22:24:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 17.02,
      "error_w": 0.1
    },
    {
      "timestamp": "2026-05-02T22:25:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.09,
      "error_w": 0.06
    },
    {
      "timestamp": "2026-05-02T22:26:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 17.27,
      "error_w": -0.17
    },
    {
      "timestamp": "2026-05-02T22:27:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.26,
      "error_w": -0.09
    },
    {
      "timestamp": "2026-05-02T22:28:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.34,
      "error_w": -0.17
    },
    {
      "timestamp": "2026-05-02T22:29:00+00:00",
      "actual_power_w": 17.28,
      "predicted_power_w": 17.4,
      "error_w": -0.12
    },
    {
      "timestamp": "2026-05-02T22:30:00+00:00",
      "actual_power_w": 17.13,
      "predicted_power_w": 17.35,
      "error_w": -0.21
    },
    {
      "timestamp": "2026-05-02T22:31:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.13,
      "error_w": 0.12
    },
    {
      "timestamp": "2026-05-02T22:32:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 17.15,
      "error_w": 0.17
    },
    {
      "timestamp": "2026-05-02T22:33:00+00:00",
      "actual_power_w": 17.35,
      "predicted_power_w": 17.35,
      "error_w": -0.0
    },
    {
      "timestamp": "2026-05-02T22:34:00+00:00",
      "actual_power_w": 17.37,
      "predicted_power_w": 17.55,
      "error_w": -0.18
    },
    {
      "timestamp": "2026-05-02T22:35:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.36,
      "error_w": -0.2
    },
    {
      "timestamp": "2026-05-02T22:36:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.34,
      "error_w": -0.12
    },
    {
      "timestamp": "2026-05-02T22:37:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 17.23,
      "error_w": 0.01
    },
    {
      "timestamp": "2026-05-02T22:38:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.35,
      "error_w": -0.1
    },
    {
      "timestamp": "2026-05-02T22:39:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.52,
      "error_w": -0.27
    },
    {
      "timestamp": "2026-05-02T22:40:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 17.51,
      "error_w": -0.33
    },
    {
      "timestamp": "2026-05-02T22:41:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.51,
      "error_w": -0.3
    },
    {
      "timestamp": "2026-05-02T22:42:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 17.65,
      "error_w": -0.45
    },
    {
      "timestamp": "2026-05-02T22:43:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 17.7,
      "error_w": -0.6
    },
    {
      "timestamp": "2026-05-02T22:44:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.64,
      "error_w": -0.39
    },
    {
      "timestamp": "2026-05-02T22:45:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.57,
      "error_w": -0.42
    },
    {
      "timestamp": "2026-05-02T22:46:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.47,
      "error_w": -0.22
    },
    {
      "timestamp": "2026-05-02T22:47:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 17.37,
      "error_w": -0.06
    },
    {
      "timestamp": "2026-05-02T22:48:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.39,
      "error_w": -0.14
    },
    {
      "timestamp": "2026-05-02T22:49:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 17.42,
      "error_w": -0.22
    },
    {
      "timestamp": "2026-05-02T22:50:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 17.44,
      "error_w": -0.21
    },
    {
      "timestamp": "2026-05-02T22:51:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 17.54,
      "error_w": -0.49
    },
    {
      "timestamp": "2026-05-02T22:52:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.56,
      "error_w": -0.5
    },
    {
      "timestamp": "2026-05-02T22:53:00+00:00",
      "actual_power_w": 17.13,
      "predicted_power_w": 17.59,
      "error_w": -0.46
    },
    {
      "timestamp": "2026-05-02T22:54:00+00:00",
      "actual_power_w": 17.13,
      "predicted_power_w": 17.61,
      "error_w": -0.48
    },
    {
      "timestamp": "2026-05-02T22:55:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 17.46,
      "error_w": -0.15
    },
    {
      "timestamp": "2026-05-02T22:56:00+00:00",
      "actual_power_w": 17.27,
      "predicted_power_w": 17.67,
      "error_w": -0.4
    },
    {
      "timestamp": "2026-05-02T22:57:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.82,
      "error_w": -0.75
    },
    {
      "timestamp": "2026-05-02T22:58:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 17.7,
      "error_w": -0.7
    },
    {
      "timestamp": "2026-05-02T22:59:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 17.58,
      "error_w": -0.61
    },
    {
      "timestamp": "2026-05-02T23:00:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.41,
      "error_w": -0.24
    },
    {
      "timestamp": "2026-05-02T23:01:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 17.2,
      "error_w": -0.21
    },
    {
      "timestamp": "2026-05-02T23:02:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 16.88,
      "error_w": 0.35
    },
    {
      "timestamp": "2026-05-02T23:03:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 16.78,
      "error_w": 0.39
    },
    {
      "timestamp": "2026-05-02T23:04:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 16.44,
      "error_w": 0.59
    },
    {
      "timestamp": "2026-05-02T23:05:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 15.92,
      "error_w": 1.3
    },
    {
      "timestamp": "2026-05-02T23:06:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 16.21,
      "error_w": 0.9
    },
    {
      "timestamp": "2026-05-02T23:07:00+00:00",
      "actual_power_w": 16.88,
      "predicted_power_w": 17.16,
      "error_w": -0.27
    },
    {
      "timestamp": "2026-05-02T23:08:00+00:00",
      "actual_power_w": 16.95,
      "predicted_power_w": 17.02,
      "error_w": -0.07
    },
    {
      "timestamp": "2026-05-02T23:09:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 16.76,
      "error_w": 0.42
    },
    {
      "timestamp": "2026-05-02T23:10:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 16.77,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-02T23:11:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 16.89,
      "error_w": 0.31
    },
    {
      "timestamp": "2026-05-02T23:12:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 17.09,
      "error_w": -0.13
    },
    {
      "timestamp": "2026-05-02T23:13:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.13,
      "error_w": -0.06
    },
    {
      "timestamp": "2026-05-02T23:14:00+00:00",
      "actual_power_w": 17.27,
      "predicted_power_w": 17.01,
      "error_w": 0.25
    },
    {
      "timestamp": "2026-05-02T23:15:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.2,
      "error_w": -0.13
    },
    {
      "timestamp": "2026-05-02T23:16:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 17.23,
      "error_w": -0.2
    },
    {
      "timestamp": "2026-05-02T23:17:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.09,
      "error_w": 0.06
    },
    {
      "timestamp": "2026-05-02T23:18:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 16.9,
      "error_w": 0.32
    },
    {
      "timestamp": "2026-05-02T23:19:00+00:00",
      "actual_power_w": 16.9,
      "predicted_power_w": 16.93,
      "error_w": -0.03
    },
    {
      "timestamp": "2026-05-02T23:20:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 16.69,
      "error_w": 0.56
    },
    {
      "timestamp": "2026-05-02T23:21:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 16.56,
      "error_w": 0.65
    },
    {
      "timestamp": "2026-05-02T23:22:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 16.68,
      "error_w": 0.32
    },
    {
      "timestamp": "2026-05-02T23:23:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 16.6,
      "error_w": 0.52
    },
    {
      "timestamp": "2026-05-02T23:24:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 16.45,
      "error_w": 0.6
    },
    {
      "timestamp": "2026-05-02T23:25:00+00:00",
      "actual_power_w": 16.88,
      "predicted_power_w": 16.6,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-02T23:26:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 16.62,
      "error_w": 0.43
    },
    {
      "timestamp": "2026-05-02T23:27:00+00:00",
      "actual_power_w": 17.13,
      "predicted_power_w": 16.63,
      "error_w": 0.5
    },
    {
      "timestamp": "2026-05-02T23:28:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 16.82,
      "error_w": 0.5
    },
    {
      "timestamp": "2026-05-02T23:29:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 16.91,
      "error_w": 0.21
    },
    {
      "timestamp": "2026-05-02T23:30:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.07,
      "error_w": 0.08
    },
    {
      "timestamp": "2026-05-02T23:31:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.03,
      "error_w": 0.12
    },
    {
      "timestamp": "2026-05-02T23:32:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.25,
      "error_w": -0.04
    },
    {
      "timestamp": "2026-05-02T23:33:00+00:00",
      "actual_power_w": 17.3,
      "predicted_power_w": 17.3,
      "error_w": 0.0
    },
    {
      "timestamp": "2026-05-02T23:34:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.21,
      "error_w": 0.01
    },
    {
      "timestamp": "2026-05-02T23:35:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.5,
      "error_w": -0.29
    },
    {
      "timestamp": "2026-05-02T23:36:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 17.55,
      "error_w": -0.35
    },
    {
      "timestamp": "2026-05-02T23:37:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 17.53,
      "error_w": -0.35
    },
    {
      "timestamp": "2026-05-02T23:38:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 17.61,
      "error_w": -0.38
    },
    {
      "timestamp": "2026-05-02T23:39:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.43,
      "error_w": -0.26
    },
    {
      "timestamp": "2026-05-02T23:40:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 17.36,
      "error_w": -0.17
    },
    {
      "timestamp": "2026-05-02T23:41:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.29,
      "error_w": -0.13
    },
    {
      "timestamp": "2026-05-02T23:42:00+00:00",
      "actual_power_w": 17.08,
      "predicted_power_w": 17.23,
      "error_w": -0.15
    },
    {
      "timestamp": "2026-05-02T23:43:00+00:00",
      "actual_power_w": 17.27,
      "predicted_power_w": 16.99,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-02T23:44:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.94,
      "error_w": 0.16
    },
    {
      "timestamp": "2026-05-02T23:45:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 16.88,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-02T23:46:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.96,
      "error_w": 0.14
    },
    {
      "timestamp": "2026-05-02T23:47:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 17.04,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-02T23:48:00+00:00",
      "actual_power_w": 17.3,
      "predicted_power_w": 17.01,
      "error_w": 0.29
    },
    {
      "timestamp": "2026-05-02T23:49:00+00:00",
      "actual_power_w": 17.13,
      "predicted_power_w": 17.21,
      "error_w": -0.08
    },
    {
      "timestamp": "2026-05-02T23:50:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 17.08,
      "error_w": 0.11
    },
    {
      "timestamp": "2026-05-02T23:51:00+00:00",
      "actual_power_w": 17.08,
      "predicted_power_w": 17.03,
      "error_w": 0.05
    },
    {
      "timestamp": "2026-05-02T23:52:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 17.22,
      "error_w": 0.01
    },
    {
      "timestamp": "2026-05-02T23:53:00+00:00",
      "actual_power_w": 17.28,
      "predicted_power_w": 17.38,
      "error_w": -0.1
    },
    {
      "timestamp": "2026-05-02T23:54:00+00:00",
      "actual_power_w": 17.18,
      "predicted_power_w": 17.44,
      "error_w": -0.26
    },
    {
      "timestamp": "2026-05-02T23:55:00+00:00",
      "actual_power_w": 17.27,
      "predicted_power_w": 17.44,
      "error_w": -0.18
    },
    {
      "timestamp": "2026-05-02T23:56:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 17.51,
      "error_w": -0.41
    },
    {
      "timestamp": "2026-05-02T23:57:00+00:00",
      "actual_power_w": 17.17,
      "predicted_power_w": 17.49,
      "error_w": -0.33
    },
    {
      "timestamp": "2026-05-02T23:58:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 17.42,
      "error_w": -0.2
    },
    {
      "timestamp": "2026-05-02T23:59:00+00:00",
      "actual_power_w": 17.08,
      "predicted_power_w": 17.82,
      "error_w": -0.74
    },
    {
      "timestamp": "2026-05-03T00:00:00+00:00",
      "actual_power_w": 17.08,
      "predicted_power_w": 17.88,
      "error_w": -0.79
    },
    {
      "timestamp": "2026-05-03T00:01:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 17.32,
      "error_w": -0.35
    },
    {
      "timestamp": "2026-05-03T00:02:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 16.77,
      "error_w": 0.43
    },
    {
      "timestamp": "2026-05-03T00:03:00+00:00",
      "actual_power_w": 17.4,
      "predicted_power_w": 16.68,
      "error_w": 0.72
    },
    {
      "timestamp": "2026-05-03T00:04:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 16.64,
      "error_w": 0.43
    },
    {
      "timestamp": "2026-05-03T00:05:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 16.72,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-03T00:06:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 16.55,
      "error_w": 0.42
    },
    {
      "timestamp": "2026-05-03T00:07:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 16.7,
      "error_w": 0.37
    },
    {
      "timestamp": "2026-05-03T00:08:00+00:00",
      "actual_power_w": 17.2,
      "predicted_power_w": 17.03,
      "error_w": 0.17
    },
    {
      "timestamp": "2026-05-03T00:09:00+00:00",
      "actual_power_w": 17.05,
      "predicted_power_w": 16.93,
      "error_w": 0.12
    },
    {
      "timestamp": "2026-05-03T00:10:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 16.77,
      "error_w": 0.34
    },
    {
      "timestamp": "2026-05-03T00:11:00+00:00",
      "actual_power_w": 16.95,
      "predicted_power_w": 16.93,
      "error_w": 0.02
    },
    {
      "timestamp": "2026-05-03T00:12:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.7,
      "error_w": 0.4
    },
    {
      "timestamp": "2026-05-03T00:13:00+00:00",
      "actual_power_w": 17.23,
      "predicted_power_w": 16.98,
      "error_w": 0.25
    },
    {
      "timestamp": "2026-05-03T00:14:00+00:00",
      "actual_power_w": 17.08,
      "predicted_power_w": 17.26,
      "error_w": -0.17
    },
    {
      "timestamp": "2026-05-03T00:15:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 17.34,
      "error_w": -0.31
    },
    {
      "timestamp": "2026-05-03T00:16:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 17.21,
      "error_w": -0.24
    },
    {
      "timestamp": "2026-05-03T00:17:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 16.9,
      "error_w": 0.25
    },
    {
      "timestamp": "2026-05-03T00:18:00+00:00",
      "actual_power_w": 17.28,
      "predicted_power_w": 16.93,
      "error_w": 0.35
    },
    {
      "timestamp": "2026-05-03T00:19:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 16.88,
      "error_w": 0.15
    },
    {
      "timestamp": "2026-05-03T00:20:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 16.41,
      "error_w": 0.57
    },
    {
      "timestamp": "2026-05-03T00:21:00+00:00",
      "actual_power_w": 16.92,
      "predicted_power_w": 16.16,
      "error_w": 0.75
    },
    {
      "timestamp": "2026-05-03T00:22:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 16.27,
      "error_w": 0.8
    },
    {
      "timestamp": "2026-05-03T00:23:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 16.34,
      "error_w": 0.88
    },
    {
      "timestamp": "2026-05-03T00:24:00+00:00",
      "actual_power_w": 17.02,
      "predicted_power_w": 16.82,
      "error_w": 0.19
    },
    {
      "timestamp": "2026-05-03T00:25:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 16.89,
      "error_w": 0.09
    },
    {
      "timestamp": "2026-05-03T00:26:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 16.9,
      "error_w": 0.13
    },
    {
      "timestamp": "2026-05-03T00:27:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 17.03,
      "error_w": 0.09
    },
    {
      "timestamp": "2026-05-03T00:28:00+00:00",
      "actual_power_w": 17.3,
      "predicted_power_w": 17.16,
      "error_w": 0.14
    },
    {
      "timestamp": "2026-05-03T00:29:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 17.51,
      "error_w": -0.51
    },
    {
      "timestamp": "2026-05-03T00:30:00+00:00",
      "actual_power_w": 17.07,
      "predicted_power_w": 17.42,
      "error_w": -0.35
    },
    {
      "timestamp": "2026-05-03T00:31:00+00:00",
      "actual_power_w": 16.9,
      "predicted_power_w": 16.93,
      "error_w": -0.03
    },
    {
      "timestamp": "2026-05-03T00:32:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.51,
      "error_w": 0.59
    },
    {
      "timestamp": "2026-05-03T00:33:00+00:00",
      "actual_power_w": 17.37,
      "predicted_power_w": 16.58,
      "error_w": 0.78
    },
    {
      "timestamp": "2026-05-03T00:34:00+00:00",
      "actual_power_w": 17.03,
      "predicted_power_w": 16.99,
      "error_w": 0.04
    },
    {
      "timestamp": "2026-05-03T00:35:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 16.99,
      "error_w": -0.0
    },
    {
      "timestamp": "2026-05-03T00:36:00+00:00",
      "actual_power_w": 16.97,
      "predicted_power_w": 16.92,
      "error_w": 0.04
    },
    {
      "timestamp": "2026-05-03T00:37:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 16.82,
      "error_w": 0.28
    },
    {
      "timestamp": "2026-05-03T00:38:00+00:00",
      "actual_power_w": 17.32,
      "predicted_power_w": 17.13,
      "error_w": 0.19
    },
    {
      "timestamp": "2026-05-03T00:39:00+00:00",
      "actual_power_w": 17.12,
      "predicted_power_w": 17.39,
      "error_w": -0.27
    },
    {
      "timestamp": "2026-05-03T00:40:00+00:00",
      "actual_power_w": 16.87,
      "predicted_power_w": 17.44,
      "error_w": -0.58
    },
    {
      "timestamp": "2026-05-03T00:41:00+00:00",
      "actual_power_w": 16.93,
      "predicted_power_w": 17.35,
      "error_w": -0.41
    },
    {
      "timestamp": "2026-05-03T00:42:00+00:00",
      "actual_power_w": 16.93,
      "predicted_power_w": 17.26,
      "error_w": -0.32
    },
    {
      "timestamp": "2026-05-03T00:43:00+00:00",
      "actual_power_w": 16.85,
      "predicted_power_w": 17.11,
      "error_w": -0.26
    },
    {
      "timestamp": "2026-05-03T00:44:00+00:00",
      "actual_power_w": 16.82,
      "predicted_power_w": 16.86,
      "error_w": -0.04
    },
    {
      "timestamp": "2026-05-03T00:45:00+00:00",
      "actual_power_w": 16.9,
      "predicted_power_w": 16.81,
      "error_w": 0.09
    },
    {
      "timestamp": "2026-05-03T00:46:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 16.66,
      "error_w": 0.56
    },
    {
      "timestamp": "2026-05-03T00:47:00+00:00",
      "actual_power_w": 17.22,
      "predicted_power_w": 16.77,
      "error_w": 0.44
    },
    {
      "timestamp": "2026-05-03T00:48:00+00:00",
      "actual_power_w": 16.92,
      "predicted_power_w": 16.98,
      "error_w": -0.06
    },
    {
      "timestamp": "2026-05-03T00:49:00+00:00",
      "actual_power_w": 16.92,
      "predicted_power_w": 16.62,
      "error_w": 0.3
    },
    {
      "timestamp": "2026-05-03T00:50:00+00:00",
      "actual_power_w": 17.02,
      "predicted_power_w": 16.29,
      "error_w": 0.73
    },
    {
      "timestamp": "2026-05-03T00:51:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 16.73,
      "error_w": 0.27
    },
    {
      "timestamp": "2026-05-03T00:52:00+00:00",
      "actual_power_w": 17.02,
      "predicted_power_w": 16.89,
      "error_w": 0.12
    },
    {
      "timestamp": "2026-05-03T00:53:00+00:00",
      "actual_power_w": 17.15,
      "predicted_power_w": 17.06,
      "error_w": 0.09
    },
    {
      "timestamp": "2026-05-03T00:54:00+00:00",
      "actual_power_w": 17.25,
      "predicted_power_w": 17.2,
      "error_w": 0.05
    },
    {
      "timestamp": "2026-05-03T00:55:00+00:00",
      "actual_power_w": 16.92,
      "predicted_power_w": 17.4,
      "error_w": -0.48
    },
    {
      "timestamp": "2026-05-03T00:56:00+00:00",
      "actual_power_w": 16.98,
      "predicted_power_w": 17.43,
      "error_w": -0.45
    },
    {
      "timestamp": "2026-05-03T00:57:00+00:00",
      "actual_power_w": 17.0,
      "predicted_power_w": 17.32,
      "error_w": -0.32
    },
    {
      "timestamp": "2026-05-03T00:58:00+00:00",
      "actual_power_w": 16.93,
      "predicted_power_w": 17.3,
      "error_w": -0.36
    },
    {
      "timestamp": "2026-05-03T00:59:00+00:00",
      "actual_power_w": 17.1,
      "predicted_power_w": 17.3,
      "error_w": -0.2
    }
  ],
  "future_forecast_60min": [
    {
      "step": 1,
      "timestamp": "2026-05-03T01:00:00+00:00",
      "forecast_power_w": 17.3,
      "horizon_minute": 1
    },
    {
      "step": 2,
      "timestamp": "2026-05-03T01:01:00+00:00",
      "forecast_power_w": 17.18,
      "horizon_minute": 2
    },
    {
      "step": 3,
      "timestamp": "2026-05-03T01:02:00+00:00",
      "forecast_power_w": 17.16,
      "horizon_minute": 3
    },
    {
      "step": 4,
      "timestamp": "2026-05-03T01:03:00+00:00",
      "forecast_power_w": 17.11,
      "horizon_minute": 4
    },
    {
      "step": 5,
      "timestamp": "2026-05-03T01:04:00+00:00",
      "forecast_power_w": 17.03,
      "horizon_minute": 5
    },
    {
      "step": 6,
      "timestamp": "2026-05-03T01:05:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 6
    },
    {
      "step": 7,
      "timestamp": "2026-05-03T01:06:00+00:00",
      "forecast_power_w": 16.93,
      "horizon_minute": 7
    },
    {
      "step": 8,
      "timestamp": "2026-05-03T01:07:00+00:00",
      "forecast_power_w": 16.92,
      "horizon_minute": 8
    },
    {
      "step": 9,
      "timestamp": "2026-05-03T01:08:00+00:00",
      "forecast_power_w": 16.92,
      "horizon_minute": 9
    },
    {
      "step": 10,
      "timestamp": "2026-05-03T01:09:00+00:00",
      "forecast_power_w": 16.94,
      "horizon_minute": 10
    },
    {
      "step": 11,
      "timestamp": "2026-05-03T01:10:00+00:00",
      "forecast_power_w": 16.96,
      "horizon_minute": 11
    },
    {
      "step": 12,
      "timestamp": "2026-05-03T01:11:00+00:00",
      "forecast_power_w": 16.98,
      "horizon_minute": 12
    },
    {
      "step": 13,
      "timestamp": "2026-05-03T01:12:00+00:00",
      "forecast_power_w": 17.0,
      "horizon_minute": 13
    },
    {
      "step": 14,
      "timestamp": "2026-05-03T01:13:00+00:00",
      "forecast_power_w": 17.02,
      "horizon_minute": 14
    },
    {
      "step": 15,
      "timestamp": "2026-05-03T01:14:00+00:00",
      "forecast_power_w": 17.03,
      "horizon_minute": 15
    },
    {
      "step": 16,
      "timestamp": "2026-05-03T01:15:00+00:00",
      "forecast_power_w": 17.04,
      "horizon_minute": 16
    },
    {
      "step": 17,
      "timestamp": "2026-05-03T01:16:00+00:00",
      "forecast_power_w": 17.04,
      "horizon_minute": 17
    },
    {
      "step": 18,
      "timestamp": "2026-05-03T01:17:00+00:00",
      "forecast_power_w": 17.05,
      "horizon_minute": 18
    },
    {
      "step": 19,
      "timestamp": "2026-05-03T01:18:00+00:00",
      "forecast_power_w": 17.04,
      "horizon_minute": 19
    },
    {
      "step": 20,
      "timestamp": "2026-05-03T01:19:00+00:00",
      "forecast_power_w": 17.04,
      "horizon_minute": 20
    },
    {
      "step": 21,
      "timestamp": "2026-05-03T01:20:00+00:00",
      "forecast_power_w": 17.03,
      "horizon_minute": 21
    },
    {
      "step": 22,
      "timestamp": "2026-05-03T01:21:00+00:00",
      "forecast_power_w": 17.02,
      "horizon_minute": 22
    },
    {
      "step": 23,
      "timestamp": "2026-05-03T01:22:00+00:00",
      "forecast_power_w": 17.01,
      "horizon_minute": 23
    },
    {
      "step": 24,
      "timestamp": "2026-05-03T01:23:00+00:00",
      "forecast_power_w": 17.0,
      "horizon_minute": 24
    },
    {
      "step": 25,
      "timestamp": "2026-05-03T01:24:00+00:00",
      "forecast_power_w": 16.99,
      "horizon_minute": 25
    },
    {
      "step": 26,
      "timestamp": "2026-05-03T01:25:00+00:00",
      "forecast_power_w": 16.99,
      "horizon_minute": 26
    },
    {
      "step": 27,
      "timestamp": "2026-05-03T01:26:00+00:00",
      "forecast_power_w": 16.98,
      "horizon_minute": 27
    },
    {
      "step": 28,
      "timestamp": "2026-05-03T01:27:00+00:00",
      "forecast_power_w": 16.98,
      "horizon_minute": 28
    },
    {
      "step": 29,
      "timestamp": "2026-05-03T01:28:00+00:00",
      "forecast_power_w": 16.98,
      "horizon_minute": 29
    },
    {
      "step": 30,
      "timestamp": "2026-05-03T01:29:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 30
    },
    {
      "step": 31,
      "timestamp": "2026-05-03T01:30:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 31
    },
    {
      "step": 32,
      "timestamp": "2026-05-03T01:31:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 32
    },
    {
      "step": 33,
      "timestamp": "2026-05-03T01:32:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 33
    },
    {
      "step": 34,
      "timestamp": "2026-05-03T01:33:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 34
    },
    {
      "step": 35,
      "timestamp": "2026-05-03T01:34:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 35
    },
    {
      "step": 36,
      "timestamp": "2026-05-03T01:35:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 36
    },
    {
      "step": 37,
      "timestamp": "2026-05-03T01:36:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 37
    },
    {
      "step": 38,
      "timestamp": "2026-05-03T01:37:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 38
    },
    {
      "step": 39,
      "timestamp": "2026-05-03T01:38:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 39
    },
    {
      "step": 40,
      "timestamp": "2026-05-03T01:39:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 40
    },
    {
      "step": 41,
      "timestamp": "2026-05-03T01:40:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 41
    },
    {
      "step": 42,
      "timestamp": "2026-05-03T01:41:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 42
    },
    {
      "step": 43,
      "timestamp": "2026-05-03T01:42:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 43
    },
    {
      "step": 44,
      "timestamp": "2026-05-03T01:43:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 44
    },
    {
      "step": 45,
      "timestamp": "2026-05-03T01:44:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 45
    },
    {
      "step": 46,
      "timestamp": "2026-05-03T01:45:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 46
    },
    {
      "step": 47,
      "timestamp": "2026-05-03T01:46:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 47
    },
    {
      "step": 48,
      "timestamp": "2026-05-03T01:47:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 48
    },
    {
      "step": 49,
      "timestamp": "2026-05-03T01:48:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 49
    },
    {
      "step": 50,
      "timestamp": "2026-05-03T01:49:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 50
    },
    {
      "step": 51,
      "timestamp": "2026-05-03T01:50:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 51
    },
    {
      "step": 52,
      "timestamp": "2026-05-03T01:51:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 52
    },
    {
      "step": 53,
      "timestamp": "2026-05-03T01:52:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 53
    },
    {
      "step": 54,
      "timestamp": "2026-05-03T01:53:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 54
    },
    {
      "step": 55,
      "timestamp": "2026-05-03T01:54:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 55
    },
    {
      "step": 56,
      "timestamp": "2026-05-03T01:55:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 56
    },
    {
      "step": 57,
      "timestamp": "2026-05-03T01:56:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 57
    },
    {
      "step": 58,
      "timestamp": "2026-05-03T01:57:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 58
    },
    {
      "step": 59,
      "timestamp": "2026-05-03T01:58:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 59
    },
    {
      "step": 60,
      "timestamp": "2026-05-03T01:59:00+00:00",
      "forecast_power_w": 16.97,
      "horizon_minute": 60
    }
  ],
  "methodology_notes": {
    "test_predictions": "One-step-ahead (1-minute) predictions on strictly unseen chronological test set (27,714 points) using true 30-minute historical multivariate sensor telemetry.",
    "future_forecast": "60-minute recursive autoregressive demonstration beyond test horizon, holding exogenous variables (voltage, current, frequency, pf) at baseline and updating power iteratively.",
    "limitation": "Future exogenous telemetry is unknown in deployment without secondary grid forecasting models."
  }
};
window.EMBEDDED_TRAINING_METADATA = {
  "model_name": "LSTM_Power_Forecaster",
  "architecture": [
    {
      "layer": "Input",
      "shape": [
        30,
        5
      ]
    },
    {
      "layer": "LSTM",
      "units": 64,
      "return_sequences": true
    },
    {
      "layer": "Dropout",
      "rate": 0.2
    },
    {
      "layer": "LSTM",
      "units": 32,
      "return_sequences": false
    },
    {
      "layer": "Dropout",
      "rate": 0.2
    },
    {
      "layer": "Dense",
      "units": 16,
      "activation": "relu"
    },
    {
      "layer": "Dense",
      "units": 1,
      "activation": "linear"
    }
  ],
  "total_parameters": 30881,
  "input_shape": [
    30,
    5
  ],
  "lookback": 30,
  "num_features": 5,
  "feature_names": [
    "voltage (V rms)",
    "current (A rms)",
    "frequency (Hz)",
    "pf",
    "power (W)"
  ],
  "target": "power (W)",
  "batch_size": 128,
  "max_epochs": 50,
  "actual_epochs_trained": 21,
  "best_epoch": 14,
  "optimizer": "Adam",
  "learning_rate": 0.001,
  "loss_function": "Mean Squared Error (MSE)",
  "metrics": [
    "mae",
    "mse"
  ],
  "training_sequence_count": 99611,
  "validation_sequence_count": 11067,
  "test_sequence_count_untouched": 27714,
  "early_stopping_triggered": true,
  "early_stopping_patience": 7,
  "reduce_lr_patience": 3,
  "training_duration_seconds": 684.78,
  "final_train_loss": 0.5125007629394531,
  "final_val_loss": 0.2458525151014328,
  "final_train_mae": 0.11567231267690659,
  "final_val_mae": 0.061955347657203674,
  "training_completion_status": "COMPLETED_SUCCESSFULLY",
  "history": {
    "loss": [
      0.7197080254554749,
      0.5930981636047363,
      0.5805792212486267,
      0.5708835124969482,
      0.5644951462745667,
      0.5459427237510681,
      0.5444289445877075,
      0.542032778263092,
      0.5307515859603882,
      0.5177292227745056,
      0.5260517001152039,
      0.5221801996231079,
      0.514243483543396,
      0.5125007629394531,
      0.5043285489082336,
      0.5026608109474182,
      0.4926223158836365,
      0.48376792669296265,
      0.4832749664783478,
      0.48145395517349243,
      0.4731311798095703
    ],
    "mae": [
      0.16085225343704224,
      0.12750013172626495,
      0.12308891117572784,
      0.11990074813365936,
      0.12012442946434021,
      0.11513083428144455,
      0.11383619159460068,
      0.11507787555456161,
      0.11434965580701828,
      0.11386871337890625,
      0.11449822038412094,
      0.11432664841413498,
      0.11461728811264038,
      0.11567231267690659,
      0.11597179621458054,
      0.11652252823114395,
      0.11590476334095001,
      0.11542432010173798,
      0.11556396633386612,
      0.11594078689813614,
      0.11486829072237015
    ],
    "mse": [
      0.7197080254554749,
      0.5930981636047363,
      0.5805792212486267,
      0.5708835124969482,
      0.5644951462745667,
      0.5459427237510681,
      0.5444289445877075,
      0.542032778263092,
      0.5307515859603882,
      0.5177292227745056,
      0.5260517001152039,
      0.5221801996231079,
      0.514243483543396,
      0.5125007629394531,
      0.5043285489082336,
      0.5026608109474182,
      0.4926223158836365,
      0.48376792669296265,
      0.4832749664783478,
      0.48145395517349243,
      0.4731311798095703
    ],
    "val_loss": [
      0.25533267855644226,
      0.24790796637535095,
      0.24791111052036285,
      0.25925037264823914,
      0.25788310170173645,
      0.24921809136867523,
      0.24940457940101624,
      0.2506808340549469,
      0.24780181050300598,
      0.24858088791370392,
      0.2476268708705902,
      0.2480655312538147,
      0.24802029132843018,
      0.2458525151014328,
      0.24909445643424988,
      0.25017282366752625,
      0.25644534826278687,
      0.26440533995628357,
      0.2640826106071472,
      0.2706978917121887,
      0.26859965920448303
    ],
    "val_mae": [
      0.07475194334983826,
      0.06824089586734772,
      0.06650130450725555,
      0.07029612362384796,
      0.07301153987646103,
      0.06404916942119598,
      0.06372252106666565,
      0.06257418543100357,
      0.0620332770049572,
      0.06281323730945587,
      0.06052429601550102,
      0.06208092346787453,
      0.061876483261585236,
      0.061955347657203674,
      0.06648116558790207,
      0.06435985118150711,
      0.06499144434928894,
      0.06639134883880615,
      0.0669868066906929,
      0.0680854320526123,
      0.06889258325099945
    ],
    "val_mse": [
      0.25533267855644226,
      0.24790796637535095,
      0.24791111052036285,
      0.25925037264823914,
      0.25788310170173645,
      0.24921809136867523,
      0.24940457940101624,
      0.2506808340549469,
      0.24780181050300598,
      0.24858088791370392,
      0.2476268708705902,
      0.2480655312538147,
      0.24802029132843018,
      0.2458525151014328,
      0.24909445643424988,
      0.25017282366752625,
      0.25644534826278687,
      0.26440533995628357,
      0.2640826106071472,
      0.2706978917121887,
      0.26859965920448303
    ],
    "learning_rate": [
      0.0010000000474974513,
      0.0010000000474974513,
      0.0010000000474974513,
      0.0010000000474974513,
      0.0010000000474974513,
      0.0005000000237487257,
      0.0005000000237487257,
      0.0005000000237487257,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0002500000118743628,
      0.0001250000059371814,
      0.0001250000059371814,
      0.0001250000059371814,
      6.25000029685907e-05
    ]
  }
};
