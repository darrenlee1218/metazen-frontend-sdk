import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown } from '.';

export default {
  title: 'common-components/stateless/atoms/Dropdown',
  component: Dropdown,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Dropdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  list: [],
};

export const Default = Template.bind({});
Default.args = {
  optionAll: {
    value: 'All',
    text: 'All',
  },
  list: [
    {
      value: 'Received',
      text: 'Received',
    },
    {
      value: 'Sent',
      text: 'Sent',
    },
  ],
};
