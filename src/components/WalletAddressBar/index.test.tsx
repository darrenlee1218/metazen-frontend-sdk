import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { WalletAddressBar } from '.';
import theme from '../../theme/theme';

describe('WalletAddressBar', () => {
  const setup = () => {
    return render(
      <ThemeProvider theme={theme()}>
        <WalletAddressBar walletAddress="0xDBC05B1ECB4FDAEF943819C0B04E9EF6DF4BABD6" />
      </ThemeProvider>,
    );
  };

  it('renders correctly given wallet address', () => {
    const { baseElement } = setup();
    expect(baseElement.textContent).toBe('Wallet Address0xDBC05B1ECB4FDAEF943819C0B04E9EF6DF4BABD6');
  });

  it('renders a tooltip after copy button is clicked', async () => {
    const baseDom = setup();

    // cast as any because clipboard is a read-only property
    (global.navigator as any).clipboard = {
      writeText: jest.fn(),
    };

    fireEvent.click(baseDom.getByTestId('copy-button'));

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });
});
