import React, { useEffect, useState } from 'react';
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

export const App = () => {
  const [dataState, setDataState] = useState(dataService.getState());
  const [activeSection, setActiveSection] = useState('overview-section');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalData, setModalData] = useState({ open: false, src: '', title: '' });

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
            setActiveSection(entry.target.id);
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

  const handleNavigate = (targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const header = document.querySelector('.dashboard-header');
    const headerHeight = header ? header.offsetHeight : 70;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    setActiveSection(targetId);
  };

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

  const { forecastData, evaluationMetrics, testPredictions, loading, errors, failedFiles } = dataState;

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
          telemetryStatus={errors.forecast ? 'Telemetry Partial' : 'PZEM-004T Online'}
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

          {/* Section 1: Overview & 5 Top KPI Cards */}
          <section className="dashboard-section" id="overview-section" aria-label="Overview & Model Evaluation KPI Cards">
            <div className="kpi-row-5">
              <KPICard
                id="cardKpiMae"
                label="MAE"
                value={maeVal}
                unit={maeVal !== 'Unavailable' ? 'W' : ''}
                description="Mean Absolute Error"
                type="actual"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiRmse"
                label="RMSE"
                value={rmseVal}
                unit={rmseVal !== 'Unavailable' ? 'W' : ''}
                description="Root Mean Squared Error"
                type="predicted"
                loading={loading.forecast && !forecastData}
                icon={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10M12 20V4M6 20v-6"></path>
                  </svg>
                }
              />

              <KPICard
                id="cardKpiR2"
                label="R²"
                value={r2Val}
                unit=""
                description="Coefficient of Determination"
                type="forecast"
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
                label="Mean Bias"
                value={biasVal}
                unit={biasVal !== 'Unavailable' ? 'W' : ''}
                description="Average prediction residual"
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
                label="Test Samples"
                value={samplesVal}
                unit=""
                description="Unseen test observations"
                type="neutral"
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
            onRetry={() => dataService.loadForecastData()}
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
            <span className="footer-note">PZEM-004T + ESP32 Smart Meter Telemetry • Deep Recurrent LSTM Inferences in Watts (W)</span>
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
