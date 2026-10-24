import React from 'react';
import Card from '../shared/Card';
import ChipButton from '../shared/ChipButton';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import TYPOGRAPHY from '../../config/typography';
import { getMarginalTaxRate } from '../../logic/taxLogic';
import { evalNumber, formatBaht, formatCurrency } from '../../logic/evalExpression';

function FundSimControl({
  idPrefix,
  title,
  bought,
  room,
  extra,
  recommended = 0,
  onChangeExtra,
}) {
  const totalCap = bought + room;
  const maxSlider = Math.max(1000, Math.ceil(totalCap / 1000) * 1000);
  const currentTotal = bought + extra;

  const isActual = extra === 0;
  const isRec = recommended > 0 && Math.abs(extra - recommended) < 50;
  const isFull = room > 0 && Math.abs(extra - room) < 50;

  const handleTotalInputChange = (e) => {
    const clean = e.target.value.replace(/[^0-9]/g, '');
    const targetTotal = clean === '' ? 0 : evalNumber(clean);
    const nextExtra = Math.max(0, Math.min(room, targetTotal - bought));
    onChangeExtra(nextExtra);
  };

  const handleSliderChange = (e) => {
    const targetTotal = evalNumber(e.target.value);
    const nextExtra = Math.max(0, Math.min(room, targetTotal - bought));
    onChangeExtra(nextExtra);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <b>{title}</b>
        <span className="mut">
          {STRINGS.SIM_BOUGHT_REMAIN(formatBaht(bought), formatBaht(room))}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <ChipButton
          id={`preset${idPrefix}Actual`}
          variant="preset-blue"
          active={isActual}
          onClick={() => onChangeExtra(0)}
          dataTestId={`preset-${idPrefix.toLowerCase()}-actual`}
        >
          {STRINGS.PRESET_ACTUAL} (<span>{formatBaht(bought)}</span>)
        </ChipButton>

        {recommended > 0 && (
          <ChipButton
            id={`preset${idPrefix}Rec`}
            variant="preset-green"
            active={isRec}
            onClick={() => onChangeExtra(Math.min(room, recommended))}
            dataTestId={`preset-${idPrefix.toLowerCase()}-rec`}
          >
            {STRINGS.PRESET_RECOMMENDED} (<span>{formatBaht(bought + recommended)}</span>)
          </ChipButton>
        )}

        {room > 0 && (
          <ChipButton
            id={`preset${idPrefix}Full`}
            variant="preset-gold"
            active={isFull}
            onClick={() => onChangeExtra(room)}
            dataTestId={`preset-${idPrefix.toLowerCase()}-full`}
          >
            {STRINGS.PRESET_FULL_CAP} (<span>{formatBaht(totalCap)}</span>)
          </ChipButton>
        )}
      </div>

      <div className="sim-money">
        <span className="currency">฿</span>
        <input
          id={`sim${idPrefix}Total`}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={currentTotal > 0 ? formatCurrency(currentTotal) : '0'}
          onChange={handleTotalInputChange}
          data-testid={`input-sim-${idPrefix.toLowerCase()}-total`}
        />
        <span className="diff-tag">
          {extra > 0 ? `(+${formatBaht(extra)})` : ''}
        </span>
      </div>

      <input
        type="range"
        id={`sim${idPrefix}`}
        step="1000"
        min="0"
        max={maxSlider}
        value={currentTotal}
        onChange={handleSliderChange}
        aria-label={title}
        data-testid={`slider-sim-${idPrefix.toLowerCase()}`}
      />

      <div
        className="mut num"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: TYPOGRAPHY.SIZE_MICRO,
        }}
      >
        <span>
          {STRINGS.SIM_CAP_PREFIX} <span>{formatBaht(totalCap)}</span>
        </span>
      </div>
    </div>
  );
}

export default function WhatIfSimulator({
  basePlan,
  simPlan,
  fullRmfPlan,
  fullEsgPlan,
  dropBracketPlan,
  deductions,
  extraRmf,
  extraEsg,
  taxYear,
  onUpdateExtra,
  onResetSim,
}) {
  const boughtRmf = evalNumber(deductions?.rmf);
  const boughtEsg = evalNumber(deductions?.thaiEsg);

  const paid = extraRmf + extraEsg;
  const saved = Math.max(0, basePlan.taxPayable - simPlan.taxPayable);
  const mePct = Math.round(basePlan.marginalRate * 100);
  const simPct = Math.round(simPlan.marginalRate * 100);

  const fullRmfSaved = fullRmfPlan ? Math.max(0, basePlan.taxPayable - fullRmfPlan.taxPayable) : 0;
  const fullEsgSaved = fullEsgPlan ? Math.max(0, basePlan.taxPayable - fullEsgPlan.taxPayable) : 0;
  const rmfRoiPct = basePlan.rmfRoom > 0 ? ((fullRmfSaved / basePlan.rmfRoom) * 100).toFixed(1) : null;

  const canDropBracket =
    basePlan.marginalRate > 0 &&
    basePlan.neededToDropBracket > 0 &&
    basePlan.neededToDropBracket <= basePlan.rmfRoom;
  const nextBracketRatePct = canDropBracket
    ? Math.round(getMarginalTaxRate(basePlan.netIncome - basePlan.neededToDropBracket) * 100)
    : mePct;
  const dropBracketSaved =
    canDropBracket && dropBracketPlan
      ? Math.max(0, basePlan.taxPayable - dropBracketPlan.taxPayable)
      : 0;

  const resetBtn = (
    <button
      className="btn"
      id="simReset"
      type="button"
      onClick={onResetSim}
      data-testid="btn-sim-reset"
    >
      {STRINGS.BTN_SIM_RESET}
    </button>
  );

  return (
    <Card
      id="sim"
      title={STRINGS.CARD_SIM_TITLE}
      rightElement={resetBtn}
      dataTestId="what-if-simulator"
    >
      <FundSimControl
        idPrefix="Rmf"
        title={STRINGS.SIM_RMF_HEAD}
        bought={boughtRmf}
        room={basePlan.rmfRoom}
        extra={extraRmf}
        recommended={basePlan.recommendedRmf}
        onChangeExtra={(val) => onUpdateExtra('rmf', val)}
      />

      <FundSimControl
        idPrefix="Esg"
        title={STRINGS.SIM_ESG_HEAD}
        bought={boughtEsg}
        room={basePlan.esgRoom}
        extra={extraEsg}
        recommended={0}
        onChangeExtra={(val) => onUpdateExtra('esg', val)}
      />

      {/* 3-Tile Comparison */}
      <div className="cmp" id="cmp">
        <div>
          <div className="mut">{STRINGS.CMP_PAID}</div>
          <div className="num">
            <b>{formatBaht(paid)}</b>
          </div>
        </div>
        <div>
          <div className="mut">{STRINGS.CMP_SAVED}</div>
          <div className="num" style={{ color: COLORS.ACCENT }}>
            <b>{formatBaht(saved)}</b>
          </div>
        </div>
        <div>
          <div className="mut">{STRINGS.CMP_BRACKET}</div>
          <div className="num">
            <b>
              {mePct}% → {simPct}%
            </b>
          </div>
        </div>
      </div>

      {/* Before -> After Lines */}
      <div id="simLines">
        <div className="line">
          <span>{STRINGS.LINE_ANNUAL_TAX}</span>
          <b className="num">
            {formatBaht(basePlan.taxPayable)} → {formatBaht(simPlan.taxPayable)}
          </b>
        </div>
        <div className="line">
          <span>{STRINGS.LINE_NET_INCOME}</span>
          <b className="num">
            {formatBaht(basePlan.netIncome)} → {formatBaht(simPlan.netIncome)}
          </b>
        </div>
        <div className="line">
          <span>{STRINGS.LINE_NET_COST}</span>
          <b className="num">{formatBaht(paid - saved)}</b>
        </div>
      </div>

      {/* Post-Purchase Settlement Badge */}
      {paid > 0 && (
        <div id="simAfter">
          <span
            className={`badge ${simPlan.isRefund ? 'real' : ''}`}
            style={{ fontSize: TYPOGRAPHY.SIZE_SMALL, padding: '3px 10px' }}
          >
            {(simPlan.isRefund
              ? STRINGS.BADGE_AFTER_BUY_REFUND
              : STRINGS.BADGE_AFTER_BUY_PAY) + formatBaht(simPlan.settlement)}
          </span>
        </div>
      )}

      {/* Full Cap ROI Summary */}
      <div id="simFull">
        <div className="line">
          <span>{STRINGS.SIM_FULL_RMF_LABEL(formatBaht(basePlan.rmfRoom))}</span>
          <b className="num">
            {formatBaht(fullRmfSaved)}
            {rmfRoiPct ? ` (ROI ${rmfRoiPct}%)` : ''}
          </b>
        </div>
        <div className="line">
          <span>{STRINGS.SIM_FULL_ESG_LABEL(formatBaht(basePlan.esgRoom))}</span>
          <b className="num">{formatBaht(fullEsgSaved)}</b>
        </div>

        {canDropBracket && (
          <div className="advice" style={{ marginTop: 8 }}>
            <span>
              {STRINGS.SIM_BRACKET_DROP_TIP(
                formatBaht(basePlan.neededToDropBracket),
                nextBracketRatePct,
                formatBaht(dropBracketSaved)
              )}
            </span>
          </div>
        )}
      </div>

      <p className="note" id="simNote">
        {STRINGS.NOTE_SIM_FOOTER(taxYear.be)}
      </p>
    </Card>
  );
}
