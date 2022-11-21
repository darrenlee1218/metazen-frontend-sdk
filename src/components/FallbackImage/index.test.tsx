import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { FallbackImage } from '.';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

// TODO: Very hard to test
it.todo('should display fallbackSrc if there is an error loading the original image');

it('matches snapshot', () => {
  const { container } = render(<FallbackImage src="404.png" fallbackSrc="fallback.png" />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
