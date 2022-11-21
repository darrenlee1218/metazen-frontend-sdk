import React from 'react';
import { ComponentStory } from '@storybook/react';
import AssetPropertyTile from '.';
export default {
  title: 'common-components/stateless/molecules/AssetPropertyTile',
};

const Template: ComponentStory<typeof AssetPropertyTile> = (args) => <AssetPropertyTile {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Property',
  value: 'Input',
};

export const Empty = Template.bind({});
Empty.args = {
  name: '',
  value: '',
};
