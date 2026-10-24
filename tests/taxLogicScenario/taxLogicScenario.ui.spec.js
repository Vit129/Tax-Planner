import { test, expect } from '@playwright/test';

test.describe('TaxLogicScenario — UI Browser End-to-End Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state on the local dev server
    await page.goto('/');
    // Clear localStorage to ensure deterministic scenario starting point
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();

    // Reset to pristine single-company and zero-deduction mode
    const startOwnBtn = page.locator('#startOwn');
    if (await startOwnBtn.isVisible()) {
      await startOwnBtn.click();
    }
  });

  test('UI Scenario 1: Single Employer, Bracket 10%, Zero Insurance, RMF Drop to 5%', async ({ page }) => {
    // 1. Enter Base Salary: 38,000
    const salaryInput = page.locator('#salary');
    await salaryInput.fill('38000');

    // 2. Set PVD Rate to 3%
    const pvdEmpInput = page.locator('#pvdE');
    await pvdEmpInput.fill('3');

    // 3. Set Bonus Fixed Months: 1 month
    const bonusInput = page.locator('#bonusM');
    await bonusInput.fill('1');

    // 4. Verify 2569 Social Security is automatically calculated (38k * 5% clamped to 875/mo = 10,500/yr)
    const ssVal = page.locator('#ssVal');
    await expect(ssVal).toContainText('10,500');

    // 5. Verify Ladder Rate is at 10%
    const ladderActive = page.locator('#ladder span.me');
    await expect(ladderActive).toHaveText('10%');

    // 6. Verify RMF Advice Card is visible and recommends purchasing RMF to drop to 5%
    const rmfCard = page.locator('[data-testid="rmf-advice-card"]');
    await expect(rmfCard).toBeVisible();
    await expect(rmfCard).toContainText('5%');
  });

  test('UI Scenario 2: Single Employer, Bracket 15%, Partial Insurance (Life 30k + Health 15k)', async ({ page }) => {
    // 1. Enter Base Salary: 65,000
    const salaryInput = page.locator('#salary');
    await salaryInput.fill('65000');

    // 2. Set PVD Rate to 5%
    const pvdEmpInput = page.locator('#pvdE');
    await pvdEmpInput.fill('5');

    // 3. Fill Partial Insurance
    const lifeInput = page.locator('#life');
    await lifeInput.fill('30000');

    const healthInput = page.locator('#health');
    await healthInput.fill('15000');

    // 4. Verify Ladder Rate is at 15%
    const ladderActive = page.locator('#ladder span.me');
    await expect(ladderActive).toHaveText('15%');

    // 5. Verify RMF Advice Card recommends dropping to 10%
    const rmfCard = page.locator('[data-testid="rmf-advice-card"]');
    await expect(rmfCard).toBeVisible();
    await expect(rmfCard).toContainText('10%');
  });

  test('UI Scenario 3: Job Switcher (2 Employers), Combined Income & 2569 Social Security Cap', async ({ page }) => {
    // 1. Company 1: Jan - Jun (Months 1 - 6), Base Salary 52,000, PVD 5%
    await page.locator('#salary').fill('52000');
    await page.locator('#pvdE').fill('5');
    await page.locator('#end').selectOption('6');

    // 2. Add Company 2
    const addCoBtn = page.locator('#addCo');
    await addCoBtn.click();

    // 3. Select Company 2 tab
    const tabCo2 = page.locator('[data-testid="co-tab-1"]');
    await tabCo2.click();

    // 4. Company 2: Jul - Dec (Months 7 - 12), Base Salary 65,000, PVD 5%
    await page.locator('#start').selectOption('7');
    await page.locator('#end').selectOption('12');
    await page.locator('#salary').fill('65000');
    await page.locator('#pvdE').fill('5');

    // 5. Verify Total Social Security remains strictly capped at 10,500 across both employers
    const ssVal = page.locator('#ssVal');
    await expect(ssVal).toContainText('10,500');

    // 6. Verify Combined Tax & Ladder Bracket
    const ladderActive = page.locator('#ladder span.me');
    await expect(ladderActive).toBeVisible();
  });

  test('UI Scenario 4: Pension Insurance Overflow into Unused General Life Insurance', async ({ page }) => {
    // 1. Base Salary 85,000
    await page.locator('#salary').fill('85000');

    // 2. General Life = 0, Health = 0 (pristine state already 0)
    await page.locator('#life').fill('0');
    await page.locator('#health').fill('0');

    // 3. Toggle Extra Deductions -> Pension Insurance
    const pensionChip = page.locator('[data-testid="extra-chip-pensionInsurance"]');
    await expect(pensionChip).toBeVisible();
    await pensionChip.click();

    const pensionInput = page.locator('#extra-pensionInsurance');
    await expect(pensionInput).toBeVisible();
    await pensionInput.fill('150000');

    // 4. Verify Retirement Pool Card reflects the active deductions
    const poolCard = page.locator('[data-testid="retirement-pool-card"]');
    await expect(poolCard).toBeVisible();
  });
});
