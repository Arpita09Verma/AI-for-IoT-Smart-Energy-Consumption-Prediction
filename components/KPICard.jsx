import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable KPI Card Component
 * Supports:
 * - Metric name & description
 * - Value & unit formatting
 * - Visual pulse animation on value update
 * - Accent styling (actual, predicted, forecast, bias, neutral)
 * - Safe handling of missing/unavailable data
 */
export const KPICard = ({
  id,
  label,
  value,
  unit = '',
  description,
  icon,
  type = 'neutral',
  loading = false,
  tooltip = ''
}) => {
  const [pulse, setPulse] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value && prevValueRef.current !== undefined) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 750);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value]);

  const typeClassMap = {
    actual: 'actual-metric',
    mae: 'mae-metric',
    predicted: 'predicted-metric',
    rmse: 'rmse-metric',
    forecast: 'forecast-metric',
    r2: 'r2-metric',
    positive: 'positive-metric',
    bias: 'bias-metric',
    samples: 'samples-metric',
    accent: 'accent-metric',
    neutral: 'neutral-metric'
  };

  const cardClass = `kpi-card ${typeClassMap[type] || 'neutral-metric'} ${pulse ? 'kpi-updated' : ''}`;

  const renderValue = () => {
    if (loading) {
      return (
        <span className="kpi-value">
          <span className="loading-mini-spinner" aria-hidden="true" style={{ width: 18, height: 18 }}></span>
        </span>
      );
    }
    if (value === null || value === undefined || value === '--' || value === 'Unavailable') {
      return (
        <span className="kpi-value" style={{ color: 'var(--text-muted)', fontSize: '1.45rem' }}>
          {value || 'Unavailable'}
        </span>
      );
    }
    return (
      <>
        <span className="kpi-value">{value}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </>
    );
  };

  return (
    <article className={cardClass} id={id} title={tooltip || description}>
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        {icon && (
          <div className="kpi-icon" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value-row">
        {renderValue()}
      </div>
      <p className="kpi-description">{description}</p>
    </article>
  );
};

export default KPICard;
