import { test, expect } from '@playwright/test';
import { TaxPlannerPage } from '../pages/taxLogic/TaxPlannerPage.js';
import {
  SCENARIOS,
  SHAPE_FIXTURE,
  LEGACY_V2_SAMPLE_FIXTURE,
} from '../fixtures/taxLogic/scenarios.data.js';

test.describe('@Critical [TS-TAX-WEB] Tax Planner Browser E2E User Journeys & Easy Tax UI Guards', () => {
  let taxPage;

  test.beforeEach(async ({ page }) => {
    taxPage = new TaxPlannerPage(page);
    await taxPage.gotoAndReset();
  });

  test('[TC-TAX-WEB-001] Single Employer, Bracket 10%, Zero Insurance, RMF Drop to 5% @Feature @High @Scenario', async () => {
    await taxPage.fillBaseSalary(38000);
    await taxPage.fillPvdRate(3);
    await taxPage.fillFixedBonusMonths(1);

    await taxPage.expectSocialSecurity('10,500');
    await taxPage.expectActiveLadderRate('10%');
    await taxPage.expectRmfDropRecommendation('5%');
  });

  test('[TC-TAX-WEB-002] Single Employer, Bracket 15%, Partial Insurance (Life 30k + Health 15k) @Feature @High @Scenario', async () => {
    await taxPage.fillBaseSalary(65000);
    await taxPage.fillPvdRate(5);
    await taxPage.setInsurance({ life: 30000, health: 15000 });

    await taxPage.expectActiveLadderRate('15%');
    await taxPage.expectRmfDropRecommendation('10%');
  });

  test('[TC-TAX-WEB-003] Job Switcher (2 Employers), Combined Income & 2569 Social Security Cap @Feature @High @Scenario', async () => {
    await taxPage.fillBaseSalary(52000);
    await taxPage.fillPvdRate(5);
    await taxPage.setEmploymentPeriod(1, 6);

    await taxPage.addCompany();
    await taxPage.selectCompanyTab(1);

    await taxPage.setEmploymentPeriod(7, 12);
    await taxPage.fillBaseSalary(65000);
    await taxPage.fillPvdRate(5);

    await taxPage.expectSocialSecurity('10,500');
    await taxPage.expectActiveLadderRate('10%');
  });

  test('[TC-TAX-WEB-004] Legacy V2 Saved Data & Pension Overflow into Retirement Pool Card @Feature @Medium @Scenario', async () => {
    const overflowScenario = SCENARIOS.find((s) => s.id === 'case-14');
    await taxPage.loadV2Fixture(overflowScenario);

    await taxPage.expectActiveLadderRate('20%');
    await taxPage.expectRetirementPoolVisible();
    await expect(taxPage.retirementPoolCard).toContainText('101,000');

    await taxPage.loadV2Fixture(LEGACY_V2_SAMPLE_FIXTURE);
    await expect(taxPage.page.locator('#inputSalary-0')).toHaveValue('40,000');
    await expect(taxPage.page.locator('#inputSalary-1')).toHaveValue('48,000');
  });

  test('[TC-TAX-WEB-005] Real-shaped Fixture Display, Round-Trip, and Every-Field Edit & Revert @Critical @Scenario', async ({ page }) => {
    await taxPage.loadV2Fixture(SHAPE_FIXTURE);

    // 1. Display check on Step 1
    await expect(page.locator('#inputSalary-0')).toHaveValue('52,000');
    await expect(page.locator('#inputPvdEmp-0')).toHaveValue('3');

    await taxPage.ensureCompanyOptionsOpen(0);
    await expect(page.locator('#inputRaiseMonth-0')).toHaveValue('3');
    await expect(page.locator('#inputRaiseSalary-0')).toHaveValue('54,500');
    await expect(page.locator('#inputBonus-0')).toHaveValue('109,000');
    await expect(page.locator('#inputOtherIncome-0')).toHaveValue('19,700');

    // Sticky bar shows tax ฿35,410 and refund +฿5,590
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');
    await expect(taxPage.stickyResultValue).toContainText('+฿5,590');

    // 2. Edit start salary -> tax changes -> revert -> ฿35,410
    await taxPage.fillBaseSalary(52500, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.fillBaseSalary(52000, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 3. Edit raise month -> tax changes -> revert -> ฿35,410
    await taxPage.setFirstRaise(6, 54500, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.setFirstRaise(3, 54500, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 4. Edit raise salary -> tax changes -> revert -> ฿35,410
    await taxPage.setFirstRaise(3, 70000, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.setFirstRaise(3, 54500, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 5. Edit bonus -> tax changes -> revert -> ฿35,410
    await taxPage.fillBonusBaht(200000, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.fillBonusBaht(109000, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 6. Edit other income -> tax changes -> revert -> ฿35,410
    await taxPage.fillOtherIncome(50000, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.fillOtherIncome(19700, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 7. Edit PVD % -> tax changes -> revert -> ฿35,410
    await taxPage.fillPvdRate(5, 0);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.fillPvdRate(3, 0);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 8. Edit deductions on Step 3 -> tax changes -> revert -> ฿35,410
    await taxPage.setInsurance({ life: 50000 });
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.setInsurance({ life: 12000 });
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');

    // 9. Edit RMF on Step 4 -> tax changes -> revert -> ฿35,410
    await taxPage.setRmf(40000);
    await expect(taxPage.stickyTaxMeta).not.toContainText('฿35,410');
    await taxPage.setRmf(5000);
    await expect(taxPage.stickyTaxMeta).toContainText('฿35,410');
    await expect(taxPage.stickyResultValue).toContainText('+฿5,590');
  });

  test('[TC-TAX-WEB-006] Sticky Bottom Bar, Responsive Viewports (360/390/768/1024), and Light/Dark Readability @Critical @Scenario', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await taxPage.loadV2Fixture(SHAPE_FIXTURE);

    for (const width of [360, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 844 });
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const stickyCheck = await page.evaluate(() => {
        const el = document.querySelector('.sticky-bar');
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          backgroundColor: style.backgroundColor,
          bottomGap: Math.abs(rect.bottom - window.innerHeight),
        };
      });
      expect(stickyCheck.position).toBe('fixed');
      expect(stickyCheck.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(stickyCheck.bottomGap).toBeLessThanOrEqual(2);
    }

    // Check money input box & active stepper icon in both Light and Dark themes
    for (const expectedTheme of ['light', 'dark']) {
      if (expectedTheme === 'dark') {
        await taxPage.toggleThemeBtn.click();
      }
      await expect(page.locator('html')).toHaveAttribute('data-theme', expectedTheme);

      const salaryInput = page.locator('#inputSalary-0');
      await salaryInput.focus();

      const uiReadability = await page.evaluate(() => {
        const box = document.getElementById('inputSalary-0').closest('.money-input');
        const boxStyle = window.getComputedStyle(box);
        const activeDot = document.querySelector('.wizard-nav .step-btn[aria-current="step"] .dot');
        const dotStyle = window.getComputedStyle(activeDot);
        return {
          borderTopWidth: parseFloat(boxStyle.borderTopWidth),
          boxBg: boxStyle.backgroundColor,
          outlineStyle: boxStyle.outlineStyle,
          dotBg: dotStyle.backgroundColor,
          dotColor: dotStyle.color,
        };
      });

      expect(uiReadability.borderTopWidth).toBeGreaterThanOrEqual(1);
      expect(uiReadability.boxBg).not.toBe('rgba(0, 0, 0, 0)');
      expect(uiReadability.outlineStyle).toBe('solid');
      expect(uiReadability.dotBg).not.toBe('rgba(0, 0, 0, 0)');
      expect(uiReadability.dotBg).not.toBe(uiReadability.dotColor);
    }

    expect(consoleErrors).toEqual([]);
  });

  test('[TC-TAX-WEB-007] Guided Tour Spotlights Inside Screen at 390x844 and 1024x800 @Critical @Scenario', async ({ page }) => {
    await taxPage.loadV2Fixture(SHAPE_FIXTURE);

    for (const vp of [
      { width: 390, height: 844 },
      { width: 1024, height: 800 },
    ]) {
      await page.setViewportSize(vp);
      await taxPage.tutorialBtn.click();
      await expect(taxPage.tourOverlay).toBeVisible();

      for (let i = 0; i < 8; i++) {
        await expect(taxPage.tourTip).toBeVisible();
        const tipBg = await taxPage.tourTip.evaluate(
          (el) => window.getComputedStyle(el).backgroundColor
        );
        expect(tipBg).not.toBe('rgba(0, 0, 0, 0)');

        const spotBox = await taxPage.tourSpot.boundingBox();
        if (spotBox && spotBox.width > 0 && spotBox.height > 0) {
          expect(spotBox.x).toBeGreaterThanOrEqual(-2);
          expect(spotBox.y).toBeGreaterThanOrEqual(-2);
          expect(spotBox.x + spotBox.width).toBeLessThanOrEqual(vp.width + 2);
          expect(spotBox.y + spotBox.height).toBeLessThanOrEqual(vp.height + 2);
        }

        await taxPage.tourNextBtn.click();
      }

      await expect(taxPage.tourOverlay).toBeHidden();
    }
  });
});
