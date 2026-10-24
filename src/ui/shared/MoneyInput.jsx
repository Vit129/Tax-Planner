import React from 'react';
import TYPOGRAPHY from '../../config/typography';

/**
 * Shared labeled input box (.money) supporting currency prefix, unit suffix, or text/datalist.
 */
export default function MoneyInput({
  id,
  label,
  prefix,
  suffix,
  value,
  onChange,
  placeholder,
  inputMode = 'decimal',
  list,
  align = 'right',
  isText = false,
  dataTestId,
}) {
  return (
    <label className="f" htmlFor={id}>
      {label}
      <div className="money">
        {prefix && <span>{prefix}</span>}
        <input
          id={id}
          data-testid={dataTestId}
          type="text"
          inputMode={isText ? undefined : inputMode}
          list={list}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value, e)}
          placeholder={placeholder}
          style={{
            textAlign: isText ? 'left' : align,
            fontFamily: isText ? TYPOGRAPHY.FONT_BODY : TYPOGRAPHY.FONT_MONO,
          }}
        />
        {suffix && <span style={{ paddingRight: 10 }}>{suffix}</span>}
      </div>
    </label>
  );
}
