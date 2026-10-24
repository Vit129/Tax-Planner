import React from 'react';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import TYPOGRAPHY from '../../config/typography';
import { formatBaht } from '../../logic/evalExpression';

export default function Header({
  taxYear,
  isSampleMode,
  onStartOwn,
  onLoadSample,
  isRefund,
  settlement,
  theme = 'light',
  onToggleTheme,
}) {
  const isDark = theme === 'dark';

  return (
    <>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }} data-testid="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <h1>
            {STRINGS.APP_TITLE_PREFIX} {taxYear.be}{' '}
            <span className="mut" style={{ fontSize: TYPOGRAPHY.SIZE_BASE }}>
              ({taxYear.ce})
            </span>
          </h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {onToggleTheme && (
              <button
                type="button"
                className="btn"
                onClick={onToggleTheme}
                title={isDark ? STRINGS.THEME_LIGHT : STRINGS.THEME_DARK}
                style={{ minHeight: 36, padding: '4px 10px', fontSize: TYPOGRAPHY.SIZE_SMALL }}
                data-testid="btn-toggle-theme"
              >
                {STRINGS.BTN_TOGGLE_THEME(isDark)}
              </button>
            )}
            {!isSampleMode && (
              <button
                type="button"
                className="btn"
                onClick={onLoadSample}
                style={{ minHeight: 36, padding: '4px 12px', fontSize: TYPOGRAPHY.SIZE_SMALL }}
                data-testid="btn-load-sample"
              >
                {STRINGS.BTN_LOAD_SAMPLE}
              </button>
            )}
          </div>
        </div>
        <p className="mut">{STRINGS.APP_SUBTITLE}</p>
      </header>

      <div className="warn" data-testid="disclaimer-banner">
        <b>{STRINGS.DISCLAIMER_BOLD}</b> {STRINGS.DISCLAIMER_TEXT}
      </div>

      {isSampleMode && (
        <div className="banner" id="sampleBar" data-testid="sample-banner">
          <p>
            <b>{STRINGS.SAMPLE_BANNER_BOLD}</b> {STRINGS.SAMPLE_BANNER_TEXT}
          </p>
          <button
            className="btn pri"
            id="startOwn"
            type="button"
            onClick={onStartOwn}
            data-testid="btn-start-own"
          >
            {STRINGS.BTN_START_OWN}
          </button>
        </div>
      )}

      <div className="sticky" id="stickyBar" data-testid="sticky-summary-bar">
        <span className="mut">{STRINGS.STICKY_NOW_LABEL}</span>
        <b
          className="num"
          id="stickyVal"
          style={{ color: isRefund ? COLORS.ACCENT : COLORS.BAD }}
        >
          {(isRefund ? STRINGS.STICKY_REFUND : STRINGS.STICKY_PAY) + formatBaht(settlement)}
        </b>
      </div>
    </>
  );
}
