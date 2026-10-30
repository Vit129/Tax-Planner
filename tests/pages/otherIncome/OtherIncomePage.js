import { expect } from '@playwright/test';
import { TaxPlannerPage } from '../taxLogic/TaxPlannerPage.js';
import STRINGS from '../../../src/config/strings.js';

export class OtherIncomePage extends TaxPlannerPage {
  constructor(page) {
    super(page);
    this.otherTab = page.getByRole('tab', { name: STRINGS.INCOME_TAB_OTHER });
    this.addIncome = page.getByRole('button', { name: STRINGS.OTHER_ADD });
    this.gross = page.getByLabel(STRINGS.OTHER_GROSS);
    this.withholding = page.getByLabel(STRINGS.OTHER_WITHHOLDING);
    this.summaryBanner = page.getByTestId('summary-tax-form-banner');
    this.incomeSummary = page.getByText(STRINGS.OTHER_SUMMARY, { exact: false });
  }

  async addFreelanceIncome({ income, withholding }) {
    await this.otherTab.click();
    await this.addIncome.click();
    await this.gross.fill(String(income));
    await this.withholding.fill(String(withholding));
  }

  async expectPersistedEntry({ income, withholding }) {
    await this.otherTab.click();
    await expect(this.gross).toHaveValue(String(income));
    await expect(this.withholding).toHaveValue(String(withholding));
  }

  async showSummary() {
    await this.toggleModeBtn.click();
    await expect(this.summaryBanner).toBeVisible();
  }
}
