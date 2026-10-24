import React from 'react';

/**
 * Shared Chip / Pill button used for Company Tabs, Spouse toggle, Extra Deduction toggles, and Simulator Presets.
 */
export default function ChipButton({
  id,
  active = false,
  variant = 'chip', // 'chip' | 'preset-blue' | 'preset-green' | 'preset-gold'
  onClick,
  role,
  children,
  dataTestId,
}) {
  if (variant.startsWith('preset')) {
    const colorKey = variant.replace('preset-', '');
    const cls = `preset-btn${active ? ` active-${colorKey}` : ''}`;
    return (
      <button
        id={id}
        data-testid={dataTestId}
        type="button"
        className={cls}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      id={id}
      data-testid={dataTestId}
      type="button"
      role={role}
      className="chip"
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
