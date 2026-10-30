import { test, expect } from '@playwright/test';
import { OtherIncomePage } from '../pages/otherIncome/OtherIncomePage.js';
import { OTHER_INCOME_JOURNEY } from '../fixtures/otherIncome/scenarios.data.js';

test('[FE-IT][Success] other income updates the annual tax and survives reload', async ({ page }) => {
  const taxPage = new OtherIncomePage(page);
  await taxPage.gotoAndReset();
  await taxPage.fillBaseSalary(OTHER_INCOME_JOURNEY.monthlySalary);
  const baseline = await taxPage.stickyTaxMeta.textContent();
  await taxPage.addFreelanceIncome(OTHER_INCOME_JOURNEY);
  await expect(taxPage.stickyTaxMeta).not.toHaveText(baseline);
  await page.reload();
  await taxPage.expectPersistedEntry(OTHER_INCOME_JOURNEY);
  await taxPage.showSummary();
  await expect(taxPage.summaryBanner).toContainText('90');
  await expect(taxPage.incomeSummary).toContainText('200,000');
});
