import React, { useMemo, useState } from 'react';
import {
  TaxEasyApp,
  TAX_UI_TH_STRINGS,
  buildSimulatorModel,
  isSampleBannerVisible,
} from '@vit129/tax-ui';
import STRINGS from '../config/strings';
import OtherIncomeStep from './OtherIncomeStep';
import OtherIncomeSummary from './OtherIncomeSummary';
import IncomeCategoryTabs from './IncomeCategoryTabs';
import COLORS from '../config/colors';
import TYPOGRAPHY from '../config/typography';
import {
  toEasyInputs,
  toEasyPlan,
  createEasySimulatorRecalculate,
  buildEasyAiPrompt,
  buildAiChatUrl,
} from '../logic/easyTaxAdapter';

export default function EasyTaxApp({
  companies,
  deductions,
  foreignIncome = 0,
  otherIncome = [],
  onChangeOtherIncome,
  flowState,
  onUpdateFlow,
  simExtra,
  onChangeSimExtra,
  onUpdateCompany,
  onAddCompany,
  onRemoveCompany,
  onUpdateWithholding,
  onResetToAutoWithholding,
  onUpdateDeduction,
  onUpdateRmf,
  onUpdateEsg,
  onResetSample,
  onClearData,
  isSampleData,
  theme,
  onToggleTheme,
  taxYear,
}) {
  const isDark = theme === 'dark';
  const [incomeTab, setIncomeTab] = useState('salary');

  const easyInputs = useMemo(
    () => toEasyInputs(companies, deductions),
    [companies, deductions]
  );

  const easyPlan = useMemo(
    () => toEasyPlan(companies, deductions, { foreignIncome, otherIncome }),
    [companies, deductions, foreignIncome, otherIncome]
  );

  const simModel = useMemo(() => {
    const recalculate = createEasySimulatorRecalculate(companies, deductions, foreignIncome, otherIncome);
    return buildSimulatorModel({
      base: easyPlan,
      simExtra,
      recalculate,
    });
  }, [companies, deductions, foreignIncome, otherIncome, easyPlan, simExtra]);

  const labels = useMemo(
    () => ({
      ...TAX_UI_TH_STRINGS,
      AI_HOUSES: STRINGS.DEFAULT_AI_HOUSES,
      VAL_TAX_FORM_90: STRINGS.VAL_TAX_FORM_90,
    }),
    []
  );

  const handleBuildAiPrompt = (params) =>
    buildEasyAiPrompt(params, { basePlan: easyPlan, taxYear });

  const handleOpenAi = (provider, prompt) => {
    const url = buildAiChatUrl(provider, prompt);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasSavedOwnData = Boolean(flowState?.hasSavedOwnData);
  const sampleBannerShown = isSampleBannerVisible({ isSampleData, hasSavedOwnData });


  return (
    <div className="easy-tax-shell planner-income-step" data-theme={theme} data-income-tab={incomeTab}>
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          padding: '8px 16px 0',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {!sampleBannerShown && (
          <button
            type="button"
            className="btn"
            onClick={onResetSample}
            data-testid="btn-load-sample"
            style={{
              minHeight: '36px',
              padding: '4px 12px',
              fontSize: TYPOGRAPHY.SIZE_SMALL,
            }}
          >
            {STRINGS.BTN_LOAD_SAMPLE}
          </button>
        )}
        <button
          type="button"
          className="btn"
          onClick={onToggleTheme}
          data-testid="btn-toggle-theme"
          style={{
            minHeight: '36px',
            padding: '4px 12px',
            fontSize: TYPOGRAPHY.SIZE_SMALL,
          }}
        >
          {STRINGS.BTN_TOGGLE_THEME(isDark)}
        </button>
      </div>

      <IncomeCategoryTabs
        active={flowState?.currentStep === 1 && !flowState?.isSummaryMode}
        entries={otherIncome}
        onChange={onChangeOtherIncome}
        tab={incomeTab}
        onSelectTab={setIncomeTab}
      />
      <TaxEasyApp
        incomeSummary={<OtherIncomeSummary plan={easyPlan} />}
        inputs={easyInputs}
        plan={easyPlan}
        flowState={flowState}
        onUpdateFlow={onUpdateFlow}
        simExtra={simExtra}
        simModel={simModel}
        onChangeSimExtra={onChangeSimExtra}
        onUpdateCompany={onUpdateCompany}
        onAddCompany={onAddCompany}
        onRemoveCompany={onRemoveCompany}
        onUpdateWithholding={onUpdateWithholding}
        onResetToAutoWithholding={onResetToAutoWithholding}
        onUpdateDeduction={onUpdateDeduction}
        onUpdateRmf={onUpdateRmf}
        onUpdateEsg={onUpdateEsg}
        onResetSample={onResetSample}
        onClearData={onClearData}
        isSampleData={isSampleData}
        taxYear={taxYear}
        labels={labels}
        buildAiPrompt={handleBuildAiPrompt}
        onOpenAi={handleOpenAi}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 16px 160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          className="warn"
          role="note"
          data-testid="disclaimer-banner"
          style={{
            background: COLORS.BAD_SOFT,
            color: COLORS.BAD,
            fontSize: TYPOGRAPHY.SIZE_BADGE_MD,
          }}
        >
          <b>{STRINGS.DISCLAIMER_BOLD}</b> {STRINGS.DISCLAIMER_TEXT}
        </div>
      </div>
    </div>
  );
}
