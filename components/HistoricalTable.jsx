import React, { useMemo, useState } from 'react';

/**
 * Historical Predictions Table Component
 * High-performance client-side pagination, search, and sorting for 27,714 observations
 * Features:
 * - Never mounts all 27,714 rows into DOM simultaneously
 * - Search by timestamp
 * - Multi-column sorting
 * - Magnitude filtering
 * - Shimmer skeleton loading
 * - Direct download of original test_predictions.csv
 * - Empty state with retry button
 */
export const HistoricalTable = ({
  data = [],
  loading = false,
  error = null,
  onRetry
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortAscending, setSortAscending] = useState(true);

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let result = data;

    // Filter by error magnitude
    if (filterCategory === 'accurate') {
      result = result.filter(d => Math.abs(d.error_w) <= 5.0);
    } else if (filterCategory === 'moderate') {
      result = result.filter(d => Math.abs(d.error_w) > 5.0 && Math.abs(d.error_w) <= 20.0);
    } else if (filterCategory === 'outlier') {
      result = result.filter(d => Math.abs(d.error_w) > 20.0);
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(d =>
        d.timestamp.toLowerCase().includes(q) ||
        d.actual_power_w.toFixed(2).includes(q) ||
        d.predicted_power_w.toFixed(2).includes(q) ||
        d.error_w.toFixed(2).includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === 'timestamp') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sortAscending ? -1 : 1;
      if (valA > valB) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [data, filterCategory, searchQuery, sortColumn, sortAscending]);

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  // Paginated window
  const paginatedRows = useMemo(() => {
    const startIndex = (Math.min(currentPage, totalPages) - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, totalPages, pageSize]);

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(col);
      setSortAscending(true);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    let target = Number(page);
    if (isNaN(target) || target < 1) target = 1;
    if (target > totalPages) target = totalPages;
    setCurrentPage(target);
  };

  const exportFilteredCsv = () => {
    if (!filteredData || filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }
    let csv = 'timestamp,actual_power_w,predicted_power_w,error_w\n';
    filteredData.forEach(row => {
      csv += `${row.timestamp},${row.actual_power_w},${row.predicted_power_w},${row.error_w}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historical_predictions_filtered_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIndicator = (col) => {
    if (sortColumn !== col) {
      return <span className="sort-indicator">&#x21C5;</span>;
    }
    return (
      <span className="sort-indicator active">
        {sortAscending ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <section className="dashboard-section" id="historical-data-section" aria-label="Historical Predictions Data Table">
      <article className="glass-card">
        {/* Table Header */}
        <div className="card-header">
          <div className="card-title-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <div>
              <h3 className="card-title">Historical Predictions</h3>
              <p className="card-subtitle">
                Full 27,714 chronological observations from <code>AI_IoT_Project/results/test_predictions.csv</code>
              </p>
            </div>
          </div>

          <div className="card-actions">
            {/* Direct download for original test_predictions.csv */}
            <a
              href="AI_IoT_Project/results/test_predictions.csv"
              download="test_predictions.csv"
              className="btn btn-primary btn-sm"
              id="downloadCsvBtn"
              title="Download original 27,714-row CSV dataset"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download CSV
            </a>

            <button
              className="btn btn-secondary btn-sm"
              onClick={exportFilteredCsv}
              title="Export current search or filter view"
            >
              Export Filtered View
            </button>
          </div>
        </div>

        {/* Residual Error Interpretation Legend Banner */}
        <div className="table-legend-card" role="region" aria-label="Error Interpretation Legend">
          <div className="legend-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Residual Error Interpretation &bull; Error = Actual &minus; Predicted</span>
          </div>
          <div className="legend-body">
            <div className="legend-item">
              <span className="legend-chip chip-positive">Positive (+) Error</span>
              <span className="legend-meaning">
                <strong>Under-prediction:</strong> The LSTM model predicted <em>lower</em> power than actual measured demand (Actual &gt; Predicted).
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-chip chip-negative">Negative (&minus;) Error</span>
              <span className="legend-meaning">
                <strong>Over-prediction:</strong> The LSTM model predicted <em>higher</em> power than actual measured demand (Actual &lt; Predicted).
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Search, Filter, Page Size */}
        <div className="table-controls">
          <div className="table-search-box">
            <svg className="table-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="table-search-input"
              placeholder="Search by timestamp (e.g. 2026-04-15, 13:28)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="btn-group">
            <button
              className={`btn-group-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => { setFilterCategory('all'); setCurrentPage(1); }}
            >
              All (27,714)
            </button>
            <button
              className={`btn-group-btn ${filterCategory === 'accurate' ? 'active' : ''}`}
              onClick={() => { setFilterCategory('accurate'); setCurrentPage(1); }}
            >
              Accurate (&le; 5W)
            </button>
            <button
              className={`btn-group-btn ${filterCategory === 'moderate' ? 'active' : ''}`}
              onClick={() => { setFilterCategory('moderate'); setCurrentPage(1); }}
            >
              Moderate (5-20W)
            </button>
            <button
              className={`btn-group-btn ${filterCategory === 'outlier' ? 'active' : ''}`}
              onClick={() => { setFilterCategory('outlier'); setCurrentPage(1); }}
            >
              Spikes (&gt; 20W)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Page Size:</span>
            <select
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                color: '#ffffff',
                padding: '0.35rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem'
              }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
              <option value={250}>250 rows</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="table-wrapper">
          <table className="data-table" id="testPredictionsTable">
            <thead>
              <tr>
                <th style={{ width: 55 }}>#</th>
                <th
                  className={`sortable ${sortColumn === 'timestamp' ? 'sorted' : ''}`}
                  onClick={() => handleSort('timestamp')}
                  title="Click to sort by Timestamp"
                >
                  Timestamp {renderSortIndicator('timestamp')}
                </th>
                <th
                  className={`sortable ${sortColumn === 'actual_power_w' ? 'sorted' : ''}`}
                  onClick={() => handleSort('actual_power_w')}
                  title="Click to sort by Actual Power"
                >
                  Actual Power (W) {renderSortIndicator('actual_power_w')}
                </th>
                <th
                  className={`sortable ${sortColumn === 'predicted_power_w' ? 'sorted' : ''}`}
                  onClick={() => handleSort('predicted_power_w')}
                  title="Click to sort by Predicted Power"
                >
                  Predicted Power (W) {renderSortIndicator('predicted_power_w')}
                </th>
                <th
                  className={`sortable ${sortColumn === 'error_w' ? 'sorted' : ''}`}
                  onClick={() => handleSort('error_w')}
                  title="Click to sort by Error"
                >
                  Error (W) {renderSortIndicator('error_w')}
                </th>
                <th style={{ width: 130 }}>Residual Type</th>
              </tr>
            </thead>
            <tbody>
              {/* Shimmer loading skeleton */}
              {loading && (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr className="table-skeleton-row" key={`skel-${i}`} aria-hidden="true">
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 24, height: 14 }}></div></td>
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 140, height: 14 }}></div></td>
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 65, height: 14 }}></div></td>
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 65, height: 14 }}></div></td>
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 55, height: 14 }}></div></td>
                    <td><div className="skeleton-shimmer skeleton-cell" style={{ width: 85, height: 18, borderRadius: 9999 }}></div></td>
                  </tr>
                ))
              )}

              {/* Error empty state */}
              {(!loading && error) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div className="table-empty-state">
                      <div className="empty-icon-wrap" style={{ color: 'var(--color-error)', margin: '0 auto 0.75rem auto' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <h4 className="empty-state-title" style={{ marginBottom: '0.35rem' }}>Historical Predictions Dataset Unavailable</h4>
                      <p className="empty-state-desc" style={{ marginBottom: '1.25rem' }}>
                        {error}
                      </p>
                      {onRetry && (
                        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
                          Retry Loading CSV
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Normal rows */}
              {(!loading && !error && paginatedRows.length > 0) && (
                paginatedRows.map((row, i) => {
                  const startIndex = (Math.min(currentPage, totalPages) - 1) * pageSize;
                  const rowNum = startIndex + i + 1;
                  const errorVal = row.error_w;
                  const absErr = Math.abs(errorVal);
                  const sign = errorVal > 0 ? '+' : '';
                  const formattedError = `${sign}${errorVal.toFixed(2)} W`;

                  let residualBadge = null;
                  if (absErr < 0.005) {
                    residualBadge = <span className="legend-chip" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Exact Match</span>;
                  } else if (errorVal > 0) {
                    residualBadge = <span className="legend-chip chip-positive" title="Under-prediction: Model predicted less power than actual demand" style={{ fontSize: '0.7rem' }}>Under-pred (+)</span>;
                  } else {
                    residualBadge = <span className="legend-chip chip-negative" title="Over-prediction: Model predicted more power than actual demand" style={{ fontSize: '0.7rem' }}>Over-pred (&minus;)</span>;
                  }

                  let errorStyle = { color: 'var(--text-primary)' };
                  if (absErr > 20) {
                    errorStyle = { color: 'var(--color-error-light)', fontWeight: 700 };
                  } else if (absErr > 5) {
                    errorStyle = { color: '#fbbf24', fontWeight: 600 };
                  }

                  return (
                    <tr key={`${row.timestamp}-${rowNum}`}>
                      <td className="text-mono" style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>{rowNum}</td>
                      <td className="text-mono" style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 500 }}>{row.timestamp}</td>
                      <td className="text-mono" style={{ color: 'var(--color-actual-light)', fontWeight: 600 }}>{row.actual_power_w.toFixed(2)} W</td>
                      <td className="text-mono" style={{ color: 'var(--color-predicted-light)', fontWeight: 600 }}>{row.predicted_power_w.toFixed(2)} W</td>
                      <td className="text-mono" style={errorStyle}>{formattedError}</td>
                      <td>{residualBadge}</td>
                    </tr>
                  );
                })
              )}

              {/* No match */}
              {(!loading && !error && paginatedRows.length === 0 && data.length > 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>No historical predictions match your search or filter</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Try adjusting your timestamp search or selecting "All (27,714)"</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="table-pagination">
          <span id="tableCountInfo">
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-actual-light)' }}>
                <span className="loading-mini-spinner" aria-hidden="true"></span>
                Streaming 27,714 observations from test_predictions.csv...
              </span>
            ) : error ? (
              'Historical dataset unavailable (test_predictions.csv not loaded)'
            ) : totalRecords === 0 ? (
              'No matching observations found'
            ) : (
              <span>
                Showing <strong>{((currentPage - 1) * pageSize + 1).toLocaleString()}</strong> to <strong>{Math.min(currentPage * pageSize, totalRecords).toLocaleString()}</strong> of <strong>{totalRecords.toLocaleString()}</strong> observations (Page {currentPage} of {totalPages})
              </span>
            )}
          </span>

          {(!loading && !error && totalPages > 1) && (
            <div className="pagination-buttons" id="paginationControls">
              <button
                className="page-btn"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First Page"
              >
                &laquo;
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                &lsaquo;
              </button>

              {/* Current window */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                const startP = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const p = startP + idx;
                if (p > totalPages || p < 1) return null;
                return (
                  <button
                    key={`page-${p}`}
                    className={`page-btn ${p === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                &rsaquo;
              </button>
              <button
                className="page-btn"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
              >
                &raquo;
              </button>

              {/* Jump to page */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Go:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue={currentPage}
                  style={{
                    width: 55,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: '#ffffff',
                    padding: '0.25rem 0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.76rem',
                    textAlign: 'center'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePageChange(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default HistoricalTable;
