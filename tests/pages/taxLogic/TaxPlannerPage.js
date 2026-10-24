import { expect } from '@playwright/test';

/**
 * TaxPlannerPage — Page Object Model for Tax-Planner Web UI
 * Encapsulates DOM locators, user input actions, and visual status checks.
 * Follows AODD-AISDLC Playwright Standards (rules/playwright/pw-coding-standards.md).
 */
export class TaxPlannerPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & Reset Controls
    this.appHeader = page.locator('[data-testid="app-header"]');
    this.startOwnBtn = page.locator('#startOwn');
    this.loadSampleBtn = page.locator('[data-testid="btn-load-sample"]');

    // Salary & Company Controls
    this.salaryInput = page.locator('#salary');
    this.pvdEmpInput = page.locator('#pvdE');
    this.pvdCoInput = page.locator('#pvdC');
    this.bonusMonthsInput = page.locator('#bonusM');
    this.bonusExtraInput = page.locator('#bonusX');
    this.startMonthSelect = page.locator('#start');
    this.endMonthSelect = page.locator('#end');
    this.addCompanyBtn = page.locator('#addCo');

    // Deductions Controls
    this.ssVal = page.locator('#ssVal');
    this.pvdVal = page.locator('#pvdVal');
    this.lifeInput = page.locator('#life');
    this.healthInput = page.locator('#health');
    this.pensionChip = page.locator('[data-testid="extra-chip-pensionInsurance"]');
    this.pensionInput = page.locator('#extra-pensionInsurance');

    // Summary Cards & Visual Status
    this.activeLadderRate = page.locator('#ladder span.me');
    this.heroSummaryCard = page.locator('[data-testid="hero-summary-card"]');
    this.rmfAdviceCard = page.locator('[data-testid="rmf-advice-card"]');
    this.retirementPoolCard = page.locator('[data-testid="retirement-pool-card"]');
  }

  /**
   * Opens the application and resets state to a clean, single-company workspace.
   */
  async gotoAndReset() {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await expect(this.appHeader).toBeVisible();

    if (await this.startOwnBtn.isVisible()) {
      await this.startOwnBtn.click();
    }
  }

  /**
   * Fills base salary for the currently active company.
   * @param {string|number} salary
   */
  async fillBaseSalary(salary) {
    await this.salaryInput.fill(String(salary));
  }

  /**
   * Sets employee Provident Fund contribution rate (%).
   * @param {string|number} rate
   */
  async fillPvdRate(rate) {
    await this.pvdEmpInput.fill(String(rate));
  }

  /**
   * Sets fixed bonus months.
   * @param {string|number} months
   */
  async fillFixedBonusMonths(months) {
    await this.bonusMonthsInput.fill(String(months));
  }

  /**
   * Sets employment period (months 1-12).
   * @param {number} start
   * @param {number} end
   */
  async setEmploymentPeriod(start, end) {
    if (start != null) {
      await this.startMonthSelect.selectOption(String(start));
    }
    if (end != null) {
      await this.endMonthSelect.selectOption(String(end));
    }
  }

  /**
   * Adds a new company tab.
   */
  async addCompany() {
    await this.addCompanyBtn.click();
  }

  /**
   * Switches to a specific company tab by 0-based index.
   * @param {number} index
   */
  async selectCompanyTab(index) {
    const tab = this.page.locator(`[data-testid="co-tab-${index}"]`);
    await tab.click();
  }

  /**
   * Sets general life and health insurance premiums.
   * @param {{ life?: number|string, health?: number|string }} opts
   */
  async setInsurance({ life, health }) {
    if (life != null) {
      await this.lifeInput.fill(String(life));
    }
    if (health != null) {
      await this.healthInput.fill(String(health));
    }
  }

  /**
   * Toggles and fills pension insurance.
   * @param {number|string} amount
   */
  async setPensionInsurance(amount) {
    await expect(this.pensionChip).toBeVisible();
    await this.pensionChip.click();
    await expect(this.pensionInput).toBeVisible();
    await this.pensionInput.fill(String(amount));
  }

  /**
   * Asserts the active marginal tax bracket highlighted on the ladder.
   * @param {string} expectedRate e.g. "10%", "15%"
   */
  async expectActiveLadderRate(expectedRate) {
    await expect(this.activeLadderRate).toHaveText(expectedRate);
  }

  /**
   * Asserts the RMF recommendation card targets a specific drop bracket.
   * @param {string} targetRate e.g. "5%", "10%"
   */
  async expectRmfDropRecommendation(targetRate) {
    await expect(this.rmfAdviceCard).toBeVisible();
    await expect(this.rmfAdviceCard).toContainText(targetRate);
  }

  /**
   * Asserts total Social Security deduction text.
   * @param {string} expectedSubstring e.g. "10,500"
   */
  async expectSocialSecurity(expectedSubstring) {
    await expect(this.ssVal).toContainText(expectedSubstring);
  }

  /**
   * Asserts that Retirement Pool Card is visible.
   */
  async expectRetirementPoolVisible() {
    await expect(this.retirementPoolCard).toBeVisible();
  }
}
