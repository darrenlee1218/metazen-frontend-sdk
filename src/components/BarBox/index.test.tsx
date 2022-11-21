import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from '@mui/material/styles';

import BarBox from './index';
import theme from '../../theme/theme';

let container: any = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders correctly given some children', () => {
  act(() => {
    render(
      <ThemeProvider theme={theme()}>
        <BarBox label="Balance">
          <p>23.7135</p>
        </BarBox>
      </ThemeProvider>,
      container,
    );
  });
  expect(container.textContent).toBe('Balance23.7135');
});
