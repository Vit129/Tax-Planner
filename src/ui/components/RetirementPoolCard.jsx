import React from 'react';
import Card from '../shared/Card';
import ProgressBar from '../shared/ProgressBar';
import BreakdownTile from '../shared/BreakdownTile';
import STRINGS from '../../config/strings';
import COLORS from '../../config/colors';
import TYPOGRAPHY from '../../config/typography';
import { DEDUCTION_RULES } from '../../config/taxRules';
import { formatBaht } from '../../logic/evalExpression';

export default function RetirementPoolCard({ basePlan }) {
  const {
    retirementPoolUsed,
    retirementPoolRemain,
    rmfUsed,
    rmfCap,
    rmfRoom,
    pvdUsed,
    pvdCap,
    pvdRoom,
    pensionUsed,
    gpfUsed,
    pvdCompany,
  } = basePlan;

  const segments = [
    { key: 'rmf', value: rmfUsed, color: COLORS.ACCENT },
    { key: 'pvd', value: pvdUsed, color: COLORS.GOLD },
    { key: 'pension', value: pensionUsed, color: COLORS.BLUE },
    { key: 'gpf', value: gpfUsed, color: COLORS.MUT },
  ];

  const cardTitle = (
    <h2>
      {STRINGS.CARD_RETIRE_POOL_TITLE}{' '}
      <span className="mut">{STRINGS.CARD_RETIRE_POOL_SUB}</span>
    </h2>
  );

  return (
    <Card id="retirePoolCard" title={cardTitle} dataTestId="retirement-pool-card">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span
          className="num"
          style={{
            fontSize: TYPOGRAPHY.SIZE_POOL_MAIN,
            fontWeight: TYPOGRAPHY.WEIGHT_EXTRABOLD,
          }}
        >
          <span id="poolUsed">{formatBaht(retirementPoolUsed)}</span>{' '}
          <span
            className="mut"
            style={{
              fontSize: TYPOGRAPHY.SIZE_LABEL,
              fontWeight: TYPOGRAPHY.WEIGHT_REGULAR,
            }}
          >
            / {formatBaht(DEDUCTION_RULES.RETIREMENT_POOL_CAP)}
          </span>
        </span>
        <span
          id="poolRemain"
          style={{
            fontSize: TYPOGRAPHY.SIZE_SMALL,
            fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
            color: retirementPoolRemain > 0 ? COLORS.ACCENT : COLORS.MUT,
          }}
        >
          {retirementPoolRemain > 0
            ? `${STRINGS.POOL_REMAIN_PREFIX} ${formatBaht(retirementPoolRemain)}`
            : STRINGS.POOL_FULL_500K}
        </span>
      </div>

      <ProgressBar
        id="poolBar"
        segments={segments}
        totalMax={DEDUCTION_RULES.RETIREMENT_POOL_CAP}
        dataTestId="retirement-pool-bar"
      />

      <div className="row2" style={{ marginTop: 2 }}>
        <BreakdownTile
          label={STRINGS.TILE_RMF_SUBCAP}
          dotColor={COLORS.ACCENT}
          statusText={
            rmfRoom > 0
              ? `${STRINGS.POOL_REMAIN_PREFIX} ${formatBaht(rmfRoom)}`
              : STRINGS.POOL_FULL_SHORT
          }
          statusColor={rmfRoom > 0 ? COLORS.ACCENT : COLORS.MUT}
          value={formatBaht(rmfUsed)}
          maxValue={formatBaht(rmfCap)}
          dataTestId="tile-rmf-subcap"
        />

        <BreakdownTile
          label={STRINGS.TILE_PVD_SUBCAP}
          dotColor={COLORS.GOLD}
          statusText={
            pvdRoom > 0
              ? `${STRINGS.POOL_REMAIN_PREFIX} ${formatBaht(pvdRoom)}`
              : STRINGS.POOL_FULL_SHORT
          }
          statusColor={pvdRoom > 0 ? COLORS.GOLD : COLORS.MUT}
          value={formatBaht(pvdUsed)}
          maxValue={formatBaht(pvdCap)}
          dataTestId="tile-pvd-subcap"
        />
      </div>

      <p
        className="mut"
        id="coPvd"
        style={{
          borderTop: `1px solid ${COLORS.LINE}`,
          paddingTop: 6,
          fontSize: TYPOGRAPHY.SIZE_SMALL,
        }}
      >
        {STRINGS.MSG_CO_PVD(formatBaht(pvdCompany))}
      </p>
    </Card>
  );
}
