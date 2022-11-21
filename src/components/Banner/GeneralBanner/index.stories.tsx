import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Banner from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/atoms/Banner/GeneralBanner',
  component: Banner,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Banner>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />;

export const Success = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Success.args = {
  message: 'The success case message',
  severity: 'success',
};

export const Error = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  message: 'Error case message',
  severity: 'error',
};

export const Warning = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Warning.args = {
  message: 'Warning case message',
  severity: 'warning',
};

export const Info = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Info.args = {
  message: 'Info case message',
  severity: 'info',
};
