import React from 'react';
import { render } from '@testing-library/react';

import { ThemeProvider } from '@mui/material/styles';

import theme from '@theme/theme';

import { NetworkBar } from '.';

describe('NetworkBar', () => {
  it('should render correctly', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme()}>
        <NetworkBar networkIconUrl="404.png" chainName="Polygon" />
      </ThemeProvider>,
    );
    expect(baseElement).toMatchSnapshot();
  });
});
