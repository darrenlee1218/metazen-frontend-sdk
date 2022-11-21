import React from 'react';

import BarBox from '.';

import { ComponentStory, ComponentMeta } from '@storybook/react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateful/atoms/BarBox',
  component: BarBox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BarBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BarBox> = (args) => <BarBox>children</BarBox>;

export const Empty = Template.bind({});
Empty.args = {};
