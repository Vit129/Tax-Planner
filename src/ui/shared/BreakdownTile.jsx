import React from 'react';
import TYPOGRAPHY from '../../config/typography';

/**
 * Shared BreakdownTile (.tile) used across Hero Summary 4-tiles and Retirement Pool sub-cap tiles.
 */
export default function BreakdownTile({
  label,
  value,
  maxValue,
  dotColor,
  statusText,
  statusColor,
  dataTestId,
}) {
  // Sub-cap mode (with dot, status badge on right, and used / max below)
  if (maxValue != null || dotColor) {
    return (
      <div
        className="tile"
        data-testid={dataTestId}
        style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: TYPOGRAPHY.SIZE_MICRO,
              fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {dotColor && (
              <i
                className="dot"
                style={{ background: dotColor, margin: 0 }}
              />
            )}
            {label}
          </span>
          {statusText && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
                color: statusColor,
              }}
            >
              {statusText}
            </span>
          )}
        </div>
        <div
          className="num"
          style={{
            fontSize: TYPOGRAPHY.SIZE_TILE_NUM,
            fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
          }}
        >
          {value}{' '}
          {maxValue != null && (
            <span
              className="mut"
              style={{
                fontSize: TYPOGRAPHY.SIZE_MICRO,
                fontWeight: TYPOGRAPHY.WEIGHT_REGULAR,
              }}
            >
              / {maxValue}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard 2-line tile (label on top, number below)
  return (
    <div className="tile" data-testid={dataTestId}>
      <div className="mut">{label}</div>
      <div className="num">{value}</div>
    </div>
  );
}
