import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { ThemeProvider } from '@mui/system';
import Btn from '.';
import theme from '@theme/theme';

export default {
  title: 'common-components/stateless/atoms/Button',
  component: Btn,
  argTypes: {},
} as ComponentMeta<typeof Btn>;

const Template: ComponentStory<typeof Btn> = (args) => (
  <ThemeProvider theme={theme()}>
    <Btn {...args}>Default Button Testing text</Btn>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'contained',
  color: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  color: 'secondary',
  variant: 'outlined',
};

export const Contained = Template.bind({});
Contained.args = {
  variant: 'contained',
};

export const Warning = Template.bind({});
Warning.args = {
  variant: 'outlined',
  color: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  variant: 'outlined',
  color: 'error',
};

export const Disabled = Template.bind({});
Disabled.args = {
  variant: 'outlined',
  disabled: true,
};

export const Success = Template.bind({});
Success.args = {
  variant: 'outlined',
  color: 'success',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  variant: 'outlined',
  startIcon: <CallReceivedIcon />,
};

export const Loader = Template.bind({});
Loader.args = {
  variant: 'outlined',
  isLoading: 'true',
};

export const LoaderWithIcon = Template.bind({});
LoaderWithIcon.args = {
  variant: 'outlined',
  isLoading: 'true',
  startIcon: <CallReceivedIcon />,
};
