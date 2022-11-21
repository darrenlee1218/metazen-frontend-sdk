import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';

import SendReceiveActionsBar from './index';
import theme from '../../../theme/theme';

describe('SendReceiveActionsBar', () => {
  test('renders icons, labels of each button correctly', () => {
    const sendReceiveActionsBar = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <SendReceiveActionsBar onSendClick={() => {}} onReceiveClick={() => {}} />
      </ThemeProvider>,
    );
    expect(sendReceiveActionsBar.toJSON()).toMatchSnapshot();
  });
});
