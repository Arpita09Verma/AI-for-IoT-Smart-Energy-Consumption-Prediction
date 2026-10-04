import React from 'react';

/**
 * Global Data Ingestion Alert Banner
 * Identifies which file failed without crashing the dashboard or using fake values
 */
export const AlertBanner = ({ failedFiles = [], onRetry }) => {
  if (!failedFiles || failedFiles.length === 0) return null;

  return (
    <div className="dashboard-alerts-container" aria-live="polite">
      <div className="alert-banner" role="alert">
        <div className="alert-banner-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="alert-banner-content">
          <div className="alert-banner-title">
            <span>Data Ingestion Notice: {failedFiles.length} file{failedFiles.length > 1 ? 's' : ''} failed to load</span>
          </div>
          <ul className="alert-banner-items">
            {failedFiles.map(f => (
              <li className="alert-banner-item" key={f.file}>
                <span className="alert-file-tag">{f.file}</span>
                <span>{f.error}</span>
              </li>
            ))}
          </ul>
          <div className="alert-banner-actions">
            {onRetry && (
              <button className="btn btn-secondary btn-sm" onClick={onRetry}>
                Retry Loading Failed Files
              </button>
            )}
            <span className="alert-help-note">
              Active sections remain operational. Unaffected data continues to render.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
