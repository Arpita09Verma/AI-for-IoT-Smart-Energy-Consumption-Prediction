import React from 'react';

/**
 * Sidebar Navigation Component
 * Features:
 * - Brand title: "ENERGY AI"
 * - 6 Main navigation links with dedicated URL route mapping:
 *   1. Overview (/dashboard or /)
 *   2. Forecast (/forecast)
 *   3. Model Performance (/analytics or /model-performance)
 *   4. Historical Data (/historical)
 *   5. Error Analysis (/error-analysis)
 *   6. Methodology (/methodology)
 * - Operational model status indicator:
 *   "Model: LSTM_Power_Forecaster"
 *   "Status: Ready" (or "Status: Data Missing")
 * - Lookback & Horizon telemetry specs
 * - Mobile responsive drawer with backdrop
 */
export const Sidebar = ({
  activeSection = 'overview-section',
  onNavigate,
  isOpen = false,
  onClose,
  modelStatus = { ready: true, error: false, message: 'Status: Ready' }
}) => {
  const navItems = [
    {
      id: 'overview-section',
      path: '/dashboard',
      num: '01',
      title: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      )
    },
    {
      id: 'forecast-section',
      path: '/forecast',
      num: '02',
      title: 'Forecast',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      )
    },
    {
      id: 'model-performance-section',
      path: '/analytics',
      num: '03',
      title: 'Model Performance',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="14" x2="23" y2="14"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="14" x2="4" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'historical-data-section',
      path: '/historical',
      num: '04',
      title: 'Historical Data',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      )
    },
    {
      id: 'error-analysis-section',
      path: '/error-analysis',
      num: '05',
      title: 'Error Analysis',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <circle cx="12" cy="7" r="1.5"></circle>
        </svg>
      )
    },
    {
      id: 'methodology-section',
      path: '/methodology',
      num: '06',
      title: 'Methodology',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    }
  ];

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(item.id, item.path);
    }
    if (window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'is-open' : ''}`}
        id="sidebarBackdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`} id="dashboardSidebar" aria-label="Main Navigation">
        <div className="sidebar-content">
          {/* Sidebar Brand Header */}
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-brand-icon" aria-hidden="true">
                <div className="brand-pulse"></div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div className="sidebar-brand-text">
                <h2 className="sidebar-title">ENERGY AI</h2>
                <span className="sidebar-subtitle">IoT Forecasting Hub</span>
              </div>
            </div>

            {/* Close button for mobile drawer */}
            <button
              className="btn-icon sidebar-close-btn"
              id="sidebarCloseBtn"
              aria-label="Close Navigation"
              onClick={onClose}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Navigation List */}
          <nav className="sidebar-nav" aria-label="Dashboard Sections">
            <div className="sidebar-nav-label">DASHBOARD NAVIGATION</div>
            <ul className="sidebar-nav-list" role="list">
              {navItems.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <li className="sidebar-nav-item" key={item.id}>
                    <a
                      href={item.path}
                      className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                      data-section={item.id}
                      data-path={item.path}
                      onClick={(e) => handleLinkClick(e, item)}
                    >
                      <span className="nav-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="nav-text">{item.title}</span>
                      <span className="nav-num">{item.num}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer: Model Status & Telemetry Specs */}
        <div className="sidebar-footer-wrap">
          <div className="sidebar-model-status" role="status" aria-label="Model Operational Status">
            <div className="status-indicator-header">
              <div
                className={`status-indicator-beacon ${modelStatus.error ? 'status-beacon-error' : ''}`}
                id="sidebarStatusBeacon"
                aria-hidden="true"
              >
                <span className="beacon-glow"></span>
                <span className="beacon-core"></span>
              </div>
              <span
                className={modelStatus.error ? 'status-title-error' : 'status-title-ready'}
                id="sidebarStatusTitle"
              >
                {modelStatus.message || (modelStatus.error ? 'Status: Data Missing' : 'Status: Ready')}
              </span>
            </div>

            <div className="status-model-row">
              <span className="status-model-tag">Model:</span>
              <span className="status-model-name text-mono">LSTM_Power_Forecaster</span>
            </div>

            <div className="status-mode-clarification">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Trained LSTM Model &bull; Active Inference</span>
            </div>
          </div>

          <div className="sidebar-meta-specs">
            <div className="sidebar-spec-row">
              <span className="spec-k">Lookback:</span>
              <span className="spec-v text-mono">30 mins</span>
            </div>
            <div className="sidebar-spec-row">
              <span className="spec-k">Horizon:</span>
              <span className="spec-v text-mono">1m / 60m</span>
            </div>
            <div className="sidebar-spec-row">
              <span className="spec-k">Dataset:</span>
              <span className="spec-v text-mono">27,714 rows</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
