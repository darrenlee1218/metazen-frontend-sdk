import React from 'react';
import TestRenderer from 'react-test-renderer';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

import TitleWithIconOnTop from './index';
import ImageTile from '@components/ImageTile';
import theme from '@theme/theme';

const mockGameImgSrc = 'https://picsum.photos/200';

const imageLayout = (
  <ImageTile
    src={mockGameImgSrc}
    sx={{
      maxWidth: '60px',
      borderRadius: '8px',
      minHeight: '60px',
    }}
  />
);

const titleLayout = (
  <>
    <Typography variant="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
      Signature Request
    </Typography>
    <Typography variant="h5" color="text.primary">
      url-of-game.com
    </Typography>
  </>
);

describe('TitleWithIconOnTop', () => {
  test('renders given non-empty layout', () => {
    const recentActivity = TestRenderer.create(
      <ThemeProvider theme={theme()}>
        <TitleWithIconOnTop imageLayout={imageLayout} titleLayout={titleLayout} />
      </ThemeProvider>,
    );
    expect(recentActivity.toJSON()).toMatchSnapshot();
  });
});
