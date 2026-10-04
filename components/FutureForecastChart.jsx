import React, { useEffect, useRef } from 'react';

/**
 * 60-Minute Future Forecast Component
 * Visualizes authentic 60 forecast points from forecast_data.json -> future_forecast_60min
 * Color: Purple (#8b5cf6)
 * Explicitly labeled as MODEL FORECASTS (Not actual sensor measurements)
 */
export const FutureForecastChart = ({
  data = [],
  loading = false,
  error = null,
  onRetry
}) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

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
    if (!canvasRef.current || !data || data.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const Chart = window.Chart;
    if (!Chart) return;

    const ctx = canvasRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map(d => formatUtcTime(d.timestamp));
    const values = data.map(d => d.forecast_power_w);

    const grad = ctx.createLinearGradient(0, 0, 0, 380);
    grad.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    grad.addColorStop(1, 'rgba(139, 92, 246, 0.02)');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '60-Minute Future Forecast (W)',
            data: values,
            borderColor: '#8b5cf6',
            backgroundColor: grad,
            borderWidth: 2.2,
            pointRadius: 2.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#a78bfa',
            pointHoverBackgroundColor: '#c084fc',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1,
            tension: 0,
            fill: true
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
                const d = data[idx];
                return `Forecast Horizon: Minute ${d.step} of 60 (${formatUtcFull(d.timestamp)})`;
              },
              label: (item) => ` Model Forecast Power: ${Number(item.raw).toFixed(2)} W`,
              afterBody: () => ' [Model Forecast — Not actual sensor measurement]'
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            title: {
              display: true,
              text: 'Future Timestamp (Minute 1 to Minute 60 Horizon UTC)',
              color: '#64748b',
              font: { size: 11 }
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
              text: 'Forecast Power (Watts)',
              color: '#94a3b8',
              font: { weight: '600', size: 12 }
            },
            ticks: {
              color: '#94a3b8',
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              callback: (val) => `${val} W`
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
  }, [data]);

  return (
    <section className="dashboard-section" id="future-forecast-section" aria-label="60-Minute Future Forecast">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num-badge">3</span>
          <div>
            <h2 className="section-title">60-Minute Future Forecast</h2>
            <p className="section-subtitle">Forecast horizon from minute 1 to minute 60 beyond test boundary</p>
          </div>
        </div>

        <div className="card-actions">
          <div className="chart-meta-tags">
            <span className="badge-indicator badge-forecast">
              <span className="color-dot dot-forecast"></span>
              Model Forecast Power (W)
            </span>
            <span className="badge-indicator badge-neutral">
              Horizon: 60 Minutes (t+1 to t+60)
            </span>
          </div>
        </div>
      </div>

      <article className="glass-card">
        {/* Required Informational Note */}
        <div className="forecast-notice-banner" role="note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <strong>Informational Note:</strong> Recursive forecast beyond the test dataset boundary.{' '}
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
              These values are <strong>MODEL FORECASTS</strong> generated via autoregressive multi-step recursion, not actual measured sensor values.
            </span>
          </div>
        </div>

        {/* Dynamic Forecast Canvas */}
        <div className="chart-container-large" id="futureForecastContainer" style={{ position: 'relative' }}>
          {loading && (
            <div className="chart-loading-overlay">
              <div className="loading-mini-spinner" aria-hidden="true"></div>
              <span>Loading recursive 60-minute future forecast (forecast_data.json)...</span>
            </div>
          )}

          {(!loading && (error || !data || data.length === 0)) && (
            <div className="chart-empty-state">
              <div className="empty-icon-wrap" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h4 className="empty-state-title">60-Minute Future Forecast Unavailable</h4>
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

          <canvas ref={canvasRef} id="futureForecastChart" />
        </div>

        {/* 60-Step Horizon Grid */}
        <div className="forecast-steps-grid" id="forecastStepsGrid" aria-label="Minute-by-minute forecast horizon points">
          {(!data || data.length === 0) ? (
            <div style={{ gridColumn: '1 / -1', padding: '1.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              Recursive forecast steps unavailable because forecast_data.json could not be loaded.
            </div>
          ) : (
            data.map(d => {
              const dt = new Date(d.timestamp);
              const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              return (
                <div className="forecast-step-card" key={d.step}>
                  <div className="step-num">+{d.step} MIN (t+{d.horizon_minute})</div>
                  <div className="step-val">{Number(d.forecast_power_w).toFixed(2)} W</div>
                  <div className="step-time">{timeStr} UTC</div>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
};

export default FutureForecastChart;
