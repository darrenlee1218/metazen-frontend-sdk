import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import GameCollectionDetailsHeader from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/molecules/GameCollectionDetailsHeader',
  component: GameCollectionDetailsHeader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof GameCollectionDetailsHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GameCollectionDetailsHeader> = (args) => (
  <GameCollectionDetailsHeader {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: 'Test',
};

export const Empty = Template.bind({});
Empty.args = {};
