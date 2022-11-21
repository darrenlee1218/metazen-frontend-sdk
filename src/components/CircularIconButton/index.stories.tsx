import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CircularIconButton } from '.';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/atoms/CircularIconButton',
  component: CircularIconButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof CircularIconButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CircularIconButton> = (args) => <CircularIconButton {...args} />;

export const ReceiveButton = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ReceiveButton.args = {
  icon: <FileDownloadOutlined />,
  label: 'Receive',
};
