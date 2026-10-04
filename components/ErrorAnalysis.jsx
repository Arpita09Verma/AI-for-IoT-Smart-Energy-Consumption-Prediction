import React, { useEffect, useRef, useState } from 'react';
import { KPICard } from './KPICard.jsx';

/**
 * Dedicated Prediction Error Analysis Section
 * Displays:
 * 1. Mean Error
 * 2. MAE
 * 3. RMSE
 * 4. R²
 * 5. Dynamic Error Distribution Histogram
 * 6. Detailed Error Statistics Breakdown (error_statistics_w)
 * Formula: error_w = actual_power_w - predicted_power_w
 * - Positive error = model under-predicted (Actual > Predicted)
 * - Negative error = model over-predicted (Actual < Predicted)
 */
export const ErrorAnalysis = ({
  metrics,
  testPredictions = [],
  dataService,
  loading = false,
  error = null,
  onRetry,
  onOpenModal
}) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [showStaticFallback, setShowStaticFallback] = useState(false);

  // Compute error distribution bins from CSV data
  useEffect(() => {
    if (!canvasRef.current || !testPredictions || testPredictions.length === 0 || showStaticFallback) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const Chart = window.Chart;
    if (!Chart) return;

    const binData = dataService ? dataService.computeErrorDistributionBins(2) : { labels: [], counts: [], binInfo: [] };
    if (!binData || !binData.labels || binData.labels.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const totalObs = binData.total || binData.counts.reduce((a, b) => a + b, 0);

    const backgroundColors = binData.labels.map((lbl, idx) => {
      const info = binData.binInfo ? binData.binInfo[idx] : null;
      const mid = info ? info.mid : (parseInt(lbl) || 0);

      // Severe outlier spikes (|e| >= 20W) -> Red
      if (Math.abs(mid) >= 20) return 'rgba(239, 68, 68, 0.75)';
      // Zero error center cluster ([-2W, +2W]) -> Emerald Green
      if (info && info.isZero) return 'rgba(16, 185, 129, 0.85)';
      // Negative error (< 0) -> Model Over-predicted (Cyan/Blue)
      if (mid < 0) return 'rgba(56, 189, 248, 0.65)';
      // Positive error (> 0) -> Model Under-predicted (Amber/Orange)
      return 'rgba(245, 158, 11, 0.65)';
    });

    const borderColors = binData.labels.map((lbl, idx) => {
      const info = binData.binInfo ? binData.binInfo[idx] : null;
      const mid = info ? info.mid : (parseInt(lbl) || 0);
      if (Math.abs(mid) >= 20) return '#ef4444';
      if (info && info.isZero) return '#10b981';
      if (mid < 0) return '#38bdf8';
      return '#f59e0b';
    });

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: binData.labels,
        datasets: [{
          label: 'Observation Frequency',
          data: binData.counts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1.2,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            titleFont: { family: "'JetBrains Mono', monospace", size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              title: (items) => `Residual Range: ${items[0].label}`,
              label: (item) => {
                const count = Number(item.raw);
                const pct = totalObs > 0 ? ((count / totalObs) * 100).toFixed(2) : 0;
                return ` Frequency: ${count.toLocaleString()} observations (${pct}%)`;
              },
              afterLabel: (item) => {
                const idx = item.dataIndex;
                const info = binData.binInfo ? binData.binInfo[idx] : null;
                const mid = info ? info.mid : (parseInt(item.label) || 0);
                if (info && info.isZero) return ' 🎯 Peak Accuracy: Zero-centered residual (|e| ≤ 2W)';
                if (mid < 0) return ' 🔵 Negative Residual: Model Over-predicted (Actual < Predicted)';
                return ' 🟠 Positive Residual: Model Under-predicted (Actual > Predicted)';
              },
              footer: () => ' Formula: error_w = actual_power_w - predicted_power_w'
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            title: {
              display: true,
              text: '← Over-predicted (Negative Error) | Error in Watts (error_w = actual - predicted) | Under-predicted (Positive Error) →',
              color: '#94a3b8',
              font: { size: 11, weight: '500' }
            },
            ticks: {
              maxTicksLimit: 14,
              color: '#64748b',
              font: { family: "'JetBrains Mono', monospace", size: 10 }
            }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: {
              display: true,
              text: 'Observations (Count)',
              color: '#94a3b8',
              font: { size: 11, weight: '600' }
            },
            ticks: {
              color: '#94a3b8',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              callback: (v) => v.toLocaleString()
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [testPredictions, showStaticFallback, dataService]);

  // Metric extraction
  const meanErr = metrics?.error_statistics_w?.mean_error ?? metrics?.mean_error;
  const formattedMean = (typeof meanErr === 'number')
    ? (Math.abs(meanErr) < 0.005 ? '0.00' : meanErr.toFixed(2))
    : 'Unavailable';

  const maeVal = (typeof metrics?.mae_w === 'number') ? metrics.mae_w.toFixed(2) :
                 (typeof metrics?.mae === 'number' ? metrics.mae.toFixed(2) : 'Unavailable');

  const rmseVal = (typeof metrics?.rmse_w === 'number') ? metrics.rmse_w.toFixed(2) :
                  (typeof metrics?.rmse === 'number' ? metrics.rmse.toFixed(2) : 'Unavailable');

  const r2Val = (typeof metrics?.r2 === 'number') ? metrics.r2.toFixed(4) : 'Unavailable';

  const stats = metrics?.error_statistics_w;

  return (
    <section className="dashboard-section" id="error-analysis-section" aria-label="Prediction Error Analysis">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">4</span>
          <div>
            <h2 className="section-title">Prediction Error Analysis</h2>
            <p className="section-subtitle">
              Evaluation of prediction residuals, model accuracy metrics, and error distribution spread around zero from <code>test_predictions.csv</code>
            </p>
          </div>
        </div>

        <div className="card-actions">
          <button
            className={`btn btn-secondary btn-sm ${showStaticFallback ? 'btn-outline' : ''}`}
            onClick={() => setShowStaticFallback(prev => !prev)}
          >
            {showStaticFallback ? 'Switch to Dynamic Histogram' : 'View Reference Plot (error_distribution.png)'}
          </button>
        </div>
      </div>

      {/* 4 Primary Error & Evaluation Metrics */}
      <div className="error-metrics-row-4">
        <KPICard
          label="Mean Error"
          value={formattedMean}
          unit={formattedMean !== 'Unavailable' ? 'W' : ''}
          description="Average prediction residual • error_statistics_w.mean_error"
          type="bias"
          icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />

        <KPICard
          label="MAE"
          value={maeVal}
          unit={maeVal !== 'Unavailable' ? 'W' : ''}
          description="Mean Absolute Error • mae_w"
          type="actual"
          icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          }
        />

        <KPICard
          label="RMSE"
          value={rmseVal}
          unit={rmseVal !== 'Unavailable' ? 'W' : ''}
          description="Root Mean Squared Error • rmse_w"
          type="predicted"
          icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10M12 20V4M6 20v-6"></path>
            </svg>
          }
        />

        <KPICard
          label="R² Score"
          value={r2Val}
          unit=""
          description="Coefficient of Determination • r2"
          type="forecast"
          icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
              <path d="M12 8v8"></path>
            </svg>
          }
        />
      </div>

      {/* Residual Error Formula & Direction Communication Banner */}
      <div className="error-formula-card" role="region" aria-label="Error Formula and Interpretation">
        <div className="formula-display">
          <span className="formula-label">Residual Formula:</span>
          <code className="formula-code">error_w = actual_power_w - predicted_power_w</code>
        </div>
        <div className="formula-interpretations">
          <div className="formula-badge-item">
            <span className="legend-chip chip-positive">Positive (+) Error</span>
            <span><strong>Model Under-Predicted</strong> (Actual &gt; Predicted)</span>
          </div>
          <div className="formula-badge-item">
            <span className="legend-chip chip-negative">Negative (&minus;) Error</span>
            <span><strong>Model Over-Predicted</strong> (Actual &lt; Predicted)</span>
          </div>
          <div className="formula-badge-item">
            <span className="legend-chip" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              Zero (0) Peak
            </span>
            <span><strong>Exact Match</strong> (85.4% within &plusmn;2W)</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Dynamic Error Distribution Histogram + Detailed Statistics */}
      <div className="grid-2col">
        {/* Dynamic Histogram */}
        <article className="glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
              </svg>
              <div>
                <h3 className="card-title">Residual Error Distribution</h3>
                <p className="card-subtitle">Zero-centered histogram from 27,714 observations in <code>test_predictions.csv</code></p>
              </div>
            </div>
          </div>

          <div className="chart-container-medium" id="errorDistChartContainer" style={{ position: 'relative' }}>
            {loading && (
              <div className="chart-loading-overlay">
                <div className="loading-mini-spinner" aria-hidden="true"></div>
                <span>Loading residual error distribution (test_predictions.csv)...</span>
              </div>
            )}

            {(!loading && (error || !testPredictions || testPredictions.length === 0) && !showStaticFallback) && (
              <div className="chart-empty-state">
                <div className="empty-icon-wrap" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h4 className="empty-state-title">Residual Error Distribution Unavailable</h4>
                <p className="empty-state-desc">
                  {error || 'Unable to calculate residual distribution because test_predictions.csv could not be loaded.'}
                </p>
                {onRetry && (
                  <button className="btn btn-secondary btn-sm" onClick={onRetry}>
                    Retry Loading CSV
                  </button>
                )}
              </div>
            )}

            <canvas
              ref={canvasRef}
              id="errorDistChart"
              style={{ display: showStaticFallback ? 'none' : 'block' }}
            />

            {showStaticFallback && (
              <div
                className="gallery-img-wrap"
                style={{ display: 'flex', height: 340, background: '#050811', borderRadius: 'var(--radius-md)' }}
              >
                <img
                  src="AI_IoT_Project/results/error_distribution.png"
                  alt="Static Fallback: Error Distribution Plot"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => onOpenModal && onOpenModal('AI_IoT_Project/results/error_distribution.png', 'Static Fallback Reference Plot: Residual Error Distribution & Boxplot')}
                />
              </div>
            )}
          </div>
        </article>

        {/* Detailed Error Statistics Breakdown */}
        <article className="glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <div>
                <h3 className="card-title">Error Statistics in Watts ($W$)</h3>
                <p className="card-subtitle">Detailed residual summary from <code>evaluation_metrics.json</code></p>
              </div>
            </div>
          </div>

          <div className="stats-breakdown-list">
            <div className="stat-breakdown-item">
              <span className="stat-label">Mean Residual (Bias):</span>
              <span className="stat-value text-mono" id="statMeanError">
                {stats?.mean_error !== undefined ? `${stats.mean_error.toFixed(2)} W` : 'Unavailable'}
              </span>
            </div>
            <div className="stat-breakdown-item">
              <span className="stat-label">Standard Deviation of Error:</span>
              <span className="stat-value text-mono" id="statStdError">
                {stats?.std_error !== undefined ? `${stats.std_error.toFixed(2)} W` : 'Unavailable'}
              </span>
            </div>
            <div className="stat-breakdown-item">
              <span className="stat-label">Maximum Absolute Error:</span>
              <span className="stat-value text-mono" id="statMaxAbsError" style={{ color: 'var(--color-predicted-light)' }}>
                {stats?.max_abs_error !== undefined ? `${stats.max_abs_error.toFixed(2)} W` : 'Unavailable'}
              </span>
            </div>
            <div className="stat-breakdown-item">
              <span className="stat-label">Minimum Error (Max Over-pred):</span>
              <span className="stat-value text-mono" id="statMinError" style={{ color: 'var(--color-actual-light)' }}>
                {stats?.min_error !== undefined ? `${stats.min_error.toFixed(2)} W` : 'Unavailable'}
              </span>
            </div>
            <div className="stat-breakdown-item">
              <span className="stat-label">Maximum Error (Max Under-pred):</span>
              <span className="stat-value text-mono" id="statMaxError" style={{ color: 'var(--color-error-light)' }}>
                {stats?.max_error !== undefined ? `${stats.max_error.toFixed(2)} W` : 'Unavailable'}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ErrorAnalysis;
