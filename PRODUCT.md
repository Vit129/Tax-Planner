# 📦 Product Specification: Tax-Planner (2569 / 2026)

## 1. Product Vision & Mission

**Tax-Planner** is an ultra-fast, privacy-first, zero-friction Thai Personal Income Tax (ภ.ง.ด. 90/91) calculator and investment deduction planner for tax year 2569 (2026).

### Core Problem It Solves
- **Tax complexity & anxiety:** Calculating Thai personal income tax with progressive brackets (0%–35%), combined retirement pool caps (฿500,000), separate Thai ESG caps (฿300,000), and multi-step insurance overflows is overwhelming for salaried professionals.
- **Mid-year job changes & pay raises:** Existing tax tools assume flat salary across 12 months. Tax-Planner allows granular employment periods and automated raise timelines.
- **Privacy vulnerability:** Users hesitate to enter sensitive salary and bonus data into third-party cloud apps. Tax-Planner executes **100% locally in the browser** without any server transmission or account tracking.
- **Actionable investment decisions:** Instead of just outputting tax payable, Tax-Planner answers the practical question: *"How much RMF or Thai ESG should I purchase before December 31 to drop to a lower tax bracket?"*

---

## 2. Target Personas

| Persona | Key Traits | Core Needs in Tax-Planner |
|---|---|---|
| **Salaried Professional (First-Jobber to Senior)** | Income ฿30,000–฿150,000/mo, PVD member | Quick computation of tax refund from 50 Tawi withholding; automated PVD & Social Security calculations. |
| **Job Hopper / Career Mover** | Changed employers during 2026 | Multi-company tab management, start/end month sliders, distinct PVD rates, and combined withholding reconciliation. |
| **Active Tax Planner & Investor** | High tax bracket (15%–35%), buying RMF/Thai ESG | What-If Simulator with one-click presets, monthly DCA planning chips, and custom AI prompt generation for mutual fund selection. |

---

## 3. Product Scope & Invariants (In-Scope vs. Out-of-Scope)

### ✅ In-Scope (สิ่งที่ระบบครอบคลุม)
1. **Employment Structures:** บริษัทเดียว 12 เดือน, ย้ายงานระหว่างปี (โบนัส 1 ที่ หรือ 2 ที่), การปรับเงินเดือน 1-2 ครั้ง (ผ่านโปร/ประจำปี)
2. **Tax Brackets 0%–35%:** ภ.ง.ด. 90/91 ครบทั้ง 6 ขั้นบันไดคำนวณแบบ Progressive Tax แม่นยำ 100%
3. **SSO 2569 Ministerial Regulation:** คำนวณเพดานค่าจ้างใหม่ ฿17,500/เดือน $\to$ สมทบ 5% สูงสุด ฿875/เดือน $\to$ เพดานลดหย่อนรวมสูงสุด **฿10,500/ปี**
4. **PVD & Retirement Pool (฿500,000 Cap):** PVD สะสม 2%–15%, RMF (30% ของเงินได้ $\le$ ฿500k ลบ PVD), กบข./กอช.
5. **Insurance & Pension Overflow:** ประกันชีวิตทั่วไป+สุขภาพ (฿100,000), ประกันบำนาญ (฿200,000) พร้อมกลไก Pension Overflow ไหลไปเติมทั่วไปที่ยังไม่เต็มอัตโนมัติ
6. **Smart Investment Advice:** คำนวณยอดซื้อ RMF เพื่อลดฐานภาษีลง 1 ขั้น (เช่น 20% $\to$ 15%, 35% $\to$ 30%) พร้อม DCA Planner รายเดือน

### ❌ Out-of-Scope (สิ่งที่ไม่รวมในระบบ และเหตุผล)
1. **ดอกเบี้ยเงินกู้ยืมเพื่อซื้อที่อยู่อาศัย (ดอกเบี้ยบ้าน):**
   - *เหตุผลพฤติกรรมจริง:* **คนที่มีภาระผ่อนดอกเบี้ยบ้าน มักจะไม่นำเงินสดก้อนใหญ่มาลงทุนซื้อ RMF**
   - *เหตุผลเชิงคำนวณ:* ดอกเบี้ยบ้านเป็นการลดหย่อนแบบหักตรง (Linear subtraction $\le$ ฿100,000) ไม่ได้มีเงื่อนไขเพดานเชื่อมโยงหลายชั้นเหมือนกลุ่มเกษียณ
2. **เงินบริจาคทั่วไป / เงินบริจาคพรรคการเมือง:**
   - เป็นขั้นตอนสุดท้ายหลังหักลดหย่อนทั้งหมดแล้ว ไม่ส่งผลต่อการวางแผนตัดสินใจซื้อกองทุน RMF
3. **ค่าลดหย่อนบุตร / บิดามารดา / ค่าคลอดบุตร:**
   - เป็นค่าคงที่ตามจำนวนคน (30,000 / 60,000 บาท) ซึ่งครอบคลุมใน Unit Test พื้นฐานแล้ว ไม่จำเป็นต้องนำมาเพิ่มมิติใน Scenario เพื่อไม่ให้ชุดทดสอบบวมเกินจำเป็น
4. **มาตรการกระตุ้นเศรษฐกิจชั่วคราว (เช่น Easy E-Receipt):**
   - เป็นมาตรการเฉพาะกิจที่มีอายุจำกัด ไม่ใช่กฎหมายภาษีถาวรของปี 2569

---

## 4. Product Features & Capabilities

### Feature 1: Multi-Employer Income & Salary Progression
- **Company Management:** Add up to 5 companies with individual start/end employment months.
- **Salary Adjustments Timeline:** Add mid-year raises with effective start months (e.g. Apr ฿65k → Oct ฿75k); visual chips with quick deletion.
- **Granular Month Grid:** Click any month (Jan–Dec) to override specific salary, add commissions, bonuses, or overtime.
- **Automatic Deductions:** Auto-calculates Social Security (SS max ฿875/mo, ฿10,500/yr cap for 2569) and employee/employer Provident Fund (PVD).

### Feature 2: Comprehensive Deductions Matrix (2569 Rules)
- **Personal & Family:** Personal (฿60k), Spouse (฿60k), First child (฿30k), Second child born 2018+ (฿60k), Parents (฿30k/person), Disabled person care (฿60k/person), Antenatal care (cap ฿60k).
- **Insurance:** General life & health (cap ฿100k, health sub-cap ฿25k), Spouse life insurance (cap ฿10k), Parents health insurance (cap ฿15k).
- **Pension Insurance Overflow:** Pension insurance automatically fills unused general life insurance room (up to ฿100k) before counting toward the 15% income / ฿200k pension cap.
- **Retirement Pool (฿500,000 Cap):** RMF (30% income, cap ฿500k), PVD (15% income, cap ฿500k), Pension insurance, and GPF/NSF (cap ฿30k) combined up to ฿500k.
- **Thai ESG (฿300,000 Cap):** Separate from the ฿500,000 retirement pool; allows 30% of assessable income up to ฿300k.

### Feature 3: Smart RMF Advice & DCA Planner
- **Bracket-Drop Strategy:** Calculates the exact amount needed to drop from the current marginal bracket to the lower bracket.
- **Monthly DCA Schedule:** If 4 months remain before year-end, generates exact monthly purchase targets (e.g. ฿25,000/month for 4 months) with month chips.
- **Real Net Cost Calculation:** Shows both tax saved and real net expenditure after tax reduction.

### Feature 4: What-If Simulator
- **Unified Amount Control:** Dual input mode via numeric input box and interactive range slider.
- **Strategy Presets:**
  - `Drop 1 Bracket`: Sets investment to exact room required to decrease marginal tax rate.
  - `Full RMF`: Maxes out the remaining RMF allowance.
  - `Full Thai ESG`: Maxes out the remaining Thai ESG allowance.
- **Instant ROI & Effective Savings:** Displays instant tax savings, effective return on investment (ROI %), and updated refund status.

### Feature 5: AI RMF Prompt Generator
- **Multi-Platform Support:** Ready-to-copy prompts with 1-click deep links for ChatGPT, Claude, and Gemini.
- **Portfolio Context Integration:** Injects current tax bracket, targeted budget, remaining DCA timeline, AMC preferences (SCB, KAsset, BBLAM, etc.), and investment theme focus.
- **Disclaimer Banner:** Explicit reminders that AI recommendations require personal fact-checking against official fund fact sheets.

---

## 5. Privacy, Security & Data Sovereignty
- **Zero Server Telemetry:** No user financial data leaves the client machine.
- **Pure Local Persistence:** State is persisted solely in browser `localStorage`.
- **Zero Third-Party Trackers:** No tracking pixels, ads, or analytics scripts.

---

## 6. Success Metrics & KPIs
1. **Calculation Accuracy:** 100% parity with Thai Revenue Department (ภ.ง.ด. 90/91) progressive tax tables and sub-caps.
2. **Performance:** Sub-100ms calculation re-render on complex multi-company input changes.
3. **Build Size:** Compressed production bundle under 100kB gzip.
4. **Architecture Purity:** 0 hardcoded strings, 0 hardcoded colors, 0 raw typography literals, and automated architecture guard tests passing on every commit.
