import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SendReceiveActionsBar from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/molecules/SendReceiveActionsBar',
  component: SendReceiveActionsBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SendReceiveActionsBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SendReceiveActionsBar> = (args) => <SendReceiveActionsBar {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  // None.
};
