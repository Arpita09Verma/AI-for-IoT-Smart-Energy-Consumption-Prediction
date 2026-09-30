# Frontend Developer Data Guide: AI for IoT Energy Consumption Forecasting

Welcome to the data integration guide for the **AI for IoT Smart Energy Consumption Prediction** dashboard. This document provides everything required to consume, display, and visualize the model evaluation metrics and electricity demand forecast data without needing to open the machine learning notebooks or Python scripts.

---

## 1. Quick File Reference

| File Path | Format | Best Used For | Notes |
| :--- | :--- | :--- | :--- |
| `AI_IoT_Project/results/forecast_data.json` | JSON | **Primary dashboard feed:** KPI summary cards, quick charts, and 60-min future forecast | Compact (~35 KB), lightweight, and fast to load |
| `AI_IoT_Project/results/test_predictions.csv` | CSV | **Historical analysis & large charts:** Full 27,714-row test period table | Full test resolution (April 13 – May 3, 2026) |
| `AI_IoT_Project/results/evaluation_metrics.json` | JSON | **Model performance cards:** Accuracy, error distribution stats | Machine-readable metrics summary |
| `AI_IoT_Project/results/actual_vs_predicted.png` | PNG | Static fallback graphic for multi-day time-series tracking | 300 DPI high resolution |
| `AI_IoT_Project/results/actual_vs_predicted_scatter.png` | PNG | Static fallback graphic for regression correlation ($y = x$) | Includes $R^2$ annotation |
| `AI_IoT_Project/results/error_distribution.png` | PNG | Static fallback graphic for error spread and boxplot | Zero-centered error histogram |

---

## 2. Core Concepts & Data Definitions

- **Model Name:** `LSTM_Power_Forecaster` (Deep Recurrent Neural Network with 2 LSTM layers + Dropout + Dense layers).
- **Target Variable:** Active real power demand ($P$).
- **Physical Unit:** **Watts ($W$)**. All values in `test_predictions.csv` and `forecast_data.json` have already been inverse-scaled back into real physical Watts. No scaling conversion is needed on the frontend.
- **Lookback Window:** 30 consecutive 1-minute historical observations (30 minutes of past multivariate telemetry: Voltage, Current, Frequency, Power Factor, Power).
- **Forecast Horizon:**
  - **Test Predictions:** Next 1-minute power demand ($t+1$) evaluated across 27,714 contiguous unseen observations.
  - **Future Forecast:** 60-minute recursive forecast beyond the test dataset boundary.
- **Timestamp Standard:** **ISO 8601 UTC** format (e.g., `2026-04-13T13:28:00+00:00`). Parse using native JavaScript `new Date(timestamp)`.

---

## 3. Data File Structures & Schemas

### A. `test_predictions.csv` (Full Test Set)
This CSV contains 27,714 chronological rows. Each row represents a 1-minute observation from the unseen test split.

| Column Name | Data Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `timestamp` | String (ISO 8601) | UTC | Exact minute of the target observation. |
| `actual_power_w` | Float | Watts ($W$) | True measured active power demand from IoT meter. |
| `predicted_power_w` | Float | Watts ($W$) | Model-predicted power demand for that minute. |
| `error_w` | Float | Watts ($W$) | Residual error: $\text{actual} - \text{predicted}$. Positive means under-prediction; negative means over-prediction. |

### B. `forecast_data.json` (Dashboard Feed)
This JSON file is designed for immediate dashboard consumption:
```json
{
  "project": "AI for IoT Smart Energy Consumption Prediction",
  "stage": "Part 3 - Model Evaluation and Electricity Demand Forecast",
  "model": "LSTM_Power_Forecaster",
  "target": "power",
  "unit": "W",
  "lookback_minutes": 30,
  "forecast_horizon_minutes": 60,
  "evaluation_metrics": { ... },
  "recent_test_predictions": [ ... ],
  "future_forecast_60min": [ ... ],
  "methodology_notes": { ... }
}
```

#### Key Keys for UI Components:
1. **`evaluation_metrics`**: Use directly for top-level KPI cards:
   - `mae_w`: **3.30 W** (Mean Absolute Error).
   - `rmse_w`: **30.71 W** (Root Mean Squared Error).
   - `r2`: **0.2521** (Coefficient of Determination).
   - `test_samples`: **27,714** observations.
   - `error_statistics_w.mean_error`: **-0.15 W** (Virtually zero bias).
2. **`recent_test_predictions`**: Array of the latest 180 minutes (~3 hours) of actual vs. predicted values for live time-series comparison charts.
3. **`future_forecast_60min`**: Array of 60 future predictions starting immediately after the test period:
   - `step`: Horizon minute (1 to 60).
   - `timestamp`: Future UTC timestamp (`2026-05-03T01:00:00+00:00` to `2026-05-03T01:59:00+00:00`).
   - `forecast_power_w`: Predicted active power in Watts.

---

## 4. Recommended Dashboard Component Mapping

```
+-----------------------------------------------------------------------------------+
|                           ENERGY DEMAND FORECAST DASHBOARD                        |
+-----------------------------------------------------------------------------------+
|  [ KPI 1: MAE ]         [ KPI 2: RMSE ]       [ KPI 3: R² ]      [ KPI 4: Mean Bias ] |
|     3.30 W                 30.71 W               0.2521               -0.15 W     |
| (from metrics.mae_w)  (from metrics.rmse_w)  (from metrics.r2)   (from mean_error)|
+-----------------------------------------------------------------------------------+
|  TIME-SERIES DEMAND FORECAST (Actual vs. Predicted)                               |
|  - Source: forecast_data.json -> recent_test_predictions (180 min)                |
|  - Chart: Dual Line Chart (Blue = Actual W, Orange = Predicted W)                 |
+-----------------------------------------------------------------------------------+
|  NEXT 60-MINUTE FORWARD FORECAST                                                  |
|  - Source: forecast_data.json -> future_forecast_60min (60 min)                   |
|  - Chart: Stepped Area / Line Chart with Confidence / Horizon Band (Purple)       |
+-----------------------------------------------------------------------------------+
|  RESIDUAL ERROR SPREAD & SUMMARY TABLE                                            |
|  - Source: test_predictions.csv (paginated table or download link)               |
+-----------------------------------------------------------------------------------+
```

---

## 5. Important Model Nuances & Limitations

1. **Test Predictions vs. Future Forecasts:**
   - **Test Predictions (`test_predictions.csv`):** These are **one-step-ahead (1-minute)** predictions across historical test data where the model was provided the preceding 30 minutes of real multivariate electrical telemetry ($V, I, f, \text{pf}, P$).
   - **Future Forecast (`future_forecast_60min`):** This is a **recursive autoregressive multi-step demonstration** extending into future time where physical sensor readings do not yet exist.
2. **Exogenous Variable Persistence:**
   - In the real IoT environment, future grid voltage, line current, and frequency are unknown before they happen. For the 60-minute future demonstration, exogenous variables are held at their nominal baseline while power is recursively predicted and fed back into the window.
3. **Missing Data Handling:**
   - The test set covers multiple continuous operating segments separated by recorded power outages. Outages were not filled with fabricated data; each continuous segment preserves authentic metering intervals.
