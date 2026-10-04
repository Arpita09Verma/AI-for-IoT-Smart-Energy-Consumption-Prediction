import React from 'react';

/**
 * AI + IoT Data Pipeline Component
 * Visually represents the complete telemetry pipeline:
 * IoT Energy Meter (PZEM-004T + ESP32)
 *  ↓
 * Electrical Telemetry (V, I, f, PF, P)
 *  ↓
 * Data Processing
 *  ↓
 * 30-Minute Lookback Window
 *  ↓
 * LSTM Power Forecaster
 *  ↓
 * Prediction (Active Power Demand W)
 *  ↓
 * Dashboard Visualization
 */
export const IoTPipeline = () => {
  return (
    <section className="dashboard-section" id="pipeline-section" aria-label="AI + IoT Telemetry Pipeline">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">IoT</span>
          <div>
            <h2 className="section-title">AI + IoT Data Pipeline</h2>
            <p className="section-subtitle">
              High-resolution smart meter telemetry flow to deep recurrent inference
            </p>
          </div>
        </div>
      </div>

      <article className="glass-card">
        <div className="pipeline-flow">
          {/* Step 1: Physical Sensor */}
          <div className="pipeline-step">
            <span className="pipeline-step-badge">STEP 1</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="3"></rect>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="4"></line>
                <line x1="12" y1="20" x2="12" y2="23"></line>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">IoT Energy Meter</div>
              <div className="pipeline-step-desc">PZEM-004T + ESP32 microcontroller smart energy sensor</div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 2: Telemetry */}
          <div className="pipeline-step step-telemetry">
            <span className="pipeline-step-badge">STEP 2</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">Electrical Telemetry</div>
              <div className="pipeline-mini-tags">
                <span className="pipeline-mini-tag">Voltage (V)</span>
                <span className="pipeline-mini-tag">Current (A)</span>
                <span className="pipeline-mini-tag">Frequency (Hz)</span>
                <span className="pipeline-mini-tag">Power Factor</span>
                <span className="pipeline-mini-tag">Power (W)</span>
              </div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 3: Data Processing */}
          <div className="pipeline-step">
            <span className="pipeline-step-badge">STEP 3</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">Data Processing</div>
              <div className="pipeline-step-desc">Time-series normalization, outlier filtering & standardization</div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 4: Lookback Window */}
          <div className="pipeline-step">
            <span className="pipeline-step-badge">STEP 4</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">30-Min Lookback</div>
              <div className="pipeline-step-desc">Sliding chronological temporal window of 30 one-minute steps</div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 5: LSTM Model */}
          <div className="pipeline-step step-model">
            <span className="pipeline-step-badge">STEP 5</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">LSTM Forecaster</div>
              <div className="pipeline-step-desc">2 LSTM recurrent layers with Dropout & Dense head</div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 6: Prediction Target */}
          <div className="pipeline-step step-prediction">
            <span className="pipeline-step-badge">STEP 6</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">Prediction</div>
              <div className="pipeline-target-tag">Active Power Demand (W)</div>
            </div>
          </div>

          <div className="pipeline-connector">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Step 7: Dashboard */}
          <div className="pipeline-step">
            <span className="pipeline-step-badge">STEP 7</span>
            <div className="pipeline-step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
            </div>
            <div className="pipeline-step-content">
              <div className="pipeline-step-title">Dashboard View</div>
              <div className="pipeline-step-desc">Interactive evaluation, forecasts & error distribution</div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default IoTPipeline;
