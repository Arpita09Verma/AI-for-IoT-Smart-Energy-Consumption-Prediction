import React from 'react';

/**
 * Model Information Component
 * Displays model metadata:
 * - Model: LSTM_Power_Forecaster
 * - Architecture: 2 LSTM layers + Dropout + Dense layers
 * - Target: Active Power Demand
 * - Unit: Watts (W)
 * - Lookback: 30 minutes
 * - Input telemetry: Voltage, Current, Frequency, Power Factor, Power
 * - Test prediction horizon: 1 minute ahead
 * - Future forecast: 60 minutes
 * - Test samples: 27,714
 */
export const ModelInfo = ({ forecastData, metrics }) => {
  const modelName = forecastData?.model || metrics?.model_name || 'LSTM_Power_Forecaster';
  const unit = forecastData?.unit || metrics?.target_unit || 'Watts (W)';
  const lookback = forecastData?.lookback_minutes || 30;
  const futureHorizon = forecastData?.forecast_horizon_minutes || 60;
  const sampleCount = metrics?.test_samples || 27714;
  const formattedSamples = typeof sampleCount === 'number' ? sampleCount.toLocaleString() : sampleCount;

  return (
    <section className="dashboard-section" id="model-performance-section" aria-label="Model Information & Architecture">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">5</span>
          <div>
            <h2 className="section-title">Model Architecture & Specifications</h2>
            <p className="section-subtitle">Parameters, neural architecture, and evaluation setup</p>
          </div>
        </div>
      </div>

      <article className="glass-card">
        <div className="model-info-grid">
          <div className="model-spec-item">
            <span className="spec-label">Model Identifier</span>
            <span className="spec-val text-mono highlight-purple">{modelName}</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Neural Architecture</span>
            <span className="spec-val">2 LSTM layers + Dropout + Dense layers</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Prediction Target</span>
            <span className="spec-val highlight-orange">Active Power Demand</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Target Unit</span>
            <span className="spec-val text-mono">{unit}</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Lookback Window</span>
            <span className="spec-val text-mono">{lookback} minutes</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Input Telemetry (5 features)</span>
            <div className="telemetry-tags-list">
              <span className="telemetry-tag">Voltage (V)</span>
              <span className="telemetry-tag">Current (A)</span>
              <span className="telemetry-tag">Frequency (Hz)</span>
              <span className="telemetry-tag">Power Factor</span>
              <span className="telemetry-tag">Power (W)</span>
            </div>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Test Prediction Horizon</span>
            <span className="spec-val text-mono">1 minute ahead</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Future Forecast Horizon</span>
            <span className="spec-val text-mono highlight-purple">{futureHorizon} minutes</span>
          </div>

          <div className="model-spec-item">
            <span className="spec-label">Unseen Test Samples</span>
            <span className="spec-val text-mono">{formattedSamples}</span>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ModelInfo;
