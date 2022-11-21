import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BackNavigation from '.';

export default {
  title: 'common-components/stateless/molecules/BackNavigation',
  component: BackNavigation,
  argTypes: {},
} as ComponentMeta<typeof BackNavigation>;

const Template: ComponentStory<typeof BackNavigation> = (args) => <BackNavigation {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Matic',
};
