import { describe, it, expect } from 'vitest';
import { compareIncomeTaxMethods } from '../src/logic/incomeTaxMethods.js';

describe('[BE-UT] annual tax method comparison', () => {
  it('[Edge] excludes method 2 below the income threshold', () => {
    expect(compareIncomeTaxMethods(200, 119999).applies).toBe(false);
  });
  it('[Edge] includes method 2 exactly at the 120,000 threshold', () => {
    expect(compareIncomeTaxMethods(0, 120000)).toMatchObject({ applies: true, calculated: 600, exempt: true, taxBeforeCredits: 0 });
  });
  it('[Edge] exempts method 2 up to and including 5000 baht', () => {
    expect(compareIncomeTaxMethods(200, 1000000)).toMatchObject({ applies: true, calculated: 5000, exempt: true, taxBeforeCredits: 200 });
  });
  it('[Success] selects method 2 when it is higher and not exempt', () => {
    expect(compareIncomeTaxMethods(4000, 1200000)).toMatchObject({ calculated: 6000, exempt: false, selectedMethod: 2, taxBeforeCredits: 6000 });
  });
  it('[Alternative] selects progressive tax when it is higher', () => {
    expect(compareIncomeTaxMethods(7000, 1200000).taxBeforeCredits).toBe(7000);
  });
  it('[Edge] rejects invalid amounts', () => {
    expect(() => compareIncomeTaxMethods(0, -1)).toThrow(RangeError);
  });
});
