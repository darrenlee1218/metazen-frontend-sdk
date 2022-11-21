import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { TestProviders } from '@utils/testing/TestProviders';
import { Dropdown } from '.';

afterEach(cleanup);

const onChange = jest.fn();
it('matches snapshot', () => {
  const { container } = render(<Dropdown list={[]} onChange={onChange} />, { wrapper: TestProviders });

  expect(container).toMatchSnapshot();
});
