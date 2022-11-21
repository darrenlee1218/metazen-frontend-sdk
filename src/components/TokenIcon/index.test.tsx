import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { TokenIcon } from '.';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

const defaultProps: ComponentProps<typeof TokenIcon> = {
  tokenIconUrl: 'tokenIcon.png',
  networkIconUrl: 'networkIcon.png',
  isNative: false,
};

it('renders network icon if isNative is false', () => {
  render(<TokenIcon {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByTestId('network-icon')).toBeInTheDocument();
});

it('does not render network icon if isNative is true', () => {
  const props = { ...defaultProps, isNative: true };
  render(<TokenIcon {...props} />, { wrapper: TestProviders });
  expect(screen.queryByTestId('network-icon')).toBe(null);
});

it('matches snapshot', () => {
  const { container } = render(<TokenIcon {...defaultProps} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
