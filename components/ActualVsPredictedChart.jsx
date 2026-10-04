import React, { useEffect, useRef, useState } from 'react';

/**
 * Actual vs Predicted Power Demand Dual-Line Time-Series Chart
 * Visualizes authentic ~180 minutes of test predictions from forecast_data.json
 * Restrained colors:
 * - Blue (#0ea5e9): Actual power measurements
 * - Orange (#f97316): Predicted power values
 */
export const ActualVsPredictedChart = ({
  data = [],
  loading = false,
  error = null,
  onRetry,
  onOpenModal
}) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [timeWindow, setTimeWindow] = useState(180);
  const [showStaticFallback, setShowStaticFallback] = useState(false);

  // Helper: Format UTC time
  const formatUtcTime = (isoStr) => {
    const d = new Date(isoStr);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${mins} UTC`;
  };

  const formatUtcFull = (isoStr) => {
    const d = new Date(isoStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
  };

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0 || showStaticFallback) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const Chart = window.Chart;
    if (!Chart) return;

    // Filter by selected time window
    const sliced = timeWindow < 180 ? data.slice(Math.max(0, data.length - timeWindow)) : data;

    const ctx = canvasRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = sliced.map(d => formatUtcTime(d.timestamp));
    const actualValues = sliced.map(d => d.actual_power_w);
    const predictedValues = sliced.map(d => d.predicted_power_w);

    const gradActual = ctx.createLinearGradient(0, 0, 0, 400);
    gradActual.addColorStop(0, 'rgba(14, 165, 233, 0.16)');
    gradActual.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Actual Power (W)',
            data: actualValues,
            borderColor: '#0ea5e9',
            backgroundColor: gradActual,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#0ea5e9',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 1.5,
            tension: 0,
            fill: true
          },
          {
            label: 'Predicted Power (W)',
            data: predictedValues,
            borderColor: '#f97316',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#f97316',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 1.5,
            tension: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: { boxWidth: 9, padding: 14, font: { weight: '500' } }
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const row = sliced[idx];
                return `${formatUtcFull(row.timestamp)} (Obs #${idx + 1})`;
              },
              label: (item) => ` ${item.dataset.label}: ${Number(item.raw).toFixed(2)} W`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const err = sliced[idx].error_w;
                const sign = err >= 0 ? '+' : '';
                return ` Residual Error (Actual - Predicted): ${sign}${err.toFixed(2)} W`;
              }
            }
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            title: { display: true, text: 'Observation Time (1-minute steps UTC)', color: '#64748b', font: { size: 11 } },
            ticks: { maxTicksLimit: 14, color: '#64748b', font: { family: "'JetBrains Mono', monospace", size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            title: { display: true, text: 'Power Demand (Watts)', color: '#94a3b8', font: { weight: '600', size: 12 } },
            ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 }, callback: (v) => `${v} W` }
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
  }, [data, timeWindow, showStaticFallback]);

  const handleZoom = (factor) => {
    if (chartInstanceRef.current && typeof chartInstanceRef.current.zoom === 'function') {
      chartInstanceRef.current.zoom(factor);
    }
  };

  const handleResetZoom = () => {
    if (chartInstanceRef.current && typeof chartInstanceRef.current.resetZoom === 'function') {
      chartInstanceRef.current.resetZoom();
    }
  };

  return (
    <section className="dashboard-section" id="forecast-section" aria-label="Forecast: Actual vs Predicted Power Demand">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">2</span>
          <div>
            <h2 className="section-title">Historical Test Performance</h2>
            <p className="section-subtitle">Actual vs one-minute-ahead predicted power demand</p>
          </div>
        </div>

        <div className="card-actions">
          {/* Visual Legend Tags */}
          <div className="chart-meta-tags">
            <span className="badge-indicator badge-actual">
              <span className="color-dot dot-actual"></span>
              Actual Power (W)
            </span>
            <span className="badge-indicator badge-predicted">
              <span className="color-dot dot-predicted"></span>
              Predicted Power (W)
            </span>
          </div>

          {/* Timeframe Filters */}
          <div className="btn-group">
            <button
              className={`btn-group-btn ${timeWindow === 60 ? 'active' : ''}`}
              onClick={() => setTimeWindow(60)}
            >
              60m
            </button>
            <button
              className={`btn-group-btn ${timeWindow === 120 ? 'active' : ''}`}
              onClick={() => setTimeWindow(120)}
            >
              120m
            </button>
            <button
              className={`btn-group-btn ${timeWindow === 180 ? 'active' : ''}`}
              onClick={() => setTimeWindow(180)}
            >
              All 180m
            </button>
          </div>

          {/* Zoom / Pan */}
          <div className="btn-group" title="Zoom & Pan controls">
            <button className="btn-group-btn" onClick={() => handleZoom(1.25)} title="Zoom In">+</button>
            <button className="btn-group-btn" onClick={() => handleZoom(0.8)} title="Zoom Out">&minus;</button>
            <button className="btn-group-btn" onClick={handleResetZoom} title="Reset Zoom">&#8635; Reset</button>
          </div>

          {/* Toggle Static Fallback */}
          <button
            className={`btn btn-secondary btn-sm ${showStaticFallback ? 'btn-outline' : ''}`}
            onClick={() => setShowStaticFallback(prev => !prev)}
          >
            {showStaticFallback ? 'Switch to Dynamic Chart' : 'View Static Fallback PNG'}
          </button>
        </div>
      </div>

      <article className="glass-card">
        <div className="chart-container-large" id="recentForecastContainer" style={{ position: 'relative' }}>
          {loading && (
            <div className="chart-loading-overlay">
              <div className="loading-mini-spinner" aria-hidden="true"></div>
              <span>Loading historical test observations (forecast_data.json)...</span>
            </div>
          )}

          {(!loading && (error || !data || data.length === 0) && !showStaticFallback) && (
            <div className="chart-empty-state">
              <div className="empty-icon-wrap" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h4 className="empty-state-title">Historical Test Performance Unavailable</h4>
              <p className="empty-state-desc">
                {error || 'Unable to load forecast_data.json. Please verify that the ML results directory is available.'}
              </p>
              {onRetry && (
                <button className="btn btn-secondary btn-sm" onClick={onRetry}>
                  Retry Loading Data
                </button>
              )}
            </div>
          )}

          {/* Canvas for dynamic Chart.js */}
          <canvas
            ref={canvasRef}
            id="recentForecastChart"
            style={{ display: showStaticFallback ? 'none' : 'block' }}
          />

          {/* Static Fallback PNG */}
          {showStaticFallback && (
            <div
              className="gallery-img-wrap"
              style={{ display: 'flex', height: 440, background: '#050811', borderRadius: 'var(--radius-md)' }}
            >
              <img
                src="AI_IoT_Project/results/actual_vs_predicted.png"
                alt="Static Fallback: Actual vs Predicted Time-Series Plot"
                style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => onOpenModal && onOpenModal('AI_IoT_Project/results/actual_vs_predicted.png', 'Static Fallback Chart: Actual vs Predicted Power Demand')}
              />
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default ActualVsPredictedChart;
