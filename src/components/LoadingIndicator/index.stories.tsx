import React from 'react';
import { ComponentStory } from '@storybook/react';

import LoadingIndicator from '.';

export default {
  title: 'common-components/stateless/atoms/LoadingIndicator',
  component: LoadingIndicator,
  argTypes: {},
};

const Template: ComponentStory<typeof LoadingIndicator> = (args) => <LoadingIndicator {...args} />;

export const Default = Template.bind({});
Default.args = {};
