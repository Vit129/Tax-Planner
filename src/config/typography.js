import { TAX_UI_TYPOGRAPHY } from '@vit129/tax-ui';

export const TYPOGRAPHY = TAX_UI_TYPOGRAPHY;
export default TYPOGRAPHY;

export const CSS_FONT_SIZES = {
  '--text-base': '16px',
  '--text-100': '1rem',
  '--text-150': '1.5rem',
  '--text-110': '1.1rem',
  '--text-90': '0.9rem',
  '--text-80': '0.8rem',
  '--text-85': '0.85rem',
  '--text-120': '1.2rem',
  '--text-78': '0.78rem',
  '--text-75': '0.75rem',
  '--text-88': '0.88rem',
  '--text-72': '0.72rem',
  '--text-210': '2.1rem',
  '--text-160': '1.6rem',
};

Object.entries(CSS_FONT_SIZES).forEach(([name, value]) => {
  globalThis.document?.documentElement.style.setProperty(name, value);
});
