import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';

import AccountSecurityOption from './index';
import theme from '../../theme/theme';

describe('Test snapshot AccountSecurityOption components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <AccountSecurityOption type="passcode" configured onClick={() => {}} />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('Test snapshot AccountSecurityOption 2FA components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <AccountSecurityOption type="2FA" configured onClick={() => {}} />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('Test snapshot AccountSecurityOption 2FA with no on components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <AccountSecurityOption type="2FA" onClick={() => {}} />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('Test snapshot AccountSecurityOption passcode with no on components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <AccountSecurityOption type="passcode" onClick={() => {}} />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
