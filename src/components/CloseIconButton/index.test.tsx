import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';

import CloseIconButton from './index';
import theme from '@theme/theme';

const onClick = jest.fn();

describe('Test snapshot CloseIconButton components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <CloseIconButton onClick={onClick} />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
