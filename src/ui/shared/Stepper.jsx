import React from 'react';

/**
 * Shared numeric Stepper (- / +) for count inputs (children, parents).
 */
export default function Stepper({
  value = 0,
  min = 0,
  max = 10,
  onChange,
  dataTestId,
}) {
  const dec = () => onChange?.(Math.max(min, value - 1));
  const inc = () => onChange?.(Math.min(max, value + 1));

  return (
    <div className="stepper" data-testid={dataTestId}>
      <button type="button" onClick={dec} disabled={value <= min}>
        −
      </button>
      <b className="num">{value}</b>
      <button type="button" onClick={inc} disabled={value >= max}>
        +
      </button>
    </div>
  );
}
