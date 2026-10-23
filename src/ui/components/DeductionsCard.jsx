import React from 'react';

export default function DeductionsCard({ deductions, onUpdateDeductions }) {
  const d = deductions || {};
  const up = (key, val) => onUpdateDeductions({ ...d, [key]: val });

  return (
    <div className="card deductions-card">
      <div className="card-header">
        <div className="card-title">👨‍👩‍👧 ค่าลดหย่อนภาษี (ปี 2569 / 2026)</div>
        <span className="text-muted text-sm">ติ๊กและกรอกเฉพาะรายการที่คุณมีสิทธิ์</span>
      </div>

      {/* 1. ส่วนตัวและครอบครัว */}
      <div className="deduction-group">
        <div className="group-heading">1. ค่าลดหย่อนส่วนตัวและครอบครัว</div>

        <div className="deduction-item-static">
          <span>ผู้มีเงินได้ (ตนเอง)</span>
          <span className="badge-amount text-success">฿60,000</span>
        </div>

        <div className="deduction-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={!!d.hasSpouse}
              onChange={(e) => up('hasSpouse', e.target.checked)}
            />
            <span>คู่สมรส (ไม่มีเงินได้ จดทะเบียนสมรส)</span>
          </label>
          <span className="badge-amount text-success">{d.hasSpouse ? '฿60,000' : '—'}</span>
        </div>

        <div className="deduction-grid">
          <div>
            <label className="field-sub">บุตรคนที่ 1 (คนละ 30,000)</label>
            <input
              type="number"
              min="0"
              max="10"
              value={d.childrenCount ?? ''}
              onChange={(e) => up('childrenCount', e.target.value)}
              placeholder="0"
              className="input-num"
            />
          </div>
          <div>
            <label className="field-sub">บุตรคนที่ 2+ เกิดปี 61 ขึ้นไป (คนละ 60,000)</label>
            <input
              type="number"
              min="0"
              max="10"
              value={d.children2018PlusCount ?? ''}
              onChange={(e) => up('children2018PlusCount', e.target.value)}
              placeholder="0"
              className="input-num"
            />
          </div>
        </div>

        <div className="deduction-grid">
          <div>
            <label className="field-sub">บิดา/มารดา (คนละ 30,000)</label>
            <input
              type="number"
              min="0"
              max="4"
              value={d.parentsCount ?? ''}
              onChange={(e) => up('parentsCount', e.target.value)}
              placeholder="0"
              className="input-num"
            />
          </div>
          <div>
            <label className="field-sub">เบี้ยประกันสุขภาพพ่อแม่ (ตามจริง สูงสุด 15,000)</label>
            <input
              type="text"
              value={d.parentsHealthInsurance ?? ''}
              onChange={(e) => up('parentsHealthInsurance', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>

        <div className="deduction-grid">
          <div>
            <label className="field-sub">ดูแลผู้พิการ / ทุพพลภาพ (คนละ 60,000)</label>
            <input
              type="number"
              min="0"
              max="5"
              value={d.disabledCareCount ?? ''}
              onChange={(e) => up('disabledCareCount', e.target.value)}
              placeholder="0"
              className="input-num"
            />
          </div>
          <div>
            <label className="field-sub">ค่าฝากครรภ์และคลอดบุตร (ตามจริง สูงสุด 60,000)</label>
            <input
              type="text"
              value={d.antenatalCare ?? ''}
              onChange={(e) => up('antenatalCare', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>
      </div>

      {/* 2. ประกัน */}
      <div className="deduction-group">
        <div className="group-heading">2. เบี้ยประกันชีวิตและสุขภาพ</div>
        <div className="deduction-grid">
          <div>
            <label className="field-sub">ประกันชีวิตทั่วไป</label>
            <input
              type="text"
              value={d.lifeInsurance ?? ''}
              onChange={(e) => up('lifeInsurance', e.target.value)}
              placeholder="สูงสุด 100,000"
              className="input-text"
            />
          </div>
          <div>
            <label className="field-sub">ประกันสุขภาพตนเอง (สูงสุด 25,000)</label>
            <input
              type="text"
              value={d.healthInsurance ?? ''}
              onChange={(e) => up('healthInsurance', e.target.value)}
              placeholder="สูงสุด 25,000"
              className="input-text"
            />
          </div>
        </div>

        <div className="deduction-grid">
          <div>
            <label className="field-sub">ประกันบำนาญ (สูงสุด 200,000 ไม่เกิน 15% เงินได้)</label>
            <input
              type="text"
              value={d.pensionInsurance ?? ''}
              onChange={(e) => up('pensionInsurance', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
          <div>
            <label className="field-sub">ประกันชีวิตคู่สมรส (สูงสุด 10,000)</label>
            <input
              type="text"
              value={d.spouseLifeInsurance ?? ''}
              onChange={(e) => up('spouseLifeInsurance', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>
      </div>

      {/* 3. กองทุนลดหย่อนภาษี */}
      <div className="deduction-group">
        <div className="group-heading">3. กองทุนเพื่อการเกษียณและสิ่งแวดล้อม</div>
        <div className="deduction-grid">
          <div>
            <label className="field-sub">กองทุน RMF (สูงสุด 30% ไม่เกิน 5 แสนร่วม)</label>
            <input
              type="text"
              value={d.rmf ?? ''}
              onChange={(e) => up('rmf', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
          <div>
            <label className="field-sub">กองทุน Thai ESG (สูงสุด 30% วงเงินแยก 300,000)</label>
            <input
              type="text"
              value={d.thaiEsg ?? ''}
              onChange={(e) => up('thaiEsg', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>
      </div>

      {/* 4. มาตรการรัฐ & เงินบริจาค */}
      <div className="deduction-group">
        <div className="group-heading">4. ดอกเบี้ยบ้าน, มาตรการรัฐ และเงินบริจาค</div>
        <div className="deduction-grid">
          <div>
            <label className="field-sub">ดอกเบี้ยเงินกู้ซื้อบ้าน (สูงสุด 100,000)</label>
            <input
              type="text"
              value={d.mortgageInterest ?? ''}
              onChange={(e) => up('mortgageInterest', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
          <div>
            <label className="field-sub">Easy E-Receipt (สูงสุด 50,000)</label>
            <input
              type="text"
              value={d.easyEReceipt ?? ''}
              onChange={(e) => up('easyEReceipt', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>

        <div className="deduction-grid">
          <div>
            <label className="field-sub">เงินบริจาคเพื่อการศึกษา/กีฬา/รพ.รัฐ (ลดหย่อน 2 เท่า)</label>
            <input
              type="text"
              value={d.donationEducation ?? ''}
              onChange={(e) => up('donationEducation', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
          <div>
            <label className="field-sub">เงินบริจาคทั่วไป (ตามจริง ไม่เกิน 10% เงินได้สุทธิ)</label>
            <input
              type="text"
              value={d.donationGeneral ?? ''}
              onChange={(e) => up('donationGeneral', e.target.value)}
              placeholder="0"
              className="input-text"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
