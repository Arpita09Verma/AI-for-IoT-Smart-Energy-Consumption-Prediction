import React from 'react';

/**
 * Model Information Component
 * Clean modern energy monitoring and analytics platform specification card
 * With small colored icons and professional typography
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
            <h2 className="section-title">Model Specifications & System Architecture</h2>
            <p className="section-subtitle">Operational parameters, recurrent neural architecture, and evaluation boundaries</p>
          </div>
        </div>
      </div>

      <article className="glass-card">
        <div className="model-info-grid">
          {/* 1. Model Identifier */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#2563eb', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                </svg>
              </span>
              <span className="spec-label">Model Identifier</span>
            </div>
            <span className="spec-val text-mono" style={{ color: '#2563eb' }}>{modelName}</span>
          </div>

          {/* 2. Neural Architecture */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#7c3aed', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </span>
              <span className="spec-label">Neural Architecture</span>
            </div>
            <span className="spec-val">2 Recurrent LSTM Layers + Dropout + Dense</span>
          </div>

          {/* 3. Prediction Target */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#d97706', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </span>
              <span className="spec-label">Prediction Target</span>
            </div>
            <span className="spec-val" style={{ color: '#d97706' }}>Active Power Demand</span>
          </div>

          {/* 4. Target Unit */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#16a34a', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
              </span>
              <span className="spec-label">Target Unit</span>
            </div>
            <span className="spec-val text-mono">{unit}</span>
          </div>

          {/* 5. Lookback Window */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#0891b2', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 8 14"></polyline>
                </svg>
              </span>
              <span className="spec-label">Lookback Window</span>
            </div>
            <span className="spec-val text-mono">{lookback} minutes (30 sequential steps)</span>
          </div>

          {/* 6. Input Telemetry */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#2563eb', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </span>
              <span className="spec-label">Input Telemetry (5 features)</span>
            </div>
            <div className="telemetry-tags-list">
              <span className="telemetry-tag">Voltage (V)</span>
              <span className="telemetry-tag">Current (A)</span>
              <span className="telemetry-tag">Frequency (Hz)</span>
              <span className="telemetry-tag">Power Factor</span>
              <span className="telemetry-tag">Power (W)</span>
            </div>
          </div>

          {/* 7. Test Prediction Horizon */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#2563eb', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </span>
              <span className="spec-label">Test Prediction Horizon</span>
            </div>
            <span className="spec-val text-mono">1 minute ahead (One-step)</span>
          </div>

          {/* 8. Future Forecast Horizon */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#7c3aed', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </span>
              <span className="spec-label">Future Forecast Horizon</span>
            </div>
            <span className="spec-val text-mono" style={{ color: '#7c3aed' }}>{futureHorizon} minutes recursive projection</span>
          </div>

          {/* 9. Unseen Test Samples */}
          <div className="model-spec-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ color: '#475569', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </span>
              <span className="spec-label">Unseen Test Samples</span>
            </div>
            <span className="spec-val text-mono">{formattedSamples} observations</span>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ModelInfo;
