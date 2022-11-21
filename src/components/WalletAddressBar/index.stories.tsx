import React from 'react';

import WalletAddressBar from '.';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/molecules/WalletAddressBar',
  component: WalletAddressBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof WalletAddressBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WalletAddressBar> = (args) => <WalletAddressBar {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  walletAddress: '',
};

export const Primary = Template.bind({});
Primary.args = {
  walletAddress: '0xB3B66043A8F1E7F558BA5D7F46A26D1B41F5CA2A',
};
