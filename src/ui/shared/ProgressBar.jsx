import React from 'react';

/**
 * Shared multi-segment horizontal progress bar (.bar).
 */
export default function ProgressBar({
  id,
  segments = [],
  totalMax = 500000,
  dataTestId,
}) {
  return (
    <div id={id} data-testid={dataTestId} className="bar">
      {segments.map((seg, idx) => {
        const pct = totalMax > 0 ? Math.min(100, (seg.value / totalMax) * 100) : 0;
        return (
          <i
            key={seg.key || idx}
            style={{
              width: `${pct}%`,
              background: seg.color,
            }}
          />
        );
      })}
    </div>
  );
}
