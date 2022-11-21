import React from 'react';
import TestRenderer from 'react-test-renderer';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from '@mui/material/styles';

import { CircularIconButton } from '.';
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

it('renders all the required content given valid icon and label.', () => {
  act(() => {
    render(
      <ThemeProvider theme={theme()}>
        <CircularIconButton icon={<div />} label="Receive" />
      </ThemeProvider>,
      container,
    );
  });
  expect(container.textContent).toBe('Receive');
});

describe('CircularIconButton', () => {
  test('renders icon, label', () => {
    const circularIconButton = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <CircularIconButton icon={<div />} label="lbl" />
      </ThemeProvider>,
    );

    expect(circularIconButton.toJSON()).toMatchSnapshot();
  });
});
