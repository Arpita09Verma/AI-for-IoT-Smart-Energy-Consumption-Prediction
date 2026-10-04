/**
 * AI + IoT Smart Energy Consumption Prediction
 * Data Service
 * 
 * Responsible for loading authentic ML output files:
 * 1. AI_IoT_Project/results/forecast_data.json
 * 2. AI_IoT_Project/results/evaluation_metrics.json
 * 3. AI_IoT_Project/results/test_predictions.csv
 * 
 * Strict Anti-Mock Policy:
 * - Never replaces missing files with synthetic or fake data
 * - Reports exact, actionable error messages
 * - Provides retry capabilities without crashing the UI
 */

class DataService {
  constructor() {
    this.forecastData = null;
    this.evaluationMetrics = null;
    this.testPredictions = []; // Array of 27,714 authentic observations
    this.loading = {
      forecast: false,
      metrics: false,
      csv: false
    };
    this.errors = {
      forecast: null,
      metrics: null,
      csv: null
    };
    this.listeners = new Set();
    this.pollingTimer = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(isUpdate = false) {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state, isUpdate));
  }

  getState() {
    return {
      forecastData: this.forecastData,
      evaluationMetrics: this.forecastData?.evaluation_metrics || this.evaluationMetrics,
      testPredictions: this.testPredictions,
      loading: { ...this.loading },
      errors: { ...this.errors },
      hasErrors: Boolean(this.errors.forecast || this.errors.metrics || this.errors.csv),
      failedFiles: this.getFailedFiles()
    };
  }

  getFailedFiles() {
    const list = [];
    if (this.errors.forecast) {
      list.push({ file: 'forecast_data.json', error: this.errors.forecast });
    }
    if (this.errors.metrics) {
      list.push({ file: 'evaluation_metrics.json', error: this.errors.metrics });
    }
    if (this.errors.csv) {
      list.push({ file: 'test_predictions.csv', error: this.errors.csv });
    }
    return list;
  }

  async loadForecastData() {
    const path = `AI_IoT_Project/results/forecast_data.json?_t=${Date.now()}`;
    this.loading.forecast = true;
    this.notify();

    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      this.forecastData = data;
      this.errors.forecast = null;
      if (data.evaluation_metrics) {
        this.evaluationMetrics = data.evaluation_metrics;
        this.errors.metrics = null;
      }
    } catch (err) {
      console.error('[DataService] Failed to load forecast_data.json:', err);
      this.forecastData = null;
      this.errors.forecast = 'Unable to load forecast_data.json. Please verify that the ML results directory is available.';
    } finally {
      this.loading.forecast = false;
      this.notify();
    }
  }

  async loadEvaluationMetrics() {
    const path = 'AI_IoT_Project/results/evaluation_metrics.json';
    this.loading.metrics = true;
    this.notify();

    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      this.evaluationMetrics = data;
      this.errors.metrics = null;
    } catch (err) {
      console.warn('[DataService] Failed to load evaluation_metrics.json directly:', err);
      if (this.forecastData?.evaluation_metrics) {
        this.evaluationMetrics = this.forecastData.evaluation_metrics;
        this.errors.metrics = null;
      } else {
        this.evaluationMetrics = null;
        this.errors.metrics = 'Unable to load evaluation_metrics.json. Please verify that the ML results directory is available.';
      }
    } finally {
      this.loading.metrics = false;
      this.notify();
    }
  }

  async loadTestPredictionsCsv() {
    const path = 'AI_IoT_Project/results/test_predictions.csv';
    this.loading.csv = true;
    this.notify();

    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const csvText = await res.text();
      this.testPredictions = this.parseCsv(csvText);
      this.errors.csv = null;
    } catch (err) {
      console.error('[DataService] Failed to load test_predictions.csv:', err);
      this.testPredictions = [];
      this.errors.csv = 'Unable to load test_predictions.csv. Please verify that the ML results directory is available.';
    } finally {
      this.loading.csv = false;
      this.notify();
    }
  }

  parseCsv(csvText) {
    const lines = csvText.split('\n');
    const records = [];
    // Header format: timestamp,actual_power_w,predicted_power_w,error_w
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 4) {
        records.push({
          index: i,
          timestamp: parts[0],
          actual_power_w: parseFloat(parts[1]),
          predicted_power_w: parseFloat(parts[2]),
          error_w: parseFloat(parts[3])
        });
      }
    }
    return records;
  }

  async loadAll() {
    await Promise.all([
      this.loadForecastData(),
      this.loadEvaluationMetrics(),
      this.loadTestPredictionsCsv()
    ]);
  }

  async retryFailed() {
    const promises = [];
    if (this.errors.forecast) promises.push(this.loadForecastData());
    if (this.errors.metrics) promises.push(this.loadEvaluationMetrics());
    if (this.errors.csv) promises.push(this.loadTestPredictionsCsv());
    await Promise.all(promises);
  }

  startPolling(intervalMs = 8000) {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = setInterval(async () => {
      await this.checkForUpdates();
    }, intervalMs);
  }

  stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  async checkForUpdates() {
    const path = `AI_IoT_Project/results/forecast_data.json?_t=${Date.now()}`;
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) return;
      const newJson = await res.json();
      const oldMetrics = JSON.stringify(this.forecastData?.evaluation_metrics);
      const newMetrics = JSON.stringify(newJson?.evaluation_metrics);

      this.forecastData = newJson;
      this.errors.forecast = null;
      if (newJson.evaluation_metrics) {
        this.evaluationMetrics = newJson.evaluation_metrics;
        this.errors.metrics = null;
      }

      if (oldMetrics !== newMetrics) {
        this.notify(true);
      }
    } catch {
      // Quietly continue background polling
    }
  }

  computeErrorDistributionBins(step = 2, min = -24, max = 24) {
    const errors = this.testPredictions.map(d => d.error_w);
    if (errors.length === 0) return { labels: [], counts: [], binInfo: [], total: 0 };

    const binCount = Math.floor((max - min) / step);
    const counts = new Array(binCount).fill(0);
    const labels = [];
    const binInfo = [];

    let leftTail = 0;
    let rightTail = 0;

    for (let i = 0; i < binCount; i++) {
      const low = min + i * step;
      const high = low + step;
      const mid = (low + high) / 2;

      let label = '';
      if (low === 0) label = `0 to +${high}W`;
      else if (high === 0) label = `${low} to 0W`;
      else if (low > 0) label = `+${low} to +${high}W`;
      else label = `${low} to ${high}W`;

      labels.push(label);
      binInfo.push({
        low,
        high,
        mid,
        isZero: low <= 0 && high >= 0,
        type: mid > 0 ? 'under' : (mid < 0 ? 'over' : 'exact')
      });
    }

    errors.forEach(err => {
      if (err < min) {
        leftTail++;
      } else if (err >= max) {
        rightTail++;
      } else {
        const binIdx = Math.floor((err - min) / step);
        if (binIdx >= 0 && binIdx < binCount) {
          counts[binIdx]++;
        }
      }
    });

    return {
      labels,
      counts,
      binInfo,
      leftTail,
      rightTail,
      total: errors.length
    };
  }
}

export const dataService = new DataService();
export default dataService;
