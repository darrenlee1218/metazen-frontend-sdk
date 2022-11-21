import React, { ComponentProps } from 'react';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssetTabItem, AssetTypeTabs } from '../AssetTypeTabs';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

it('should have colorPrimary on the selected tab', () => {
  const mockOnTabChange = jest.fn();
  const props: ComponentProps<typeof AssetTypeTabs> = {
    value: AssetTabItem.GameTokens,
    onTabChange: mockOnTabChange,
  };

  render(<AssetTypeTabs {...props} />, { wrapper: TestProviders });
  const selectedTabButton = screen.getByText('Game Tokens').parentElement!;
  expect(selectedTabButton.className).toMatch(/Mui-selected/i);
});

it('should trigger onTabChange on a click event', () => {
  const mockOnTabChange = jest.fn();
  const props: ComponentProps<typeof AssetTypeTabs> = {
    value: AssetTabItem.GameTokens,
    onTabChange: mockOnTabChange,
  };

  render(<AssetTypeTabs {...props} />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText('Collections'));
  expect(mockOnTabChange).toHaveBeenCalledWith(AssetTabItem.GameCollections);
});
