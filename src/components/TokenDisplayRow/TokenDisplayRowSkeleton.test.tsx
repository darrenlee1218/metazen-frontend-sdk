import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { TokenDisplayRowSkeleton } from './TokenDisplayRowSkeleton';
import { TestProviders } from '@utils/testing/TestProviders';
import Token from '@gryfyn-types/data-transfer-objects/Token';

afterEach(cleanup);

it('matches snapshot', () => {
  const { container } = render(<TokenDisplayRowSkeleton />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
