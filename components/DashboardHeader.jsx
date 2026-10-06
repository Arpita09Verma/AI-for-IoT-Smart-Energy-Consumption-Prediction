import React from 'react';

/**
 * Dashboard Header Component
 * Contains:
 * - Brand icon with pulse glow
 * - Main title & subtitle
 * - Live IoT telemetry indicator badge
 * - Header action buttons (Fullscreen, Refresh)
 * - Mobile sidebar toggle button
 */
export const DashboardHeader = ({
  telemetryStatus = 'Historical Mode — Trained on PZEM-004T Data',
  sampleCount = null,
  isRefreshing = false,
  onRefresh,
  onToggleSidebar
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const statusText = sampleCount
    ? `${telemetryStatus} • ${typeof sampleCount === 'number' ? sampleCount.toLocaleString() : sampleCount} Authentic Inferences`
    : telemetryStatus;

  return (
    <header className="dashboard-header" role="banner">
      <div className="header-inner">
        <div className="brand-section">
          {/* Mobile sidebar toggle button */}
          <button
            className="btn-icon sidebar-toggle-btn"
            id="sidebarToggleBtn"
            aria-label="Open Navigation Menu"
            title="Toggle Navigation Sidebar"
            onClick={onToggleSidebar}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="brand-icon-wrapper" aria-hidden="true">
            <div className="brand-pulse"></div>
            {/* Energy Bolt SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>

          <div className="brand-text">
            <h1>AI + IoT Smart Energy Consumption Prediction</h1>
            <p className="dashboard-subtitle">
              Electricity demand forecasting and model performance
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Telemetry Status Indicator Pill - Historical Mode (sensor not live) */}
          <div className="status-badge status-badge-historical" id="telemetryStatusBadge" title="Data collected offline from PZEM-004T + ESP32 sensor. This is a trained ML model running on historical data, not a live sensor feed.">
            <span className="status-dot status-dot-historical"></span>
            <span className="status-text text-mono" id="telemetryStatusText">
              {statusText}
            </span>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            className="btn-icon"
            id="fullscreenBtn"
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen Mode"
            onClick={toggleFullscreen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>

          {/* Refresh Data Button */}
          <button
            className={`btn-icon ${isRefreshing ? 'spinning' : ''}`}
            id="refreshDataBtn"
            aria-label="Refresh Dashboard Data"
            title="Reload authentic forecast and telemetry datasets"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
