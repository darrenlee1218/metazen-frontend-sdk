import React from 'react';
import { ComponentStory } from '@storybook/react';
import ProgressIndicator from '.';
export default {
  title: 'common-components/stateless/molecules/ProgressIndicator',
};

const Template: ComponentStory<typeof ProgressIndicator> = (args) => <ProgressIndicator {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Empty = Template.bind({});
Empty.args = {};
