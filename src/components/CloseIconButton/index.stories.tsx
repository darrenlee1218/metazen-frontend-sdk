import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CloseIconButton from '.';

export default {
  title: 'common-components/stateless/atoms/CloseIconButton',
  component: CloseIconButton,
  argTypes: {},
} as ComponentMeta<typeof CloseIconButton>;

const Template: ComponentStory<typeof CloseIconButton> = (args) => <CloseIconButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  onClick: () => {},
};
