import React, { useState } from 'react';
import { formatCurrency } from '../../logic/evalExpression';

export default function TaxSummaryCard({ basePlan, simPlan, extraRmf, extraEsg }) {
  const [showItemized, setShowItemized] = useState(false);
  const plan = (extraRmf > 0 || extraEsg > 0) ? simPlan : basePlan;

  const marginalPercent = Math.round(plan.marginalRate * 100);

  return (
    <div className="tax-summary-wrapper">
      {/* 1. Hero Card: Refund or Payable */}
      <div className={`hero-card ${plan.isRefund ? 'hero-refund' : 'hero-payable'}`}>
        <span className="hero-tag">
          {plan.isRefund ? '🎉 คุณจะได้รับเงินคืนภาษี' : '⚠️ ภาษีที่ต้องชำระเพิ่ม'}
        </span>
        <div className="hero-amount">
          {plan.isRefund ? `+ ฿${formatCurrency(plan.settlement)}` : `- ฿${formatCurrency(plan.settlement)}`}
        </div>
        <div className="hero-subtext">
          ภาษีที่หักไว้ (฿{formatCurrency(plan.totalWithholding)}) {plan.isRefund ? '>' : '<'} ภาษีที่ต้องจ่ายจริง (฿{formatCurrency(plan.taxPayable)})
        </div>
      </div>

      {/* 2. Waterfall Calculation */}
      <div className="card summary-card">
        <div className="card-title">📊 สรุปการคำนวณภาษี (ภ.ง.ด. 91)</div>

        <div className="calc-table">
          <div className="calc-row">
            <span>1. รายได้รวมทั้งปี (Gross):</span>
            <b>฿{formatCurrency(plan.totalIncome)}</b>
          </div>
          <div className="calc-row text-danger">
            <span>2. หัก ค่าใช้จ่ายตามกฎหมาย (50% ไม่เกิน 1 แสน):</span>
            <b>- ฿{formatCurrency(plan.expenses)}</b>
          </div>
          <div className="calc-row text-danger">
            <span>3. หัก ค่าลดหย่อนรวม:</span>
            <b>- ฿{formatCurrency(plan.deductions)}</b>
          </div>

          <button
            type="button"
            className="btn-toggle-items"
            onClick={() => setShowItemized(!showItemized)}
          >
            {showItemized ? '▲ ซ่อนรายการย่อย' : '▼ ดูรายการค่าลดหย่อนย่อย'}
          </button>

          {showItemized && (
            <div className="itemized-box">
              {plan.deductionItems.map((item, idx) => (
                <div key={idx} className="itemized-row">
                  <span>• {item.label}</span>
                  <span>฿{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="calc-row calc-total">
            <span>= เงินได้สุทธิที่นำไปคำนวณภาษี:</span>
            <span className="text-accent">฿{formatCurrency(plan.netIncome)}</span>
          </div>

          <div className="calc-row" style={{ paddingTop: '10px' }}>
            <span>ภาษีที่คำนวณได้ทั้งปี:</span>
            <b>฿{formatCurrency(plan.taxPayable)}</b>
          </div>
          <div className="calc-row">
            <span>ภาษีที่ถูกหักไว้แล้ว (50 ทวิ):</span>
            <b className="text-muted">฿{formatCurrency(plan.totalWithholding)}</b>
          </div>
        </div>

        {/* 3. Tax Bracket Progress Gauge */}
        <div className="bracket-gauge-container">
          <div className="bracket-info">
            <span className="text-muted text-sm">ฐานภาษีสูงสุดของคุณ:</span>
            <span className="font-bold text-warning">{marginalPercent}%</span>
          </div>

          <div className="bracket-steps">
            <div className={`b-step ${plan.netIncome > 0 ? 'active' : ''}`} title="0% (0 - 150k)">0%</div>
            <div className={`b-step ${plan.netIncome > 150000 ? 'active' : ''}`} title="5% (150k - 300k)">5%</div>
            <div className={`b-step ${plan.netIncome > 300000 ? 'active' : ''}`} title="10% (300k - 500k)">10%</div>
            <div className={`b-step ${plan.netIncome > 500000 ? 'active' : ''}`} title="15% (500k - 750k)">15%</div>
            <div className={`b-step ${plan.netIncome > 750000 ? 'active' : ''}`} title="20% (750k - 1M)">20%</div>
            <div className={`b-step ${plan.netIncome > 1000000 ? 'active' : ''}`} title="25% - 35%">25%+</div>
          </div>
        </div>
      </div>

      {/* 4. Optimization Tip */}
      <div className="tip-box">
        <b className="text-accent">💡 ข้อแนะนำประหยัดภาษี:</b>
        <p className="tip-text">
          {marginalPercent > 0 ? (
            <>
              ฐานภาษีปัจจุบันของคุณอยู่ที่ <b>{marginalPercent}%</b> หมายความว่าทุกๆ <b>10,000 บาท</b> ที่คุณลงทุนในกองทุน ThaiESG หรือ RMF จะช่วยดึงเงินภาษีกลับคืนมาเข้ากระเป๋าคุณได้ถึง <b>{formatCurrency(10000 * (marginalPercent / 100))} บาท</b> ทันที!
            </>
          ) : (
            'ยินดีด้วยครับ! เงินได้สุทธิของคุณยังอยู่ในเกณฑ์ยกเว้นภาษี (0%) คุณไม่มีภาระภาษีที่ต้องชำระเพิ่มในปีนี้'
          )}
        </p>
      </div>
    </div>
  );
}
