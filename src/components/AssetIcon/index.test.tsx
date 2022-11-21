import React from 'react';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/material/styles';

import AssetIcon from './index';
import theme from '../../theme/theme';

describe('Test snapshot AssetIcon components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <AssetIcon
          networkLogoUrl="https://frontend.beta.metazens.xyz/static/media/MATIC.78cb087e3fb45961f610523288cc94b9.svg"
          assetImageUrl="https://frontend.beta.metazens.xyz/static/media/DOSE.35c18daf6d64208142ccf4fdb0960067.svg"
        />
      </ThemeProvider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
