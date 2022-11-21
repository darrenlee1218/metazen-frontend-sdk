import React from 'react';
import { ComponentStory } from '@storybook/react';

import LinkComponent from '.';

export default {
  title: 'common-components/stateless/atoms/LinkComponent',
  component: LinkComponent,
  argTypes: {},
};

const Template: ComponentStory<typeof LinkComponent> = (args) => <LinkComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Link',
};
