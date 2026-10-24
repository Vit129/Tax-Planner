import { test } from '@playwright/test';
import { TaxPlannerPage } from '../pages/taxLogic/TaxPlannerPage.js';

test.describe('@Critical [TS-TAX-WEB] Tax Planner Browser E2E User Journeys', () => {
  let taxPage;

  test.beforeEach(async ({ page }) => {
    taxPage = new TaxPlannerPage(page);
    await taxPage.gotoAndReset();
  });

  test('[TC-TAX-WEB-001] Single Employer, Bracket 10%, Zero Insurance, RMF Drop to 5% @Feature @High @Scenario', async () => {
    // 1. Enter Base Salary: 38,000, PVD: 3%, Fixed Bonus: 1 month
    await taxPage.fillBaseSalary(38000);
    await taxPage.fillPvdRate(3);
    await taxPage.fillFixedBonusMonths(1);

    // 2. Verify 2569 Social Security is automatically calculated (38k * 5% clamped to 875/mo = 10,500/yr)
    await taxPage.expectSocialSecurity('10,500');

    // 3. Verify Ladder Rate is at 10%
    await taxPage.expectActiveLadderRate('10%');

    // 4. Verify RMF Advice Card recommends dropping to 5%
    await taxPage.expectRmfDropRecommendation('5%');
  });

  test('[TC-TAX-WEB-002] Single Employer, Bracket 15%, Partial Insurance (Life 30k + Health 15k) @Feature @High @Scenario', async () => {
    // 1. Enter Base Salary: 65,000, PVD: 5%
    await taxPage.fillBaseSalary(65000);
    await taxPage.fillPvdRate(5);

    // 2. Fill Partial Insurance
    await taxPage.setInsurance({ life: 30000, health: 15000 });

    // 3. Verify Ladder Rate is at 15%
    await taxPage.expectActiveLadderRate('15%');

    // 4. Verify RMF Advice Card recommends dropping to 10%
    await taxPage.expectRmfDropRecommendation('10%');
  });

  test('[TC-TAX-WEB-003] Job Switcher (2 Employers), Combined Income & 2569 Social Security Cap @Feature @High @Scenario', async () => {
    // 1. Company 1: Jan - Jun (Months 1 - 6), Base Salary 52,000, PVD 5%
    await taxPage.fillBaseSalary(52000);
    await taxPage.fillPvdRate(5);
    await taxPage.setEmploymentPeriod(1, 6);

    // 2. Add Company 2 & Switch tab
    await taxPage.addCompany();
    await taxPage.selectCompanyTab(1);

    // 3. Company 2: Jul - Dec (Months 7 - 12), Base Salary 65,000, PVD 5%
    await taxPage.setEmploymentPeriod(7, 12);
    await taxPage.fillBaseSalary(65000);
    await taxPage.fillPvdRate(5);

    // 4. Verify Total Social Security remains strictly capped at 10,500 across both employers
    await taxPage.expectSocialSecurity('10,500');

    // 5. Verify Combined Tax & Ladder Bracket is active
    await taxPage.expectActiveLadderRate('10%');
  });

  test('[TC-TAX-WEB-004] Pension Insurance Overflow into Unused General Life Insurance @Feature @Medium @Scenario', async () => {
    // 1. Base Salary 85,000
    await taxPage.fillBaseSalary(85000);

    // 2. General Life = 0, Health = 0 (pristine state already 0)
    await taxPage.setInsurance({ life: 0, health: 0 });

    // 3. Toggle Extra Deductions -> Pension Insurance (150,000)
    await taxPage.setPensionInsurance(150000);

    // 4. Verify Retirement Pool Card reflects the active deductions
    await taxPage.expectRetirementPoolVisible();
  });
});
