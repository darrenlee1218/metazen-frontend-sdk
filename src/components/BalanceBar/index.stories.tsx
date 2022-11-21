import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BalanceBar } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'common-components/stateless/organisms/BalanceBar',
  component: BalanceBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    token: {
      control: 'text',
    },
    amount: {
      control: 'text',
    },
    price: {
      control: 'text',
    },
    amountUsdValue: {
      control: 'text',
    },
  },
} as ComponentMeta<typeof BalanceBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BalanceBar> = (args) => <BalanceBar {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  token: 'ETH',
  amount: '100',
  price: '10',
  amountUsdValue: '10',
};

export const Empty = Template.bind({});
Empty.args = {
  token: 'ETH',
  amount: '',
  price: '10',
  amountUsdValue: '10',
};
