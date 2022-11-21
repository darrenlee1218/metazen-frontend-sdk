import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Typography from '@mui/material/Typography';

import ImageTile from '../../../stateless/atoms/ImageTile';
import TitleWithIconOnTop from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/organisms/TitleWithIconOnTop',
  component: TitleWithIconOnTop,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof TitleWithIconOnTop>;

const Template: ComponentStory<typeof TitleWithIconOnTop> = (args) => <TitleWithIconOnTop {...args} />;

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

export const Empty = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Empty.args = {
  imageLayout,
  titleLayout,
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  imageLayout,
  titleLayout,
};
