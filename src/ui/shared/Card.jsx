import React from 'react';

/**
 * Shared Card container with optional step number badge, title, and right-side header element.
 */
export default function Card({
  id,
  stepNumber,
  title,
  rightElement,
  children,
  className = '',
  dataTestId,
}) {
  return (
    <section
      id={id}
      data-testid={dataTestId}
      className={`card ${className}`.trim()}
    >
      {(stepNumber != null || title || rightElement) && (
        <div
          className={stepNumber != null ? 'step' : 'card-head-row'}
          style={
            rightElement
              ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }
              : undefined
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {stepNumber != null && <b className="n">{stepNumber}</b>}
            {typeof title === 'string' ? <h2>{title}</h2> : title}
          </div>
          {rightElement}
        </div>
      )}
      {children}
    </section>
  );
}
