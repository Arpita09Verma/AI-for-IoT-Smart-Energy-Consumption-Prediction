import React from 'react';

/**
 * Methodology & Operational Notes Component
 * Dynamically populated from forecast_data.json -> methodology_notes
 */
export const MethodologySection = ({ notes }) => {
  const testMethod = notes?.test_predictions || 'One-minute-ahead active power predictions evaluated across 27,714 chronological unseen test observations.';
  const futureMethod = notes?.future_forecast || 'Autoregressive multi-step recursive forecasting extending 60 minutes into the future beyond the final test timestamp.';
  const limitation = notes?.limitation || 'Forecast uncertainty compounds over longer horizons. Sensor anomalies or unexpected load shifts beyond the 30-minute lookback window may cause divergence.';

  return (
    <section className="dashboard-section" id="methodology-section" aria-label="Methodology & Model Scope">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">6</span>
          <div>
            <h2 className="section-title">Methodology & Operational Notes</h2>
            <p className="section-subtitle">Evaluation approach and forecasting boundary conditions</p>
          </div>
        </div>
      </div>

      <div className="grid-3col">
        <article className="glass-card methodology-card actual-accent">
          <h3 className="methodology-title">
            <span className="color-dot dot-actual" style={{ marginRight: '0.5rem' }}></span>
            Test Predictions Methodology
          </h3>
          <p className="methodology-text" id="methodologyTestPred">
            {testMethod}
          </p>
        </article>

        <article className="glass-card methodology-card forecast-accent">
          <h3 className="methodology-title">
            <span className="color-dot dot-forecast" style={{ marginRight: '0.5rem' }}></span>
            Future Forecast Methodology
          </h3>
          <p className="methodology-text" id="methodologyFutureForecast">
            {futureMethod}
          </p>
        </article>

        <article className="glass-card methodology-card limitation-accent">
          <h3 className="methodology-title">
            <span className="color-dot" style={{ background: '#64748b', marginRight: '0.5rem' }}></span>
            Operational Scope &amp; Limitations
          </h3>
          <p className="methodology-text" id="methodologyLimitation">
            {limitation}
          </p>
        </article>
      </div>
    </section>
  );
};

export default MethodologySection;
