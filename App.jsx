import React, { useEffect, useState, useCallback } from 'react';
import { dataService } from './services/dataService.js';
import {
  DashboardHeader,
  Sidebar,
  KPICard,
  ActualVsPredictedChart,
  FutureForecastChart,
  ErrorAnalysis,
  HistoricalTable,
  ModelInfo,
  IoTPipeline,
  MethodologySection,
  AlertBanner
} from './components/index.js';

const ROUTE_MAP = {
  '/': 'overview-section',
  '/dashboard': 'overview-section',
  '/forecast': 'forecast-section',
  '/analytics': 'model-performance-section',
  '/model-performance': 'model-performance-section',
  '/performance': 'model-performance-section',
  '/historical': 'historical-data-section',
  '/error-analysis': 'error-analysis-section',
  '/methodology': 'methodology-section'
};

const SECTION_TO_ROUTE = {
  'overview-section': '/dashboard',
  'forecast-section': '/forecast',
  'model-performance-section': '/analytics',
  'historical-data-section': '/historical',
  'error-analysis-section': '/error-analysis',
  'methodology-section': '/methodology'
};

export const App = () => {
  const [dataState, setDataState] = useState(dataService.getState());
  const [activeSection, setActiveSection] = useState('overview-section');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalData, setModalData] = useState({ open: false, src: '', title: '' });

  // Route synchronization helper
  const scrollToSection = useCallback((targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const header = document.querySelector('.dashboard-header');
    const headerHeight = header ? header.offsetHeight : 70;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  // Handle URL navigation
  const handleNavigate = (targetId, targetPath) => {
    const path = targetPath || SECTION_TO_ROUTE[targetId] || '/dashboard';
    if (window.location.pathname !== path) {
      window.history.pushState({ section: targetId }, '', path);
    }
    scrollToSection(targetId);
    setActiveSection(targetId);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const targetSection = ROUTE_MAP[path] || 'overview-section';
      setActiveSection(targetSection);
      scrollToSection(targetSection);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToSection]);

  // Initial direct route resolution
  useEffect(() => {
    const path = window.location.pathname;
    const targetSection = ROUTE_MAP[path];
    if (targetSection && targetSection !== 'overview-section') {
      setActiveSection(targetSection);
      // Wait for components to mount before scrolling
      const timer = setTimeout(() => {
        scrollToSection(targetSection);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  // Subscribe to dataService updates
  useEffect(() => {
    const unsubscribe = dataService.subscribe((state) => {
      setDataState({ ...state });
    });

    dataService.loadAll();
    dataService.startPolling(8000);

    return () => {
      unsubscribe();
      dataService.stopPolling();
    };
  }, []);

  // ScrollSpy via IntersectionObserver
  useEffect(() => {
    const sections = [
      'overview-section',
      'forecast-section',
      'model-performance-section',
      'historical-data-section',
      'error-analysis-section',
      'methodology-section'
    ].map(id => document.getElementById(id)).filter(Boolean);

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            setActiveSection(currentId);
            // Optionally update path quietly
            const matchingRoute = SECTION_TO_ROUTE[currentId];
            if (matchingRoute && window.location.pathname !== matchingRoute && window.location.pathname !== '/') {
              window.history.replaceState({ section: currentId }, '', matchingRoute);
            }
          }
        });
      }, {
        rootMargin: '-15% 0px -60% 0px',
        threshold: [0.05, 0.25]
      });

      sections.forEach(s => observer.observe(s));
      return () => sections.forEach(s => observer.unobserve(s));
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dataService.checkForUpdates();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleOpenModal = (src, title) => {
    setModalData({ open: true, src, title });
  };

  const handleCloseModal = () => {
    setModalData({ open: false, src: '', title: '' });
  };

  const { forecastData, evaluationMetrics, testPredictions, isLiveApi, loading, errors, failedFiles } = dataState;

  // Format Top KPI card values
  const maeVal = (typeof evaluationMetrics?.mae_w === 'number')
    ? evaluationMetrics.mae_w.toFixed(2)
    : (typeof evaluationMetrics?.mae === 'number' ? evaluationMetrics.mae.toFixed(2) : 'Unavailable');

  const rmseVal = (typeof evaluationMetrics?.rmse_w === 'number')
    ? evaluationMetrics.rmse_w.toFixed(2)
    : (typeof evaluationMetrics?.rmse === 'number' ? evaluationMetrics.rmse.toFixed(2) : 'Unavailable');

  const r2Val = (typeof evaluationMetrics?.r2 === 'number')
    ? evaluationMetrics.r2.toFixed(4)
    : 'Unavailable';

  const meanErr = evaluationMetrics?.error_statistics_w?.mean_error ?? evaluationMetrics?.mean_error;
  const biasVal = (typeof meanErr === 'number')
    ? (Math.abs(meanErr) < 0.005 ? '0.00' : meanErr.toFixed(2))
    : 'Unavailable';

  const samplesVal = (typeof evaluationMetrics?.test_samples === 'number')
    ? evaluationMetrics.test_samples.toLocaleString()
    : 'Unavailable';

  // Model status
  const modelStatus = errors.forecast
    ? { ready: false, error: true, message: 'Status: Data Missing' }
    : loading.liveInference
      ? { ready: true, error: false, message: 'Status: Generating Forecast...' }
      : isLiveApi
        ? { ready: true, error: false, message: 'Status: Live LSTM Online' }
        : { ready: true, error: false, message: 'Status: Ready' };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        modelStatus={modelStatus}
      />

      {/* Main Dashboard Area */}
      <div className="dashboard-main-area">
        <DashboardHeader
          telemetryStatus={errors.forecast ? 'Historical Mode — ML Results Unavailable' : 'Historical Mode — Trained on PZEM-004T Data'}
          sampleCount={evaluationMetrics?.test_samples}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        <main id="main-content">
          {/* Data Failure Alert Banner */}
          <AlertBanner
            failedFiles={failedFiles}
            onRetry={() => dataService.retryFailed()}
          />

          {/* Dashboard Context Banner - explains the dashboard to non-engineers */}
          <div className="context-banner" role="region" aria-label="Dashboard Overview">
            <div className="context-banner-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="context-banner-text">
              <strong>What is this dashboard?</strong>{' '}
              This system uses an <strong>AI model (LSTM neural network)</strong> to predict electricity consumption in Watts.
              {' '}It was trained on real sensor readings from a <strong>PZEM-004T smart energy meter</strong> connected to an ESP32 microcontroller.
              {' '}The sensor is <strong>not connected live</strong> — all results below are from the trained model running on saved historical data.
            </div>
          </div>

          {/* Section 1: Overview & 5 Top KPI Cards */}
          <section className="dashboard-section" id="overview-section" aria-label="Overview & Model Evaluation KPI Cards">
            <div className="section-header" style={{marginBottom: '1rem'}}>
              <div className="section-title-wrap">
                <span className="section-num-badge">1</span>
                <div>
                  <h2 className="section-title">Model Accuracy Summary</h2>
                  <p className="section-subtitle">How well does the AI predict power consumption? Lower error = better accuracy.</p>
                </div>
              </div>
            </div>
            <div className="kpi-row-5">
              <KPICard
                id="cardKpiMae"
                label="Average Error (MAE)"
                value={maeVal}
                unit={maeVal !== 'Unavailable' ? 'W' : ''}
                description="On average, predictions are off by this many Watts. Lower is better."
                tooltip="Mean Absolute Error — the average size of prediction mistakes in Watts"
                type="mae"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiRmse"
                label="Worst-Case Error (RMSE)"
                value={rmseVal}
                unit={rmseVal !== 'Unavailable' ? 'W' : ''}
                description="Penalizes large mistakes more. Closer to MAE = consistent predictions."
                tooltip="Root Mean Squared Error — highlights larger prediction errors. Lower is better."
                type="rmse"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10M12 20V4M6 20v-6"></path>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiR2"
                label="Accuracy Score (R²)"
                value={r2Val}
                unit=""
                description="Score from 0 to 1. Closer to 1.0000 = the model explains the data nearly perfectly."
                tooltip="R² (Coefficient of Determination) — 1.0 = perfect fit. Above 0.95 is excellent."
                type="r2"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="M12 8v8"></path>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiBias"
                label="Prediction Bias"
                value={biasVal}
                unit={biasVal !== 'Unavailable' ? 'W' : ''}
                description="Is the model consistently over or under? Near 0W = no systematic bias."
                tooltip="Mean Bias (Mean Error) — positive means model under-predicts; negative means over-predicts"
                type="bias"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiSamples"
                label="Test Readings"
                value={samplesVal}
                unit=""
                description="Real sensor readings the model was tested on (it never saw these during training)."
                tooltip="Number of unseen test observations used to evaluate model accuracy"
                type="samples"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                }
              />
            </div>
          </section>

          {/* Section 2: Actual vs Predicted Power Demand */}
          <ActualVsPredictedChart
            data={forecastData?.recent_test_predictions}
            loading={loading.forecast}
            error={errors.forecast}
            onRetry={() => dataService.loadForecastData()}
            onOpenModal={handleOpenModal}
          />

          {/* Section 3: 60-Minute Future Forecast */}
          <FutureForecastChart
            data={forecastData?.future_forecast_60min}
            loading={loading.forecast}
            error={errors.forecast}
            isLiveApi={isLiveApi}
            onRetry={() => dataService.loadForecastData()}
            onGenerateLiveForecast={(steps) => dataService.generateLiveForecast(steps)}
          />

          {/* Section 4: Dedicated Prediction Error Analysis */}
          <ErrorAnalysis
            metrics={evaluationMetrics}
            testPredictions={testPredictions}
            dataService={dataService}
            loading={loading.csv}
            error={errors.csv}
            onRetry={() => dataService.loadTestPredictionsCsv()}
            onOpenModal={handleOpenModal}
          />

          {/* Section 5: Historical Predictions 27,714-row Table */}
          <HistoricalTable
            data={testPredictions}
            loading={loading.csv}
            error={errors.csv}
            onRetry={() => dataService.loadTestPredictionsCsv()}
          />

          {/* Section 6: Model Information */}
          <ModelInfo
            forecastData={forecastData}
            metrics={evaluationMetrics}
          />

          {/* Section 7: AI + IoT Data Pipeline */}
          <IoTPipeline />

          {/* Section 8: Methodology */}
          <MethodologySection
            notes={forecastData?.methodology_notes}
          />
        </main>

        {/* Dashboard Footer */}
        <footer className="dashboard-footer" role="contentinfo">
          <div className="footer-content">
            <span className="footer-title">AI for IoT Smart Energy Consumption Prediction</span>
            <span className="footer-separator">&bull;</span>
            <span className="footer-note">PZEM-004T + ESP32 Smart Meter • Historical Data • Deep LSTM Model • Predictions in Watts (W)</span>
          </div>
          <div className="footer-links">
            <span>Model: <code>LSTM_Power_Forecaster</code></span>
            <span>Unit: <code>Watts (W)</code></span>
            <span>Lookback: <code>30 min</code></span>
            <span>Samples: <code>27,714</code></span>
          </div>
        </footer>
      </div>

      {/* Image Modal Lightbox */}
      {modalData.open && (
        <div
          className="modal-backdrop open"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="card-title">{modalData.title || 'Static Fallback Graphic'}</h3>
              <button
                className="btn-icon"
                onClick={handleCloseModal}
                aria-label="Close Modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <img src={modalData.src} alt={modalData.title || 'Graphic'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
