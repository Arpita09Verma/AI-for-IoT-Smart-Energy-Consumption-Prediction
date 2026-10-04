# AI for IoT Smart Energy Consumption Prediction

An end-to-end Deep Learning and IoT energy forecasting system that predicts **active real power demand in Watts (W)** from high-resolution electrical telemetry collected by **PZEM-004T + ESP32** smart meters.

---

## ⚡ Project Overview & Trained Model Specifications

The machine learning model is **already trained and validated**. No retraining or modification is required.

* **Model Name:** `LSTM_Power_Forecaster`
* **Architecture:** Deep Recurrent Neural Network (RNN)
  * **Input Layer:** `(Batch, 30, 5)` — 30-minute lookback window of consecutive 1-minute observations
  * **LSTM Layer 1:** 64 units (`return_sequences=True`)
  * **Dropout Layer 1:** 0.20 rate
  * **LSTM Layer 2:** 32 units (`return_sequences=False`)
  * **Dropout Layer 2:** 0.20 rate
  * **Dense Layer 1:** 16 units (`activation='relu'`)
  * **Output Dense Layer:** 1 unit (`activation='linear'`) &rarr; Predicted Active Power $\hat{y}_{t+1}$ in Watts ($W$)
* **Total Trainable Parameters:** 30,881
* **Lookback Window:** 30 minutes (30 consecutive 1-minute time steps)
* **Multivariate Telemetry Features (5 inputs):**
  1. RMS Voltage ($V$)
  2. RMS Current ($A$)
  3. Grid Frequency ($Hz$)
  4. Power Factor ($\text{pf}$)
  5. Real Active Power ($W$)
* **Target Variable:** Active real power demand ($P$) in physical **Watts ($W$)**

---

## 📊 Authentic Model Evaluation Results (Unseen Test Split)

Evaluated chronologically across **27,714 completely unseen continuous observations** (April 13 – May 3, 2026):

| Evaluation Metric | Physical Value | Description |
| :--- | :--- | :--- |
| **Mean Absolute Error (MAE)** | **3.3016 W** | High precision on physical load tracking |
| **Root Mean Squared Error (RMSE)** | **30.7080 W** | Sensitive to non-linear transient appliance spikes |
| **Mean Squared Error (MSE)** | **942.9799 W²** | Unscaled physical squared error |
| **Coefficient of Determination ($R^2$)** | **0.2521** | Rigorous chronological validation score |
| **Systematic Bias Error** | **-0.1490 W** | Unbiased Gaussian-centered residual distribution |
| **Actual Power Range** | **16.73 W – 1245.20 W** | Mean active load: 23.43 W |
| **Predicted Power Range** | **10.65 W – 812.57 W** | Mean predicted load: 23.58 W |

---

## 🚀 Interactive Frontend Dashboard

A high-tech, responsive dark cyber-industrial dashboard built with modern HTML5, JavaScript, and Vanilla CSS to visualize the authentic project data files.

### Dashboard Modules:
1. ⚡ **Executive Overview:** Top KPI cards (MAE, RMSE, R², Bias, Samples), recent 180-minute actual vs. predicted dual line chart, and quick 60-min forward forecast preview.
2. 🔮 **60-Minute Forward Forecast:** Dedicated recursive autoregressive forward horizon with $\pm 1$ RMSE ($30.71\text{ W}$) uncertainty ribbon, cumulative Watt-hour ($Wh$) projection, and minute-by-minute step cards.
3. 📈 **Historical Evaluation (27,714 Observations):** Multi-day time-series exploration with fast time-slice selectors (Full 20-day, 3-day window, 24 hours, 180 min), plus an interactive paginated data table with search, sorting, error category filtering, and CSV export.
4. 🧠 **LSTM Architecture & Training Convergence:** Interactive neural network topology diagram, model specification grid, and 21-epoch training convergence curves (Loss MSE & MAE) with Epoch 14 best-checkpoint marker.
5. 📊 **Error Analytics & Graphics Gallery:** Zero-centered residual error histogram and 300 DPI high-resolution evaluation graphics gallery with full-screen lightbox modal.
6. 📋 **IoT Hardware Specs & Rigor:** Complete PZEM-004T + ESP32 telemetry hardware specification and zero-leakage data preparation documentation.

---

## 💻 How to Launch the Dashboard

### Method 1: One-Click Windows Batch File (Recommended)
Simply double-click:
```cmd
run_dashboard.bat
```

### Method 2: Python HTTP Server Launcher
```bash
python run_dashboard.py
```
This automatically starts a local server on port 8000 and opens `http://localhost:8000/index.html` in your default web browser.

### Method 3: Standard Node / Python Command
```bash
# Using Python
python -m http.server 8000

# OR using Node
npx serve .
```
Then navigate to: [http://localhost:8000/index.html](http://localhost:8000/index.html)

### Method 4: Offline / Direct File Execution
You can also directly double-click [index.html](file:///c:/Users/Isha/OneDrive/New%20folder/AI-for-IoT-Smart-Energy-Consumption-Prediction/index.html) in Windows File Explorer. The built-in embedded data loader automatically supplies the complete forecast feed and model metadata even if browser `file://` CORS restrictions are active.

---

## 📁 Repository Directory Structure

```text
AI-for-IoT-Smart-Energy-Consumption-Prediction/
├── index.html                                # Main frontend dashboard entry point
├── run_dashboard.py                          # Zero-dependency local server launcher
├── run_dashboard.bat                         # 1-click Windows batch launcher
├── README.md                                 # Comprehensive project & dashboard documentation
├── frontend/
│   ├── css/
│   │   ├── main.css                          # Cyber-industrial design system tokens & layout
│   │   └── components.css                    # KPI cards, charts, tabs, tables & modal styling
│   ├── js/
│   │   ├── app.js                            # Application controller & view coordinator
│   │   ├── data-loader.js                    # Dynamic JSON & CSV streaming loader
│   │   ├── charts.js                         # Responsive Chart.js visualizer instances
│   │   ├── table.js                          # 27,714-row paginated table controller
│   │   └── embedded-data.js                  # Authentic ML fallback dataset
│   └── vendor/
│       └── chart.umd.min.js                  # Local offline Chart.js v4.4 library
└── AI_IoT_Project/
    ├── README.md                             # ML pipeline documentation
    ├── data/processed/                       # Processed sliding window datasets (.npy)
    ├── models/
    │   ├── lstm_model.keras                  # Best trained LSTM weights
    │   ├── training_metadata.json            # Model architecture & epoch logs
    │   ├── feature_scaler.pkl                # Fitted feature StandardScaler
    │   └── target_scaler.pkl                 # Fitted target StandardScaler
    └── results/
        ├── forecast_data.json                # Primary dashboard feed (KPIs & 60-min forecast)
        ├── test_predictions.csv              # Full 27,714-row test evaluation table
        ├── evaluation_metrics.json           # Standalone metric scores in Watts
        ├── FRONTEND_DATA_GUIDE.md            # Developer integration guide
        └── *.png                             # High-resolution 300 DPI evaluation charts
```