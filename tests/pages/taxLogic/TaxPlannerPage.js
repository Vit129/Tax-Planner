import { expect } from '@playwright/test';

/**
 * TaxPlannerPage — Page Object Model for Tax-Planner Web UI (@vit129/tax-ui Easy Tax Wizard)
 * Encapsulates DOM locators, user input actions, and visual/geometry status checks.
 * Follows AODD-AISDLC Playwright Standards (rules/playwright/pw-coding-standards.md).
 */
export class TaxPlannerPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.activeCompanyIndex = 0;

    // Header & Banner Controls
    this.appHeader = page.locator('.tax-page-header');
    this.startOwnBtn = page.locator('#btnClearData');
    this.resetSampleBtn = page.locator('#btnResetSample');
    this.loadSampleBtn = page.locator('[data-testid="btn-load-sample"]');
    this.toggleThemeBtn = page.locator('[data-testid="btn-toggle-theme"]');
    this.toggleModeBtn = page.locator('#btnToggleMode');
    this.tutorialBtn = page.locator('#btnTutorial');

    // Wizard Stepper & Sticky Bottom Bar
    this.wizardStepper = page.locator('.wizard-nav');
    this.stickyBar = page.locator('.sticky-bar');
    this.stickyResultValue = page.locator('#stickyAmount');
    this.stickyTaxMeta = page.locator('#stickySub');
    this.nextStepBtn = page.locator('#btnStickyNext');
    this.prevStepBtn = page.locator('#btnStickyPrev');
    this.saveSummaryBtn = page.locator('#btnStickySave');

    // Step 1: Company Controls
    this.addCompanyBtn = page.locator('#btnAddCompany');

    // Step 3: Deductions Controls
    this.autoSsText = page.locator('#autoSsText');
    this.autoPvdText = page.locator('#autoPvdText');
    this.lifeInput = page.locator('#inputLifeIns');
    this.healthInput = page.locator('#inputHealthIns');
    this.mortgageInput = page.locator('#inputMortgage');
    this.parentsHealthInput = page.locator('#inputParentHealth');
    this.easyReceiptInput = page.locator('#inputEasyEReceipt');
    this.donationInput = page.locator('#inputDonation');

    // Step 4: Funds Controls
    this.rmfInput = page.locator('#inputRmfBought');
    this.esgInput = page.locator('#inputEsgBought');

    // Step 5 & 6: Result, Ladder, Advice, Simulator & Kept Cards
    this.activeLadderRate = page.locator('#ladderDisplay .ladder-bar.current');
    this.rmfAdviceCard = page.locator('.advice-box');
    this.retirementPoolCard = page.locator('[data-testid="retirement-pool-card"]');
    this.taxDetailsCard = page.locator('[data-testid="tax-details-card"]');

    // Tour Layer
    this.tourOverlay = page.locator('#tourLayer');
    this.tourSpot = page.locator('#tourSpot');
    this.tourTip = page.locator('#tourTip');
    this.tourNextBtn = page.locator('#tourNext');
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
    this.activeCompanyIndex = 0;
  }

  /**
   * Seeds localStorage with a Tax-Planner V2 payload and reloads the page.
   * @param {{ companies: Array, deductions: Object, foreignIncome?: number, isSampleMode?: boolean }} data
   */
  async loadV2Fixture(data) {
    await this.page.goto('/');
    await this.page.evaluate((payload) => {
      localStorage.setItem(
        'TAX_PLANNER_DATA_V2',
        JSON.stringify({
          companies: payload.companies,
          deductions: payload.deductions,
          foreignIncome: payload.foreignIncome || 0,
          isSampleMode: Boolean(payload.isSampleMode),
        })
      );
    }, data);
    await this.page.reload();
    await expect(this.appHeader).toBeVisible();
    this.activeCompanyIndex = 0;
  }

  /**
   * Navigates to a wizard step (1..6).
   * @param {number} stepNumber
   */
  async goToStep(stepNumber) {
    const stepBtn = this.wizardStepper.locator(`.step-btn[data-step="${stepNumber}"]`);
    await stepBtn.click();
  }

  /**
   * Ensures the collapsible more-options `<details>` is open for a company card.
   * @param {number} [idx]
   */
  async ensureCompanyOptionsOpen(idx = this.activeCompanyIndex) {
    const raiseMonth = this.page.locator(`#inputRaiseMonth-${idx}`);
    if (!(await raiseMonth.isVisible())) {
      const card = this.page.locator('.company-card').nth(idx);
      await card.locator('details.more-options > summary').click();
      await expect(raiseMonth).toBeVisible();
    }
  }

  /**
   * Fills base starting salary for a company card and commits via blur.
   * @param {string|number} salary
   * @param {number} [idx]
   */
  async fillBaseSalary(salary, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    const input = this.page.locator(`#inputSalary-${idx}`);
    await input.fill(String(salary));
    await input.blur();
  }

  /**
   * Sets first mid-year raise month and salary for a company card.
   * @param {number|string} month
   * @param {number|string} salary
   * @param {number} [idx]
   */
  async setFirstRaise(month, salary, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    await this.ensureCompanyOptionsOpen(idx);
    const monthSelect = this.page.locator(`#inputRaiseMonth-${idx}`);
    const salaryInput = this.page.locator(`#inputRaiseSalary-${idx}`);
    await monthSelect.selectOption(String(month));
    if (Number(month) > 0 && salary != null) {
      await salaryInput.fill(String(salary));
      await salaryInput.blur();
    }
  }

  /**
   * Fills annual bonus in baht for a company card.
   * @param {string|number} bonusBaht
   * @param {number} [idx]
   */
  async fillBonusBaht(bonusBaht, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    await this.ensureCompanyOptionsOpen(idx);
    const input = this.page.locator(`#inputBonus-${idx}`);
    await input.fill(String(bonusBaht));
    await input.blur();
  }

  /**
   * Fills fixed bonus months by converting to baht based on current salary.
   * @param {string|number} months
   * @param {number} [idx]
   */
  async fillFixedBonusMonths(months, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    const salRaw = await this.page.locator(`#inputSalary-${idx}`).inputValue();
    const salNum = Number(String(salRaw).replace(/,/g, '')) || 0;
    const bonusBaht = Math.round(salNum * Number(months));
    await this.fillBonusBaht(bonusBaht, idx);
  }

  /**
   * Fills annual other income (OT / commission / allowance) in baht.
   * @param {string|number} amount
   * @param {number} [idx]
   */
  async fillOtherIncome(amount, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    await this.ensureCompanyOptionsOpen(idx);
    const input = this.page.locator(`#inputOtherIncome-${idx}`);
    await input.fill(String(amount));
    await input.blur();
  }

  /**
   * Sets employee Provident Fund contribution rate (%).
   * @param {string|number} rate
   * @param {number} [idx]
   */
  async fillPvdRate(rate, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    const input = this.page.locator(`#inputPvdEmp-${idx}`);
    await input.fill(String(rate));
    await input.blur();
  }

  /**
   * Sets employment period (months 1-12).
   * @param {number} start
   * @param {number} end
   * @param {number} [idx]
   */
  async setEmploymentPeriod(start, end, idx = this.activeCompanyIndex) {
    await this.goToStep(1);
    const card = this.page.locator('.company-card').nth(idx);
    if (start != null) {
      await card.locator('.custom-select').nth(0).selectOption(String(start));
    }
    if (end != null) {
      await card.locator('.custom-select').nth(1).selectOption(String(end));
    }
  }

  /**
   * Adds a new company card on Step 1.
   */
  async addCompany() {
    await this.goToStep(1);
    await this.addCompanyBtn.click();
  }

  /**
   * Switches active company index for subsequent company actions.
   * @param {number} index
   */
  async selectCompanyTab(index) {
    this.activeCompanyIndex = index;
  }

  /**
   * Sets general life and health insurance premiums on Step 3.
   * @param {{ life?: number|string, health?: number|string }} opts
   */
  async setInsurance({ life, health }) {
    await this.goToStep(3);
    if (life != null) {
      await this.lifeInput.fill(String(life));
      await this.lifeInput.blur();
    }
    if (health != null) {
      await this.healthInput.fill(String(health));
      await this.healthInput.blur();
    }
  }

  /**
   * Sets RMF amount on Step 4.
   * @param {number|string} amount
   */
  async setRmf(amount) {
    await this.goToStep(4);
    await this.rmfInput.fill(String(amount));
    await this.rmfInput.blur();
  }

  /**
   * Asserts the active marginal tax bracket highlighted on the ladder (Step 5).
   * @param {string} expectedRate e.g. "10%", "15%"
   */
  async expectActiveLadderRate(expectedRate) {
    await this.goToStep(5);
    await expect(this.activeLadderRate.first()).toHaveText(expectedRate);
  }

  /**
   * Asserts the RMF recommendation card on Step 6 targets a specific drop bracket.
   * @param {string} targetRate e.g. "5%", "10%"
   */
  async expectRmfDropRecommendation(targetRate) {
    await this.goToStep(6);
    await expect(this.rmfAdviceCard).toBeVisible();
    await expect(this.rmfAdviceCard).toContainText(targetRate);
  }

  /**
   * Asserts total Social Security deduction text on Step 3.
   * @param {string} expectedSubstring e.g. "10,500"
   */
  async expectSocialSecurity(expectedSubstring) {
    await this.goToStep(3);
    await expect(this.autoSsText).toContainText(expectedSubstring);
  }

  /**
   * Asserts that Retirement Pool Card is visible on Step 4 or Step 6.
   */
  async expectRetirementPoolVisible() {
    await this.goToStep(4);
    await expect(this.retirementPoolCard).toBeVisible();
  }
}
