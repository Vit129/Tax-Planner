import React from 'react';
import { formatCurrency } from '../../logic/evalExpression';

export default function WhatIfSimulator({
  extraRmf,
  extraEsg,
  rmfRoom,
  esgRoom,
  taxSavings,
  onUpdateExtra,
}) {
  const maxRmfSlider = Math.max(0, Math.min(rmfRoom, 500000));
  const maxEsgSlider = Math.max(0, Math.min(esgRoom, 300000));

  return (
    <div className="card what-if-card">
      <div className="card-title">🎯 จำลองลดหย่อนเพิ่ม (What-If Simulator)</div>
      <p className="text-muted text-sm" style={{ marginTop: '4px', marginBottom: '14px' }}>
        ลองเลื่อนปรับยอดเงินที่ต้องการซื้อเพิ่ม เพื่อดูภาษีที่จะได้คืนเพิ่มขึ้นทันที
      </p>

      {/* RMF Slider */}
      <div className="slider-group">
        <div className="slider-label-row">
          <span>ซื้อ RMF เพิ่ม:</span>
          <span className="font-semibold text-accent">
            ฿{formatCurrency(extraRmf)} <span className="text-xs text-muted">(โควต้าเหลือ: ฿{formatCurrency(rmfRoom)})</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxRmfSlider}
          step="5000"
          value={extraRmf}
          disabled={maxRmfSlider <= 0}
          onChange={(e) => onUpdateExtra('rmf', Number(e.target.value))}
          className="slider-input"
        />
      </div>

      {/* Thai ESG Slider */}
      <div className="slider-group">
        <div className="slider-label-row">
          <span>ซื้อ Thai ESG เพิ่ม:</span>
          <span className="font-semibold text-accent">
            ฿{formatCurrency(extraEsg)} <span className="text-xs text-muted">(โควต้าเหลือ: ฿{formatCurrency(esgRoom)})</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={maxEsgSlider}
          step="5000"
          value={extraEsg}
          disabled={maxEsgSlider <= 0}
          onChange={(e) => onUpdateExtra('esg', Number(e.target.value))}
          className="slider-input"
        />
      </div>

      {/* Tax Savings badge */}
      {(extraRmf > 0 || extraEsg > 0) && (
        <div className="savings-badge">
          <span>💡 ประหยัดภาษีเพิ่มขึ้นทันที:</span>
          <b className="text-success" style={{ fontSize: '18px' }}>+฿{formatCurrency(taxSavings)}</b>
        </div>
      )}
    </div>
  );
}
