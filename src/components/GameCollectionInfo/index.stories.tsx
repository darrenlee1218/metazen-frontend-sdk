import React from 'react';
import { Provider } from 'react-redux';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCollectionInfo from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/molecules/GameCollectionInfo',
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  component: GameCollectionInfo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof GameCollectionInfo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GameCollectionInfo> = (args) => <GameCollectionInfo {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  nftAssetMetadata: { data: { attributes: [], image: '', description: '' } },
};

export const Empty = Template.bind({});
Empty.args = {
  nftAssetMetadata: { data: { attributes: [], image: '', description: '' } },
};
