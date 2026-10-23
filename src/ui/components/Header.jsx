import React from 'react';
import { TAX_YEAR } from '../../config/taxRules';

export default function Header({ onReset, onLoadSample }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">฿</div>
        <div>
          <div className="title">Tax-Planner</div>
          <div className="subtitle">โปรแกรมคำนวณและวางแผนภาษีเงินได้บุคคลธรรมดา (ใช้งานง่าย ไม่ซับซ้อน)</div>
        </div>
      </div>
      <div className="header-actions">
        <span className="badge-year">ปีภาษี {TAX_YEAR} ({TAX_YEAR - 543})</span>
        <button type="button" className="btn-secondary" onClick={onLoadSample} title="โหลดข้อมูลตัวอย่าง">
          💡 โหลดตัวอย่าง
        </button>
        <button type="button" className="btn-secondary" onClick={onReset} title="ล้างข้อมูลทั้งหมด">
          ↺ ล้างข้อมูล
        </button>
      </div>
    </header>
  );
}
