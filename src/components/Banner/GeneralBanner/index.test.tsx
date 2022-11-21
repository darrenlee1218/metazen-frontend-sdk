import React from 'react';
import TestRenderer from 'react-test-renderer';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import GeneralBanner from '.';

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

it('renders error banner text content correctly', () => {
  act(() => {
    render(<GeneralBanner message="General Banner Error" severity="error" />, container);
  });
  expect(container.textContent).toBe('General Banner Error');
});

it('renders info banner correctly', () => {
  act(() => {
    render(<GeneralBanner message="General Banner for Info" severity="info" />, container);
  });
  expect(container.textContent).toBe('General Banner for Info');
});

test('renders with error correctly', () => {
  const errorItem = TestRenderer.create(<GeneralBanner message="General Banner Error" severity="error" />);

  expect(errorItem.toJSON()).toMatchSnapshot();
});
