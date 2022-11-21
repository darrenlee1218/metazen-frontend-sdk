import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import IconTitleStatus from '.';

enum EnabledStatus {
  ENABLED = 0,
  DISABLED = 1,
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/molecules/IconTitleStatus',
  component: IconTitleStatus,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof IconTitleStatus>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IconTitleStatus> = (args) => <IconTitleStatus {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  iconUrl: '',
  label: '',
  status: EnabledStatus.DISABLED,
};

export const DefaultEnabled = Template.bind({});
DefaultEnabled.args = {
  iconUrl: 'test.icon-url',
  label: 'test-label-for-default-enabled',
  status: EnabledStatus.ENABLED,
};

export const DefaultDisabled = Template.bind({});
DefaultDisabled.args = {
  iconUrl: 'test.icon-url',
  label: 'test-label-for-default-disabled',
  status: EnabledStatus.DISABLED,
};
