import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '..';
import { TestProviders } from '@utils/testing/TestProviders';

jest.mock('react-redux', () => ({
  useSelector: () => null,
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@hooks/useTokenBalances', () => ({
  useTokenBalances: () => ({}),
}));

jest.mock('../GameTokenList', () => ({
  __esModule: true,
  GameTokenList: () => 'GameTokenList',
}));

jest.mock('../GameCollectionList', () => ({
  __esModule: true,
  GameCollectionList: () => 'GameCollectionList',
}));

afterEach(cleanup);

it('should render GameTokenList when the tabValue is GameTokens', () => {
  render(<HomePage />, { wrapper: TestProviders });
  expect(screen.getByText('GameTokenList')).toBeInTheDocument();
});

it('should render GameCollection when the tabValue is GameCollections', () => {
  render(<HomePage />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText('Collections'));
  expect(screen.getByText('GameCollectionList')).toBeInTheDocument();
});

it('should continue to render GameCollection after remount', () => {
  const { unmount } = render(<HomePage />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText('Collections'));
  expect(screen.getByText('GameCollectionList')).toBeInTheDocument();
  unmount();

  render(<HomePage />, { wrapper: TestProviders });
  expect(screen.getByText('GameCollectionList')).toBeInTheDocument();
});
