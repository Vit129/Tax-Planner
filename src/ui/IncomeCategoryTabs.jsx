import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import STRINGS from '../config/strings';
import COLORS from '../config/colors';
import TYPOGRAPHY from '../config/typography';
import OtherIncomeStep from './OtherIncomeStep';

export default function IncomeCategoryTabs({ entries, onChange, active, tab, onSelectTab }) {
  const [mountNode, setMountNode] = useState(null);

  useLayoutEffect(() => {
    if (!active) {
      setMountNode(null);
      return undefined;
    }

    const wizard = document.querySelector('#wizardContainer');
    const stepper = wizard?.querySelector('[data-testid="tax-wizard-stepper"]') || wizard?.firstElementChild;
    if (!wizard || !stepper) return undefined;

    const node = document.createElement('div');
    node.className = 'income-category-panel';
    stepper.insertAdjacentElement('afterend', node);
    setMountNode(node);
    return () => {
      setMountNode(null);
      node.remove();
    };
  }, [active]);

  if (!mountNode) return null;

  return createPortal(
    <>
      <div role="tablist" aria-label={STRINGS.INCOME_CATEGORY_LABEL} className="income-category-tabs">
        {[
          ['salary', STRINGS.INCOME_TAB_SALARY],
          ['other', STRINGS.INCOME_TAB_OTHER],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="btn"
            onClick={() => onSelectTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'other' && <OtherIncomeStep entries={entries} onChange={onChange} />}
      <style>{`
        .income-category-panel { display: flex; flex-direction: column; gap: 14px; order: 1; }
        .income-category-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .income-category-tabs [aria-selected="true"] { color: ${COLORS.BLUE}; font-weight: ${TYPOGRAPHY.WEIGHT_BOLD}; }
        .planner-income-step[data-income-tab="other"] #companyListContainer { display: none !important; }
        .planner-income-step #companyListContainer { order: 2; }
      `}</style>
    </>,
    mountNode
  );
}
