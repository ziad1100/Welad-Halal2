import { describe, expect, it } from 'vitest';
import { formatReceipt, formatScreen } from '../../../../packages/shared-utils/src/index';

describe('currency', () => {
  it('screen uses ج.م, receipt uses EGP — never mixed', () => {
    expect(formatScreen(140)).toContain('ج.م');
    expect(formatScreen(140)).not.toContain('EGP');
    expect(formatReceipt(140)).toContain('EGP');
    expect(formatReceipt(140)).not.toContain('ج.م');
  });
});
