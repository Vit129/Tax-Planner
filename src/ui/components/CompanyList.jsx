import React from 'react';
import CompanyCard from './CompanyCard';

export default function CompanyList({ companies, onUpdateCompanies }) {
  const handleAddCompany = () => {
    const nextIdx = companies.length + 1;
    const newCompany = {
      name: `บริษัทที่ ${nextIdx}`,
      startMonth: 1,
      endMonth: 12,
      baseSalary: 50000,
      salaryAdjustments: [],
      bonusFixedMonths: 0,
      bonusVariable: 0,
      extraIncome: 0,
      pvdRateEmp: 0,
      pvdRateCo: 0,
      withholdingTax: '',
    };
    onUpdateCompanies([...companies, newCompany]);
  };

  const handleUpdate = (index, updatedCo) => {
    const next = [...companies];
    next[index] = updatedCo;
    onUpdateCompanies(next);
  };

  const handleRemove = (index) => {
    const next = companies.filter((_, i) => i !== index);
    onUpdateCompanies(next);
  };

  return (
    <div className="company-list">
      {companies.map((co, index) => (
        <CompanyCard
          key={index}
          company={co}
          index={index}
          canRemove={companies.length > 1}
          onUpdate={(updated) => handleUpdate(index, updated)}
          onRemove={() => handleRemove(index)}
        />
      ))}

      <button type="button" className="btn-add-company" onClick={handleAddCompany}>
        ➕ เพิ่มบริษัท (กรณีเปลี่ยนงานระหว่างปี)
      </button>
    </div>
  );
}
