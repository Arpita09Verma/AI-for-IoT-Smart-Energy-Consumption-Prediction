/**
 * AI + IoT Smart Energy Consumption Prediction - Historical Predictions Table Controller
 * Manages the full 27,714-row historical test dataset from AI_IoT_Project/results/test_predictions.csv
 * 
 * Features:
 * - High-performance pagination (never renders all 27k rows into DOM simultaneously)
 * - Multi-column sorting (Timestamp, Actual Power, Predicted Power, Error)
 * - Real-time Timestamp search & error magnitude filtering
 * - Decimal formatting (W) and Positive/Negative residual interpretation
 * - Direct download of original test_predictions.csv
 */

class TableController {
  constructor() {
    this.allData = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.pageSize = 25;
    this.sortColumn = 'timestamp';
    this.sortAscending = true;
    this.filterErrorCategory = 'all';
    this.searchQuery = '';
  }

  /**
   * Set raw dataset from CSV parser
   * @param {Array} data - Array of 27,714 observation objects
   */
  setData(data) {
    if (!data || data.length === 0) {
      this.allData = [];
      this.filteredData = [];
      return;
    }
    this.allData = data;
    this.applyFilters();
  }

  /**
   * Render loading skeleton while CSV data is streaming/parsing
   */
  showSkeletonLoading(numRows = 8) {
    const tbody = document.getElementById('testDataTableBody');
    const countInfo = document.getElementById('tableCountInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (countInfo) {
      countInfo.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-actual-light);">
          <span class="loading-mini-spinner" aria-hidden="true"></span>
          Streaming 27,714 observations from test_predictions.csv...
        </span>
      `;
    }

    if (paginationControls) {
      paginationControls.innerHTML = '';
    }

    if (!tbody) return;

    let html = '';
    for (let i = 0; i < numRows; i++) {
      html += `
        <tr class="table-skeleton-row" aria-hidden="true">
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 24px; height: 14px;"></div></td>
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 140px; height: 14px;"></div></td>
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 65px; height: 14px;"></div></td>
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 65px; height: 14px;"></div></td>
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 55px; height: 14px;"></div></td>
          <td><div class="skeleton-shimmer skeleton-cell" style="width: 85px; height: 18px; border-radius: 9999px;"></div></td>
        </tr>
      `;
    }
    tbody.innerHTML = html;
  }

  /**
   * Render empty state when CSV data failed to load
   */
  showEmptyState(errorMessage) {
    const tbody = document.getElementById('testDataTableBody');
    const countInfo = document.getElementById('tableCountInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (countInfo) {
      countInfo.textContent = 'Historical dataset unavailable (test_predictions.csv not loaded)';
    }

    if (paginationControls) {
      paginationControls.innerHTML = '';
    }

    if (!tbody) return;

    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem 1.5rem;">
          <div class="table-empty-state">
            <div class="empty-icon-wrap" style="color: var(--color-error); margin: 0 auto 0.75rem auto;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h4 class="empty-state-title" style="margin-bottom: 0.35rem;">Historical Predictions Dataset Unavailable</h4>
            <p class="empty-state-desc" style="margin-bottom: 1.25rem;">
              ${errorMessage || 'Unable to load test_predictions.csv. Please verify that the ML results directory is available.'}
            </p>
            <button class="btn btn-secondary btn-sm" onclick="window.dataLoader.loadTestPredictionsCsv().then(() => window.renderDashboard(window.dataLoader))">
              Retry Loading CSV
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  setPageSize(size) {
    this.pageSize = Number(size);
    this.currentPage = 1;
    this.render();
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;
    let target = Number(page);
    if (isNaN(target) || target < 1) target = 1;
    if (target > totalPages) target = totalPages;
    this.currentPage = target;
    this.render();

    // Scroll table into view smoothly if user is deep in pagination
    const tableEl = document.getElementById('testPredictionsTable');
    if (tableEl && window.scrollY > tableEl.offsetTop + 200) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  setSearch(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  setErrorCategory(cat) {
    this.filterErrorCategory = cat;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Sort by column: timestamp, actual_power_w, predicted_power_w, error_w
   */
  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortData();
    this.updateSortIndicators();
    this.render();
  }

  updateSortIndicators() {
    const cols = ['timestamp', 'actual_power_w', 'predicted_power_w', 'error_w'];
    cols.forEach(col => {
      const ind = document.getElementById(`sortInd_${col}`);
      const th = document.getElementById(`th_${col}`);
      if (ind) {
        if (this.sortColumn === col) {
          ind.innerHTML = this.sortAscending ? '&uarr;' : '&darr;';
          ind.className = 'sort-indicator active';
        } else {
          ind.innerHTML = '&#x21C5;';
          ind.className = 'sort-indicator';
        }
      }
      if (th) {
        th.classList.toggle('sorted', this.sortColumn === col);
      }
    });
  }

  applyFilters() {
    let result = this.allData;

    // Filter by error magnitude
    if (this.filterErrorCategory === 'accurate') {
      result = result.filter(d => Math.abs(d.error_w) <= 5.0);
    } else if (this.filterErrorCategory === 'moderate') {
      result = result.filter(d => Math.abs(d.error_w) > 5.0 && Math.abs(d.error_w) <= 20.0);
    } else if (this.filterErrorCategory === 'outlier') {
      result = result.filter(d => Math.abs(d.error_w) > 20.0);
    }

    // Filter by search query (timestamp search primary, power/error secondary)
    if (this.searchQuery) {
      result = result.filter(d => {
        return (
          d.timestamp.toLowerCase().includes(this.searchQuery) ||
          d.actual_power_w.toFixed(2).includes(this.searchQuery) ||
          d.predicted_power_w.toFixed(2).includes(this.searchQuery) ||
          d.error_w.toFixed(2).includes(this.searchQuery)
        );
      });
    }

    this.filteredData = result;
    this.sortData();
    this.updateSortIndicators();
    this.render();
  }

  sortData() {
    const col = this.sortColumn;
    const asc = this.sortAscending;

    this.filteredData.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      if (col === 'timestamp') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  }

  render() {
    const tbody = document.getElementById('testDataTableBody');
    const countInfo = document.getElementById('tableCountInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (!tbody) return;

    const totalRecords = this.filteredData.length;
    const totalPages = Math.ceil(totalRecords / this.pageSize) || 1;
    
    // Bounds check
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageRecords = this.filteredData.slice(startIndex, startIndex + this.pageSize);

    // Update count display
    if (countInfo) {
      if (totalRecords === 0) {
        countInfo.textContent = 'No matching observations found';
      } else {
        const startNum = (startIndex + 1).toLocaleString();
        const endNum = Math.min(startIndex + this.pageSize, totalRecords).toLocaleString();
        const totalNum = totalRecords.toLocaleString();
        countInfo.innerHTML = `Showing <strong>${startNum}</strong> to <strong>${endNum}</strong> of <strong>${totalNum}</strong> observations (Page ${this.currentPage} of ${totalPages})`;
      }
    }

    // Render table rows
    if (pageRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <div style="font-size: 0.95rem; margin-bottom: 0.35rem;">No historical predictions match your search or filter</div>
            <div style="font-size: 0.78rem; color: var(--text-dim);">Try adjusting your timestamp search or selecting "All (27,714)"</div>
          </td>
        </tr>
      `;
    } else {
      let html = '';
      pageRecords.forEach((row, i) => {
        const actual = row.actual_power_w;
        const predicted = row.predicted_power_w;
        const error = row.error_w;
        const absErr = Math.abs(error);

        // Error Sign formatting (+ for positive under-prediction, - for negative over-prediction)
        const sign = error > 0 ? '+' : '';
        const formattedError = `${sign}${error.toFixed(2)} W`;

        // Residual interpretation badge:
        // Positive = under-prediction (Actual > Predicted)
        // Negative = over-prediction (Actual < Predicted)
        let residualBadge = '';
        if (absErr < 0.005) {
          residualBadge = '<span class="legend-chip" style="background: rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 0.7rem;">Exact Match</span>';
        } else if (error > 0) {
          residualBadge = '<span class="legend-chip chip-positive" title="Under-prediction: Model predicted less power than actual demand" style="font-size: 0.7rem;">Under-pred (+)</span>';
        } else {
          residualBadge = '<span class="legend-chip chip-negative" title="Over-prediction: Model predicted more power than actual demand" style="font-size: 0.7rem;">Over-pred (&minus;)</span>';
        }

        // Error magnitude coloring:
        // Red outline only for severe spikes (> 20W)
        let errorCellClass = 'color: var(--text-primary);';
        if (absErr > 20) {
          errorCellClass = 'color: var(--color-error-light); font-weight: 700;';
        } else if (absErr > 5) {
          errorCellClass = 'color: #fbbf24; font-weight: 600;';
        }

        html += `
          <tr>
            <td class="text-mono" style="color: var(--text-dim); font-size: 0.74rem;">${startIndex + i + 1}</td>
            <td class="text-mono" style="color: #ffffff; font-size: 0.8rem; font-weight: 500;">${row.timestamp}</td>
            <td class="text-mono" style="color: var(--color-actual-light); font-weight: 600;">${actual.toFixed(2)} W</td>
            <td class="text-mono" style="color: var(--color-predicted-light); font-weight: 600;">${predicted.toFixed(2)} W</td>
            <td class="text-mono" style="${errorCellClass}">${formattedError}</td>
            <td>${residualBadge}</td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }

    // Render pagination buttons & jump box
    if (paginationControls) {
      if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
      }

      let buttonsHtml = '';
      
      // First & Previous Page
      buttonsHtml += `
        <button class="page-btn" onclick="window.tableController.goToPage(1)" ${this.currentPage === 1 ? 'disabled' : ''} title="First Page">&laquo;</button>
        <button class="page-btn" onclick="window.tableController.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''} title="Previous Page">&lsaquo;</button>
      `;

      // Window of page numbers around current
      const startP = Math.max(1, this.currentPage - 2);
      const endP = Math.min(totalPages, startP + 4);

      if (startP > 1) {
        buttonsHtml += `<button class="page-btn" onclick="window.tableController.goToPage(1)">1</button>`;
        if (startP > 2) buttonsHtml += `<span style="padding: 0 4px; color: var(--text-muted);">&hellip;</span>`;
      }

      for (let p = startP; p <= endP; p++) {
        buttonsHtml += `
          <button class="page-btn ${p === this.currentPage ? 'active' : ''}" onclick="window.tableController.goToPage(${p})">
            ${p}
          </button>
        `;
      }

      if (endP < totalPages) {
        if (endP < totalPages - 1) buttonsHtml += `<span style="padding: 0 4px; color: var(--text-muted);">&hellip;</span>`;
        buttonsHtml += `<button class="page-btn" onclick="window.tableController.goToPage(${totalPages})">${totalPages}</button>`;
      }

      // Next & Last Page
      buttonsHtml += `
        <button class="page-btn" onclick="window.tableController.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''} title="Next Page">&rsaquo;</button>
        <button class="page-btn" onclick="window.tableController.goToPage(${totalPages})" ${this.currentPage === totalPages ? 'disabled' : ''} title="Last Page">&raquo;</button>
      `;

      // Jump to page input
      buttonsHtml += `
        <div style="display: inline-flex; align-items: center; gap: 0.35rem; margin-left: 0.5rem;">
          <span style="font-size: 0.74rem; color: var(--text-muted);">Go:</span>
          <input type="number" min="1" max="${totalPages}" value="${this.currentPage}" style="width: 55px; background: var(--bg-surface); border: 1px solid var(--border-default); color: #ffffff; padding: 0.25rem 0.35rem; border-radius: var(--radius-sm); font-size: 0.76rem; text-align: center;" onkeydown="if(event.key==='Enter') window.tableController.goToPage(this.value)">
        </div>
      `;

      paginationControls.innerHTML = buttonsHtml;
    }
  }

  /**
   * Export the currently filtered view to CSV without altering underlying file
   */
  exportFilteredCsv() {
    if (!this.filteredData || this.filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }

    let csv = 'timestamp,actual_power_w,predicted_power_w,error_w\n';
    this.filteredData.forEach(row => {
      csv += `${row.timestamp},${row.actual_power_w},${row.predicted_power_w},${row.error_w}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historical_predictions_filtered_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Export singleton
window.tableController = new TableController();
