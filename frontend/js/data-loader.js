/**
 * AI for IoT Smart Energy Consumption Prediction - Data Loader
 * Exclusively loads and serves authentic ML results from:
 * 1. AI_IoT_Project/results/forecast_data.json (Primary dashboard feed & methodology)
 * 2. AI_IoT_Project/results/evaluation_metrics.json (Standalone evaluation metrics)
 * 3. AI_IoT_Project/results/test_predictions.csv (Full 27,714 test inferences)
 */

class DataLoader {
  constructor() {
    this.forecastData = null;
    this.evaluationMetrics = null;
    this.testPredictions = []; // 27,714 rows from test_predictions.csv
    this.fileStatuses = {
      forecastJson: { path: 'AI_IoT_Project/results/forecast_data.json', loaded: false, size: 0, error: null },
      metricsJson: { path: 'AI_IoT_Project/results/evaluation_metrics.json', loaded: false, size: 0, error: null },
      testCsv: { path: 'AI_IoT_Project/results/test_predictions.csv', loaded: false, rows: 0, error: null }
    };
    this.errors = {
      forecastJson: null,
      metricsJson: null,
      testCsv: null
    };
    this.isLoading = {
      forecastJson: false,
      metricsJson: false,
      testCsv: false
    };
    this.listeners = [];
  }

  onDataLoaded(callback) {
    this.listeners.push(callback);
  }

  notifyLoaded(isUpdate = false) {
    this.listeners.forEach(cb => cb(this, isUpdate));
  }

  hasErrors() {
    return Boolean(this.errors.forecastJson || this.errors.metricsJson || this.errors.testCsv);
  }

  getFailedFiles() {
    const list = [];
    if (this.errors.forecastJson) {
      list.push({ file: 'forecast_data.json', error: this.errors.forecastJson });
    }
    if (this.errors.metricsJson) {
      list.push({ file: 'evaluation_metrics.json', error: this.errors.metricsJson });
    }
    if (this.errors.testCsv) {
      list.push({ file: 'test_predictions.csv', error: this.errors.testCsv });
    }
    return list;
  }

  async initialize() {
    console.log('[DataLoader] Loading authentic ML result files...');

    // 1. Load forecast_data.json (Primary dashboard feed)
    await this.loadForecastJson();

    // 2. Load evaluation_metrics.json (KPI / Performance)
    await this.loadEvaluationMetricsJson();

    // 3. Load test_predictions.csv (Full 27,714 test observations)
    await this.loadTestPredictionsCsv();

    this.notifyLoaded(false);
    return this;
  }

  async retryFailedFiles() {
    console.log('[DataLoader] Retrying failed files...');
    const retryPromises = [];
    if (this.errors.forecastJson) {
      retryPromises.push(this.loadForecastJson());
    }
    if (this.errors.metricsJson) {
      retryPromises.push(this.loadEvaluationMetricsJson());
    }
    if (this.errors.testCsv) {
      retryPromises.push(this.loadTestPredictionsCsv());
    }
    await Promise.all(retryPromises);
    this.notifyLoaded(false);
  }

  /**
   * Start polling forecast_data.json periodically to detect changes automatically
   */
  startPolling(intervalMs = 8000) {
    if (this._pollingTimer) clearInterval(this._pollingTimer);
    this._pollingTimer = setInterval(async () => {
      await this.checkForUpdates();
    }, intervalMs);
  }

  stopPolling() {
    if (this._pollingTimer) {
      clearInterval(this._pollingTimer);
      this._pollingTimer = null;
    }
  }

  /**
   * Checks if forecast_data.json has changed on disk/server
   */
  async checkForUpdates() {
    const filePath = `AI_IoT_Project/results/forecast_data.json?_t=${Date.now()}`;
    try {
      const res = await fetch(filePath, { cache: 'no-store' });
      if (!res.ok) return;
      const newJson = await res.json();
      
      const oldMetricsStr = JSON.stringify(this.forecastData?.evaluation_metrics);
      const newMetricsStr = JSON.stringify(newJson?.evaluation_metrics);

      this.forecastData = newJson;
      this.errors.forecastJson = null;
      this.fileStatuses.forecastJson.loaded = true;
      if (newJson.evaluation_metrics) {
        this.evaluationMetrics = newJson.evaluation_metrics;
        this.errors.metricsJson = null;
        this.fileStatuses.metricsJson.loaded = true;
      }

      if (oldMetricsStr !== newMetricsStr) {
        console.log('[DataLoader] Detected update in forecast_data.json evaluation_metrics! Updating UI...');
        this.notifyLoaded(true);
      }
    } catch (e) {
      // Offline / silent fail during background poll
    }
  }

  async reloadForecastData() {
    await this.loadForecastJson();
    await this.loadEvaluationMetricsJson();
    this.notifyLoaded(true);
  }

  async loadForecastJson() {
    const filePath = `AI_IoT_Project/results/forecast_data.json?_t=${Date.now()}`;
    this.isLoading.forecastJson = true;
    try {
      const res = await fetch(filePath, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      this.forecastData = json;
      this.fileStatuses.forecastJson.loaded = true;
      this.fileStatuses.forecastJson.error = null;
      this.errors.forecastJson = null;
      console.log(`[DataLoader] Successfully loaded ${filePath}`);
    } catch (e) {
      console.error(`[DataLoader] Error loading ${filePath}:`, e);
      this.forecastData = null;
      this.fileStatuses.forecastJson.loaded = false;
      this.fileStatuses.forecastJson.error = e.message;
      // Clear error message identifying which file failed without using fake data
      this.errors.forecastJson = 'Unable to load forecast_data.json. Please verify that the ML results directory is available.';
    } finally {
      this.isLoading.forecastJson = false;
    }
  }

  async loadEvaluationMetricsJson() {
    const filePath = 'AI_IoT_Project/results/evaluation_metrics.json';
    this.isLoading.metricsJson = true;
    try {
      const res = await fetch(filePath);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      this.evaluationMetrics = json;
      this.fileStatuses.metricsJson.loaded = true;
      this.fileStatuses.metricsJson.error = null;
      this.errors.metricsJson = null;
      console.log(`[DataLoader] Successfully loaded ${filePath}`);
    } catch (e) {
      console.warn(`[DataLoader] Fetch failed for ${filePath}:`, e);
      // Check if forecast_data.json contains authentic evaluation_metrics
      if (this.forecastData && this.forecastData.evaluation_metrics) {
        this.evaluationMetrics = this.forecastData.evaluation_metrics;
        this.fileStatuses.metricsJson.loaded = true;
        this.fileStatuses.metricsJson.error = null;
        this.errors.metricsJson = null;
      } else {
        this.evaluationMetrics = null;
        this.fileStatuses.metricsJson.loaded = false;
        this.fileStatuses.metricsJson.error = e.message;
        this.errors.metricsJson = 'Unable to load evaluation_metrics.json. Please verify that the ML results directory is available.';
      }
    } finally {
      this.isLoading.metricsJson = false;
    }
  }

  async loadTestPredictionsCsv() {
    const filePath = 'AI_IoT_Project/results/test_predictions.csv';
    this.isLoading.testCsv = true;
    try {
      const res = await fetch(filePath);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const csvText = await res.text();
      this.parseCsvContent(csvText);
      this.fileStatuses.testCsv.loaded = true;
      this.fileStatuses.testCsv.rows = this.testPredictions.length;
      this.fileStatuses.testCsv.error = null;
      this.errors.testCsv = null;
      console.log(`[DataLoader] Successfully loaded ${filePath} (${this.testPredictions.length} rows)`);
    } catch (e) {
      console.error(`[DataLoader] Could not fetch ${filePath}:`, e);
      // Do NOT replace missing data with fake values or mock data
      this.testPredictions = [];
      this.fileStatuses.testCsv.loaded = false;
      this.fileStatuses.testCsv.rows = 0;
      this.fileStatuses.testCsv.error = e.message;
      this.errors.testCsv = 'Unable to load test_predictions.csv. Please verify that the ML results directory is available.';
    } finally {
      this.isLoading.testCsv = false;
    }
  }

  parseCsvContent(csvText) {
    const lines = csvText.split('\n');
    const records = [];
    
    // Header row: timestamp,actual_power_w,predicted_power_w,error_w
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
    this.testPredictions = records;
  }

  // Retrieve exact subset of test predictions for time-range visualization
  getExactHistoricalSlice(rangeMode = 'all') {
    if (!this.testPredictions || this.testPredictions.length === 0) {
      return [];
    }

    const total = this.testPredictions.length;

    if (rangeMode === 'recent180') {
      return this.testPredictions.slice(Math.max(0, total - 180));
    }
    if (rangeMode === 'day1') {
      return this.testPredictions.slice(Math.max(0, total - 1440));
    }
    if (rangeMode === 'days3') {
      return this.testPredictions.slice(Math.max(0, total - 4320));
    }

    // For all 27,714 points: systematically sample every Nth point to preserve exact observations without calculation
    const stride = Math.ceil(total / 600);
    const sampled = [];
    for (let i = 0; i < total; i += stride) {
      sampled.push(this.testPredictions[i]);
    }
    if (sampled[sampled.length - 1] !== this.testPredictions[total - 1]) {
      sampled.push(this.testPredictions[total - 1]);
    }
    return sampled;
  }

  // Count error histogram frequencies directly from test_predictions.csv error_w column
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

// Export singleton
window.dataLoader = new DataLoader();
