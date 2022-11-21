import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { OtherItemsCollapsible } from '.';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

const defaultProps: ComponentProps<typeof OtherItemsCollapsible> = {
  label: 'Label',
  numItems: 10,
  isOpen: false,
  children: <h1>Child</h1>,
  onClick: () => {},
};

it('should not render anything if numItems is 0', () => {
  const props = { ...defaultProps, numItems: 0 };
  render(<OtherItemsCollapsible {...props} />, { wrapper: TestProviders });
  expect(screen.queryByText(defaultProps.label)).toBe(null);
});

it('should hide children when isOpen is false', () => {
  render(<OtherItemsCollapsible {...defaultProps} />, { wrapper: TestProviders });
  const el = screen.getByTestId('collapse');
  expect(el.className).toMatch(/MuiCollapse-hidden/i);
});

it('should not hide children if isOpen is true', () => {
  const props = { ...defaultProps, isOpen: true };
  render(<OtherItemsCollapsible {...props} />, { wrapper: TestProviders });
  const el = screen.getByTestId('collapse');
  expect(el.className).not.toMatch(/MuiCollapse-hidden/i);
});

it('should trigger callback after a click event is fired', () => {
  const callback = jest.fn();
  const props = { ...defaultProps, onClick: callback };
  render(<OtherItemsCollapsible {...props} />, { wrapper: TestProviders });

  fireEvent.click(screen.getByText(defaultProps.label));
  expect(callback).toHaveBeenCalled();
});

it('matches snapshot', () => {
  const { container } = render(<OtherItemsCollapsible {...defaultProps} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
