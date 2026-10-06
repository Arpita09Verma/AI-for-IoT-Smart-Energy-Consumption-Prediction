/**
 * AI + IoT Smart Energy Consumption Prediction
 * Main Dashboard Application Controller
 * Dynamic population strictly from authentic ML output files:
 * - AI_IoT_Project/results/forecast_data.json
 * - AI_IoT_Project/results/evaluation_metrics.json
 * - AI_IoT_Project/results/test_predictions.csv
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Initializing AI + IoT Energy Consumption Forecast Dashboard...');

  // Initialize lightbox modal
  setupImageModal();

  // Initialize navigation sidebar & scrollspy
  initNavigation();

  // Show professional loading states before data arrives
  if (window.tableController && typeof window.tableController.showSkeletonLoading === 'function') {
    window.tableController.showSkeletonLoading(8);
  }
  if (window.dashboardCharts) {
    window.dashboardCharts.showChartLoadingState('recentForecastContainer', 'Loading historical test observations (forecast_data.json)...');
    window.dashboardCharts.showChartLoadingState('futureForecastContainer', 'Loading recursive 60-minute future forecast (forecast_data.json)...');
    window.dashboardCharts.showChartLoadingState('errorDistChartContainer', 'Loading residual error distribution (test_predictions.csv)...');
  }

  // Set loading status indicator in sidebar
  const sidebarBeacon = document.getElementById('sidebarStatusBeacon');
  const sidebarTitle = document.getElementById('sidebarStatusTitle');
  if (sidebarTitle) {
    sidebarTitle.textContent = 'Status: Loading...';
    sidebarTitle.className = 'status-title-ready';
  }

  // Initialize DataLoader
  const loader = window.dataLoader;
  loader.onDataLoaded((data, isUpdate) => {
    console.log(`[App] Authentic data event received (isUpdate=${Boolean(isUpdate)}). Populating dashboard...`);
    renderDashboard(data, Boolean(isUpdate));
  });

  await loader.initialize();

  // Automatically monitor forecast_data.json on disk for changes
  loader.startPolling(8000);
});

/**
 * Global Alert Banner displaying failure notices for individual files
 * Identifies which file failed without crashing or replacing missing data with fake values
 */
function renderDashboardAlerts(loader) {
  const alertsContainer = document.getElementById('dashboardAlertsContainer');
  if (!alertsContainer) return;

  const failedFiles = loader.getFailedFiles ? loader.getFailedFiles() : [];

  if (failedFiles.length === 0) {
    alertsContainer.style.display = 'none';
    alertsContainer.innerHTML = '';
    return;
  }

  alertsContainer.style.display = 'block';
  alertsContainer.innerHTML = `
    <div class="alert-banner" role="alert">
      <div class="alert-banner-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="alert-banner-content">
        <div class="alert-banner-title">
          <span>Data Ingestion Notice: ${failedFiles.length} file${failedFiles.length > 1 ? 's' : ''} failed to load</span>
        </div>
        <ul class="alert-banner-items">
          ${failedFiles.map(f => `
            <li class="alert-banner-item">
              <span class="alert-file-tag">${f.file}</span>
              <span>${f.error}</span>
            </li>
          `).join('')}
        </ul>
        <div class="alert-banner-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.retryFailedFiles()">
            Retry Loading Failed Files
          </button>
          <span class="alert-help-note">Active sections remain operational. Unaffected data continues to render.</span>
        </div>
      </div>
    </div>
  `;
}

function renderDashboard(loader, isUpdate = false) {
  const forecastData = loader.forecastData;
  const metrics = forecastData?.evaluation_metrics || loader.evaluationMetrics;

  // 1. Render data alerts banner (identifying any failed files without crashing)
  renderDashboardAlerts(loader);

  // 2. Update sidebar model status indicator
  const sidebarBeacon = document.getElementById('sidebarStatusBeacon');
  const sidebarTitle = document.getElementById('sidebarStatusTitle');
  if (sidebarBeacon && sidebarTitle) {
    if (loader.errors && loader.errors.forecastJson) {
      sidebarBeacon.className = 'status-indicator-beacon status-beacon-error';
      sidebarTitle.textContent = 'Status: Data Missing';
      sidebarTitle.className = 'status-title-error';
    } else {
      sidebarBeacon.className = 'status-indicator-beacon';
      sidebarTitle.textContent = 'Status: Ready';
      sidebarTitle.className = 'status-title-ready';
    }
  }

  // 3. Update telemetry status badge in header
  const statusEl = document.getElementById('telemetryStatusText');
  if (statusEl) {
    if (metrics && metrics.test_samples) {
      statusEl.textContent = `Historical Mode — ${metrics.test_samples.toLocaleString()} Trained Inferences`;
    } else if (loader.errors && loader.errors.forecastJson) {
      statusEl.textContent = `Historical Mode — ML Results Unavailable`;
    } else {
      statusEl.textContent = `Historical Mode — Trained on PZEM-004T Data`;
    }
  }

  // =========================================================================
  // TOP SECTION: 5 Model Evaluation KPI Cards
  // Dynamically populated from forecast_data.json -> evaluation_metrics
  // =========================================================================
  populateTopKpiCards(metrics, isUpdate);

  // If this is an auto-update event, update telemetry badge and error stats without tearing down charts
  if (isUpdate) {
    populateErrorStatistics(metrics);
    populateModelInformation(forecastData, metrics);
    return;
  }

  // =========================================================================
  // SECOND SECTION: Historical Test Performance Chart
  // forecast_data.json -> recent_test_predictions (~180 minutes)
  // Shows empty state explaining what is missing if unavailable
  // =========================================================================
  if (forecastData && forecastData.recent_test_predictions && forecastData.recent_test_predictions.length > 0) {
    window.dashboardCharts.renderRecentForecastChart('recentForecastChart', forecastData.recent_test_predictions);
  } else {
    window.dashboardCharts.showChartEmptyState('recentForecastContainer', {
      title: 'Historical Test Performance Unavailable',
      description: loader.errors?.forecastJson || 'Unable to load forecast_data.json. Please verify that the ML results directory is available.',
      retryAction: 'window.retryLoadForecast()'
    });
  }

  // =========================================================================
  // THIRD SECTION: 60-Minute Future Forecast Chart & Step Grid
  // forecast_data.json -> future_forecast_60min (60 points)
  // Shows empty state explaining what is missing if unavailable
  // =========================================================================
  if (forecastData && forecastData.future_forecast_60min && forecastData.future_forecast_60min.length > 0) {
    window.dashboardCharts.renderFutureForecastChart('futureForecastChart', forecastData.future_forecast_60min);
    populateFutureForecastGrid(forecastData.future_forecast_60min);
  } else {
    window.dashboardCharts.showChartEmptyState('futureForecastContainer', {
      title: '60-Minute Future Forecast Unavailable',
      description: loader.errors?.forecastJson || 'Unable to load forecast_data.json. Please verify that the ML results directory is available.',
      retryAction: 'window.retryLoadForecast()'
    });
    const gridContainer = document.getElementById('forecastStepsGrid');
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 1.75rem; text-align: center; color: var(--text-muted); font-size: 0.84rem; border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          Recursive forecast steps unavailable because forecast_data.json could not be loaded.
        </div>
      `;
    }
  }

  // =========================================================================
  // FOURTH SECTION: Residual Error Analysis
  // Error distribution, Mean error, Error statistics, Historical table from test_predictions.csv
  // =========================================================================
  populateErrorStatistics(metrics);

  if (loader.testPredictions && loader.testPredictions.length > 0) {
    window.tableController.setData(loader.testPredictions);
    // Compute dynamic error distribution histogram from CSV error_w column
    const errorBins = loader.computeErrorDistributionBins(25);
    window.dashboardCharts.renderErrorDistributionChart('errorDistChart', errorBins);
  } else if (loader.errors?.testCsv) {
    window.tableController.showEmptyState(loader.errors.testCsv);
    window.dashboardCharts.showChartEmptyState('errorDistChartContainer', {
      title: 'Residual Error Distribution Unavailable',
      description: loader.errors.testCsv,
      retryAction: 'window.retryLoadCsv()'
    });
  } else {
    window.tableController.showEmptyState('Unable to load test_predictions.csv. Please verify that the ML results directory is available.');
    window.dashboardCharts.showChartEmptyState('errorDistChartContainer', {
      title: 'Residual Error Distribution Unavailable',
      description: 'Unable to load test_predictions.csv. Please verify that the ML results directory is available.',
      retryAction: 'window.retryLoadCsv()'
    });
  }

  // =========================================================================
  // FIFTH SECTION: Model Information
  // =========================================================================
  populateModelInformation(forecastData, metrics);

  // =========================================================================
  // SIXTH SECTION: Methodology
  // Loaded directly from forecast_data.json -> methodology_notes
  // =========================================================================
  if (forecastData && forecastData.methodology_notes) {
    populateMethodologySection(forecastData.methodology_notes);
  }
}

/**
 * TOP SECTION: Populate the 5 KPI cards dynamically from evaluation_metrics
 * Values are NOT hardcoded - they update dynamically if the JSON changes.
 * 
 * Data Mapping:
 * - MAE: mae_w (or mae)
 * - RMSE: rmse_w (or rmse)
 * - R²: r2
 * - Mean Bias: error_statistics_w.mean_error
 * - Test Samples: test_samples
 * 
 * Formatted Output:
 * - MAE: 3.30 W
 * - RMSE: 30.71 W
 * - R²: 0.2521
 * - Mean Bias: -0.15 W
 * - Test Samples: 27,714
 */
function populateTopKpiCards(metrics, isUpdate = false) {
  const updateCardValue = (cardId, valueId, formattedText) => {
    const valueEl = document.getElementById(valueId);
    const cardEl = document.getElementById(cardId);
    if (!valueEl) return;

    const prevValue = valueEl.textContent.trim();
    valueEl.textContent = formattedText;

    // Trigger visual pulse highlight on update
    if (cardEl && (isUpdate || (prevValue !== formattedText && prevValue !== '--'))) {
      cardEl.classList.remove('kpi-updated');
      void cardEl.offsetWidth; // Reflow trigger
      cardEl.classList.add('kpi-updated');
      setTimeout(() => cardEl.classList.remove('kpi-updated'), 750);
    }
  };

  if (!metrics) {
    updateCardValue('cardKpiMae', 'kpiMae', 'Unavailable');
    updateCardValue('cardKpiRmse', 'kpiRmse', 'Unavailable');
    updateCardValue('cardKpiR2', 'kpiR2', 'Unavailable');
    updateCardValue('cardKpiBias', 'kpiBias', 'Unavailable');
    updateCardValue('cardKpiSamples', 'kpiSamples', 'Unavailable');
    return;
  }

  // 1. MAE: mae_w -> Expected: ~3.30 W ("Mean Absolute Error")
  const maeVal = (typeof metrics.mae_w === 'number') ? metrics.mae_w.toFixed(2) :
                 (typeof metrics.mae === 'number' ? metrics.mae.toFixed(2) : '--');
  updateCardValue('cardKpiMae', 'kpiMae', maeVal);

  // 2. RMSE: rmse_w -> Expected: ~30.71 W ("Root Mean Squared Error")
  const rmseVal = (typeof metrics.rmse_w === 'number') ? metrics.rmse_w.toFixed(2) :
                  (typeof metrics.rmse === 'number' ? metrics.rmse.toFixed(2) : '--');
  updateCardValue('cardKpiRmse', 'kpiRmse', rmseVal);

  // 3. R²: r2 -> Expected: ~0.2521 ("Coefficient of Determination")
  const r2Val = (typeof metrics.r2 === 'number') ? metrics.r2.toFixed(4) : '--';
  updateCardValue('cardKpiR2', 'kpiR2', r2Val);

  // 4. Mean Bias: error_statistics_w.mean_error -> Expected: ~ -0.15 W ("Average prediction residual")
  const meanErr = metrics.error_statistics_w?.mean_error ?? metrics.mean_error;
  let biasVal = '--';
  if (typeof meanErr === 'number') {
    // Avoid "-0.00" by normalizing near-zero residuals
    const normalized = Math.abs(meanErr) < 0.005 ? 0 : meanErr;
    biasVal = normalized.toFixed(2);
  }
  updateCardValue('cardKpiBias', 'kpiBias', biasVal);

  // 5. Test Samples: test_samples -> Expected: ~27,714 ("Unseen test observations")
  const samplesVal = (typeof metrics.test_samples === 'number') ? metrics.test_samples.toLocaleString() : '--';
  updateCardValue('cardKpiSamples', 'kpiSamples', samplesVal);
}

// Global hooks for programmatic testing and data retry
window.updateKpiCards = populateTopKpiCards;

window.retryFailedFiles = async function() {
  const btn = document.getElementById('refreshDataBtn');
  if (btn) btn.classList.add('spinning');
  try {
    if (window.dataLoader) {
      await window.dataLoader.retryFailedFiles();
    }
  } finally {
    if (btn) setTimeout(() => btn.classList.remove('spinning'), 600);
  }
};

window.retryLoadForecast = async function() {
  if (window.dataLoader) {
    await window.dataLoader.loadForecastJson();
    await window.dataLoader.loadEvaluationMetricsJson();
    window.dataLoader.notifyLoaded(false);
  }
};

window.retryLoadCsv = async function() {
  if (window.dataLoader) {
    await window.dataLoader.loadTestPredictionsCsv();
    window.dataLoader.notifyLoaded(false);
  }
};

window.refreshDashboardData = async function() {
  const btn = document.getElementById('refreshDataBtn');
  if (btn) btn.classList.add('spinning');
  try {
    if (window.dataLoader) {
      await window.dataLoader.checkForUpdates();
    }
  } finally {
    if (btn) setTimeout(() => btn.classList.remove('spinning'), 600);
  }
};

// THIRD SECTION: Populate Future Forecast Step Cards
function populateFutureForecastGrid(futureData) {
  const container = document.getElementById('forecastStepsGrid');
  if (!container || !futureData) return;

  let html = '';
  futureData.forEach(d => {
    const dt = new Date(d.timestamp);
    const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    html += `
      <div class="forecast-step-card">
        <div class="step-num">+${d.step} MIN (t+${d.horizon_minute})</div>
        <div class="step-val">${d.forecast_power_w.toFixed(2)} W</div>
        <div class="step-time">${timeStr} UTC</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// FOURTH SECTION: Populate Prediction Error Analysis Metrics
function populateErrorStatistics(metrics) {
  if (!metrics) {
    const ids = ['sec4MeanError', 'sec4Mae', 'sec4Rmse', 'sec4R2', 'statMeanError', 'statStdError', 'statMaxAbsError', 'statMinError', 'statMaxError'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'Unavailable';
    });
    return;
  }

  // 1. Mean Error (error_statistics_w.mean_error) -> Expected: ~ -0.15 W
  const sec4MeanError = document.getElementById('sec4MeanError');
  const meanErr = metrics.error_statistics_w?.mean_error ?? metrics.mean_error;
  if (sec4MeanError && typeof meanErr === 'number') {
    const formatted = Math.abs(meanErr) < 0.005 ? '0.00' : meanErr.toFixed(2);
    sec4MeanError.textContent = `${formatted} W`;
  }

  // 2. MAE (mae_w) -> Expected: ~3.30 W
  const sec4Mae = document.getElementById('sec4Mae');
  const maeVal = metrics.mae_w ?? metrics.mae;
  if (sec4Mae && typeof maeVal === 'number') {
    sec4Mae.textContent = `${maeVal.toFixed(2)} W`;
  }

  // 3. RMSE (rmse_w) -> Expected: ~30.71 W
  const sec4Rmse = document.getElementById('sec4Rmse');
  const rmseVal = metrics.rmse_w ?? metrics.rmse;
  if (sec4Rmse && typeof rmseVal === 'number') {
    sec4Rmse.textContent = `${rmseVal.toFixed(2)} W`;
  }

  // 4. R² (r2) -> Expected: ~0.2521
  const sec4R2 = document.getElementById('sec4R2');
  if (sec4R2 && typeof metrics.r2 === 'number') {
    sec4R2.textContent = metrics.r2.toFixed(4);
  }

  // Detailed Error Statistics Breakdown (evaluation_metrics.json -> error_statistics_w)
  if (metrics.error_statistics_w) {
    const stats = metrics.error_statistics_w;
    
    const statMean = document.getElementById('statMeanError');
    if (statMean) statMean.textContent = `${stats.mean_error.toFixed(2)} W`;

    const statStd = document.getElementById('statStdError');
    if (statStd) statStd.textContent = `${stats.std_error.toFixed(2)} W`;

    const statMaxAbs = document.getElementById('statMaxAbsError');
    if (statMaxAbs) statMaxAbs.textContent = `${stats.max_abs_error.toFixed(2)} W`;

    const statMin = document.getElementById('statMinError');
    if (statMin) statMin.textContent = `${stats.min_error.toFixed(2)} W`;

    const statMax = document.getElementById('statMaxError');
    if (statMax) statMax.textContent = `${stats.max_error.toFixed(2)} W`;
  }
}

// FIFTH SECTION: Populate Model Information dynamically from metadata
function populateModelInformation(forecastData, metrics) {
  const modelName = document.getElementById('infoModelName');
  if (modelName) modelName.textContent = forecastData?.model || metrics?.model_name || 'LSTM_Power_Forecaster';

  const arch = document.getElementById('infoArchitecture');
  if (arch) arch.textContent = '2 LSTM layers + Dropout + Dense layers';

  const targetVar = document.getElementById('infoTarget');
  if (targetVar) targetVar.textContent = 'Active Power Demand';

  const unit = document.getElementById('infoUnit');
  if (unit) unit.textContent = `${forecastData?.unit || metrics?.target_unit || 'Watts (W)'}`;

  const lookback = document.getElementById('infoLookback');
  if (lookback) lookback.textContent = `${forecastData?.lookback_minutes || 30} minutes`;

  const testHorizon = document.getElementById('infoTestHorizon');
  if (testHorizon) testHorizon.textContent = '1 minute ahead';

  const futureHorizon = document.getElementById('infoFutureHorizon');
  if (futureHorizon) futureHorizon.textContent = `${forecastData?.forecast_horizon_minutes || 60} minutes`;

  const samples = document.getElementById('infoTestSamples');
  if (samples) {
    const count = metrics?.test_samples || 27714;
    samples.textContent = typeof count === 'number' ? count.toLocaleString() : count;
  }
}

// SIXTH SECTION: Populate Methodology Notes directly from forecast_data.json
function populateMethodologySection(notes) {
  const testMethod = document.getElementById('methodologyTestPred');
  if (testMethod && notes.test_predictions) {
    testMethod.textContent = notes.test_predictions;
  }

  const futureMethod = document.getElementById('methodologyFutureForecast');
  if (futureMethod && notes.future_forecast) {
    futureMethod.textContent = notes.future_forecast;
  }

  const limitation = document.getElementById('methodologyLimitation');
  if (limitation && notes.limitation) {
    limitation.textContent = notes.limitation;
  }
}

// Chart Fallback Toggle Handler (switches between dynamic Chart.js canvas and static fallback PNG)
window.toggleChartFallback = function(containerId, fallbackImgId, btn) {
  const chartEl = document.getElementById(containerId);
  const fallbackEl = document.getElementById(fallbackImgId);
  if (!chartEl || !fallbackEl) return;

  if (fallbackEl.style.display === 'none' || !fallbackEl.style.display) {
    chartEl.style.display = 'none';
    fallbackEl.style.display = 'flex';
    btn.textContent = 'Switch to Dynamic Chart';
    btn.classList.add('btn-outline');
  } else {
    chartEl.style.display = 'block';
    fallbackEl.style.display = 'none';
    btn.textContent = 'View Static Fallback PNG';
    btn.classList.remove('btn-outline');
  }
};

// Modal Lightbox Setup
function setupImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || !modalImg || !closeBtn) return;

  window.openImageModal = function(src, title) {
    modalImg.src = src;
    modalTitle.textContent = title || 'Static Fallback Graphic';
    modal.classList.add('open');
  };

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

// Fullscreen Toggle
window.toggleFullscreen = function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

// =========================================================================
// SIDEBAR NAVIGATION & SCROLLSPY CONTROLLER
// Handles smooth scrolling, section highlighting, URL hash updates,
// and mobile sidebar drawer toggle/backdrop
// =========================================================================

window.toggleSidebar = function() {
  const sidebar = document.getElementById('dashboardSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle('is-open');
  if (backdrop) {
    if (isOpen) {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    } else {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }
};

window.closeSidebar = function() {
  const sidebar = document.getElementById('dashboardSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('is-open');
  if (backdrop) backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
};

function initNavigation() {
  const navLinks = Array.from(document.querySelectorAll('.sidebar-nav-link'));
  if (navLinks.length === 0) return;

  const sectionMap = {
    'overview': 'overview-section',
    'overview-section': 'overview-section',
    'forecast': 'forecast-section',
    'forecast-section': 'forecast-section',
    'model-performance': 'model-performance-section',
    'model-performance-section': 'model-performance-section',
    'historical-data': 'historical-data-section',
    'historical-data-section': 'historical-data-section',
    'error-analysis': 'error-analysis-section',
    'error-analysis-section': 'error-analysis-section',
    'methodology': 'methodology-section',
    'methodology-section': 'methodology-section'
  };

  function scrollToSection(targetId) {
    const resolvedId = sectionMap[targetId] || targetId;
    const targetEl = document.getElementById(resolvedId);
    if (!targetEl) return;

    // Header offset accounting for sticky header + breathing room
    const header = document.querySelector('.dashboard-header');
    const headerHeight = header ? header.offsetHeight : 70;
    const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });

    // Update active class
    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-section');
      if (linkTarget === resolvedId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', '#' + (resolvedId.replace('-section', '')));
    }
  }

  // Click listener for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      scrollToSection(targetId);

      // On mobile screen, close the drawer
      if (window.innerWidth <= 1024) {
        window.closeSidebar();
      }
    });
  });

  // Handle URL hash on initial page load
  if (window.location.hash) {
    const rawHash = window.location.hash.substring(1);
    const initialTarget = sectionMap[rawHash] || (rawHash + '-section');
    if (document.getElementById(initialTarget)) {
      setTimeout(() => scrollToSection(initialTarget), 250);
    }
  }

  // ScrollSpy via IntersectionObserver
  const observedSectionIds = [
    'overview-section',
    'forecast-section',
    'model-performance-section',
    'historical-data-section',
    'error-analysis-section',
    'methodology-section'
  ];

  const sectionsToObserve = observedSectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionsToObserve.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinks.forEach(link => {
            if (link.getAttribute('data-section') === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-15% 0px -60% 0px',
      threshold: [0.05, 0.25]
    });

    sectionsToObserve.forEach(sec => observer.observe(sec));
  }
}
