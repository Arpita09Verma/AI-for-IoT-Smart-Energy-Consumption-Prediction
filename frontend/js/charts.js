/**
 * AI + IoT Smart Energy Consumption Prediction - Charts Controller
 * Renders the interactive dual-line time-series chart and 60-minute future forecast
 * Restrained color system:
 * - Blue (#0ea5e9): Actual power measurements
 * - Orange (#f97316): Predicted power values
 * - Purple (#8b5cf6): Future forecast
 * - Red (#ef4444): Errors & warnings only
 */

class DashboardCharts {
  constructor() {
    this.charts = {};
    this.recentDataStore = [];
    this.futureDataStore = [];
    this.setupDefaults();
    this.registerCrosshairPlugin();
  }

  setupDefaults() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.96)';
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.12)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.legend.labels.color = '#cbd5e1';
  }

  // Register vertical hover crosshair plugin
  registerCrosshairPlugin() {
    if (typeof Chart === 'undefined') return;

    const crosshairPlugin = {
      id: 'verticalCrosshair',
      afterDraw: (chart) => {
        if (chart.tooltip?._active && chart.tooltip._active.length) {
          const activePoint = chart.tooltip._active[0];
          const ctx = chart.ctx;
          const x = activePoint.element.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    Chart.register(crosshairPlugin);
  }

  // Helper: Format ISO timestamp to UTC time string (HH:mm UTC)
  formatUtcTime(isoStr) {
    const d = new Date(isoStr);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${mins} UTC`;
  }

  // Helper: Format full UTC date-time for tooltip header
  formatUtcFull(isoStr) {
    const d = new Date(isoStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[d.getUTCMonth()];
    const day = d.getUTCDate();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${mon} ${day}, ${hours}:${mins} UTC`;
  }

  // =========================================================================
  // Chart Empty & Loading States (Explains what is missing without fake data)
  // =========================================================================
  showChartEmptyState(containerId, { title, description, retryAction }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Destroy chart if exists
    const canvas = container.querySelector('canvas');
    if (canvas && this.charts[canvas.id]) {
      this.charts[canvas.id].destroy();
      delete this.charts[canvas.id];
    }
    if (canvas) canvas.style.display = 'none';

    // Remove existing empty state if present
    const existing = container.querySelector('.chart-empty-state');
    if (existing) existing.remove();

    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'chart-empty-state';
    emptyDiv.innerHTML = `
      <div class="empty-icon-wrap" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h4 class="empty-state-title">${title}</h4>
      <p class="empty-state-desc">${description}</p>
      ${retryAction ? `<button class="btn btn-secondary btn-sm" onclick="${retryAction}">Retry Loading Data</button>` : ''}
    `;
    container.appendChild(emptyDiv);
  }

  clearChartEmptyState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const existing = container.querySelector('.chart-empty-state');
    if (existing) existing.remove();
    const canvas = container.querySelector('canvas');
    if (canvas) canvas.style.display = 'block';
  }

  showChartLoadingState(containerId, message = 'Loading visualization data...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const existing = container.querySelector('.chart-loading-overlay');
    if (existing) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chart-loading-overlay';
    loadingDiv.innerHTML = `
      <div class="loading-mini-spinner" aria-hidden="true"></div>
      <span class="loading-text">${message}</span>
    `;
    container.appendChild(loadingDiv);
  }

  clearChartLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const loading = container.querySelector('.chart-loading-overlay');
    if (loading) loading.remove();
  }

  // =========================================================================
  // SECOND SECTION: Historical Test Performance Chart
  // Actual vs Predicted Power Demand (Latest ~180 minutes)
  // =========================================================================
  renderRecentForecastChart(canvasId, recentData) {
    this.clearChartLoadingState('recentForecastContainer');

    if (!recentData || recentData.length === 0) {
      this.showChartEmptyState('recentForecastContainer', {
        title: 'Historical Test Performance Unavailable',
        description: 'Unable to load <code>recent_test_predictions</code> from <code>forecast_data.json</code>. Please verify that the ML results directory is available.',
        retryAction: 'window.dataLoader.loadForecastJson().then(() => window.renderDashboard(window.dataLoader))'
      });
      return;
    }

    this.clearChartEmptyState('recentForecastContainer');
    this.recentDataStore = recentData;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const labels = recentData.map(d => this.formatUtcTime(d.timestamp));
    const actualValues = recentData.map(d => d.actual_power_w);
    const predictedValues = recentData.map(d => d.predicted_power_w);

    const gradActual = ctx.createLinearGradient(0, 0, 0, 400);
    gradActual.addColorStop(0, 'rgba(14, 165, 233, 0.16)');
    gradActual.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
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
                const row = recentData[idx];
                return `${this.formatUtcFull(row.timestamp)} (Obs #${idx + 1})`;
              },
              label: (item) => ` ${item.dataset.label}: ${Number(item.raw).toFixed(2)} W`,
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const err = recentData[idx].error_w;
                const sign = err >= 0 ? '+' : '';
                return ` Residual Error (Actual - Predicted): ${sign}${err.toFixed(2)} W`;
              }
            }
          },
          zoom: {
            pan: { enabled: true, mode: 'x', modifierKey: null },
            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)', drawTicks: true },
            title: { display: true, text: 'Observation Time (1-minute steps UTC)', color: '#64748b', font: { size: 11 } },
            ticks: { maxTicksLimit: 14, color: '#64748b', font: { family: "'JetBrains Mono', monospace", size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawTicks: true },
            title: { display: true, text: 'Power Demand (Watts)', color: '#94a3b8', font: { weight: '600', size: 12 } },
            ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 }, callback: (v) => `${v} W` }
          }
        }
      }
    });
  }

  zoomIn(chartId = 'recentForecastChart') {
    const chart = this.charts[chartId];
    if (chart && typeof chart.zoom === 'function') chart.zoom(1.25);
  }

  zoomOut(chartId = 'recentForecastChart') {
    const chart = this.charts[chartId];
    if (chart && typeof chart.zoom === 'function') chart.zoom(0.8);
  }

  resetZoom(chartId = 'recentForecastChart') {
    const chart = this.charts[chartId];
    if (chart && typeof chart.resetZoom === 'function') chart.resetZoom();
  }

  setTimeWindow(minutes = 180, chartId = 'recentForecastChart') {
    if (!this.recentDataStore || this.recentDataStore.length === 0) return;
    let sliced = this.recentDataStore;
    if (minutes < 180) {
      sliced = this.recentDataStore.slice(Math.max(0, this.recentDataStore.length - minutes));
    }
    this.renderRecentForecastChart(chartId, sliced);
  }

  // =========================================================================
  // THIRD SECTION: "60-Minute Future Forecast" Visualization
  // Source: forecast_data.json -> future_forecast_60min (All 60 points)
  // X-axis = Future Timestamp
  // Y-axis = Forecast Power in Watts
  // Area/line visualization with subtle horizon band
  // Clearly labeled as MODEL FORECAST (Not sensor measurements)
  // =========================================================================
  renderFutureForecastChart(canvasId, futureData) {
    this.clearChartLoadingState('futureForecastContainer');

    if (!futureData || futureData.length === 0) {
      this.showChartEmptyState('futureForecastContainer', {
        title: '60-Minute Future Forecast Unavailable',
        description: 'Unable to load <code>future_forecast_60min</code> from <code>forecast_data.json</code>. Recursive 60-step model forecasts cannot be rendered.',
        retryAction: 'window.dataLoader.loadForecastJson().then(() => window.renderDashboard(window.dataLoader))'
      });
      return;
    }

    this.clearChartEmptyState('futureForecastContainer');
    this.futureDataStore = futureData;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // X-axis: All 60 future timestamps formatted in UTC
    const labels = futureData.map(d => this.formatUtcTime(d.timestamp));

    // Exact raw 60 forecast points from future_forecast_60min
    const values = futureData.map(d => d.forecast_power_w);

    // Subtle purple forecast area band
    const grad = ctx.createLinearGradient(0, 0, 0, 380);
    grad.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    grad.addColorStop(1, 'rgba(139, 92, 246, 0.02)');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '60-Minute Future Forecast (W)',
            data: values,
            borderColor: '#8b5cf6', // Restrained Purple for model forecast
            backgroundColor: grad,
            borderWidth: 2.2,
            pointRadius: 2.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#a78bfa',
            pointHoverBackgroundColor: '#c084fc',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1,
            tension: 0, // Unsmoothed authentic predictions
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
            labels: {
              boxWidth: 9,
              padding: 14,
              font: { weight: '500' }
            }
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const d = futureData[idx];
                return `Forecast Horizon: Minute ${d.step} of 60 (${this.formatUtcFull(d.timestamp)})`;
              },
              label: (item) => {
                return ` Model Forecast Power: ${Number(item.raw).toFixed(2)} W`;
              },
              afterBody: () => {
                return ` [Model Forecast — Not actual sensor measurement]`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)', drawTicks: true },
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
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawTicks: true },
            title: {
              display: true,
              text: 'Forecast Power (Watts)',
              color: '#94a3b8',
              font: { weight: '600', size: 12 }
            },
            ticks: {
              color: '#94a3b8',
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              callback: (value) => `${value} W`
            }
          }
        }
      }
    });
  }

  // =========================================================================
  // FOURTH SECTION: Dynamic Residual Error Histogram
  // Spread around zero (error_w = actual_power_w - predicted_power_w)
  // Positive = Under-predicted (Actual > Predicted)
  // Negative = Over-predicted (Actual < Predicted)
  // =========================================================================
  renderErrorDistributionChart(canvasId, binData) {
    this.clearChartLoadingState('errorDistChartContainer');

    if (!binData || !binData.labels || !binData.counts || binData.counts.length === 0) {
      this.showChartEmptyState('errorDistChartContainer', {
        title: 'Residual Error Distribution Unavailable',
        description: 'Unable to calculate residual distribution histogram because <code>test_predictions.csv</code> could not be loaded.',
        retryAction: 'window.dataLoader.loadTestPredictionsCsv().then(() => window.renderDashboard(window.dataLoader))'
      });
      return;
    }

    this.clearChartEmptyState('errorDistChartContainer');
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const totalObs = binData.total || binData.counts.reduce((a, b) => a + b, 0);

    const backgroundColors = binData.labels.map((lbl, idx) => {
      const info = binData.binInfo ? binData.binInfo[idx] : null;
      const mid = info ? info.mid : (parseInt(lbl) || 0);

      // Severe outlier spikes (|e| >= 20W) -> Red
      if (Math.abs(mid) >= 20) {
        return 'rgba(239, 68, 68, 0.75)';
      }
      // Zero error center cluster ([-2W, +2W]) -> Emerald Green
      if (info && info.isZero) {
        return 'rgba(16, 185, 129, 0.85)';
      }
      // Negative error (< 0) -> Model Over-predicted (Cyan/Blue)
      if (mid < 0) {
        return 'rgba(56, 189, 248, 0.65)';
      }
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

    this.charts[canvasId] = new Chart(ctx, {
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

                if (info && info.isZero) {
                  return ' 🎯 Peak Accuracy: Zero-centered residual (|e| ≤ 2W)';
                }
                if (mid < 0) {
                  return ' 🔵 Negative Residual: Model Over-predicted (Actual < Predicted)';
                }
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
  }
}

// Export singleton
window.dashboardCharts = new DashboardCharts();
