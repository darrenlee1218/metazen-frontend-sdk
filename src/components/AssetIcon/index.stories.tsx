import React from 'react';
import { ComponentStory, ComponentMeta, addDecorator } from '@storybook/react';

import AssetIcon from '.';

export default {
  title: 'common-components/stateless/molecules/AssetIcon',
  component: AssetIcon,
  argTypes: {},
} as ComponentMeta<typeof AssetIcon>;

const Template: ComponentStory<typeof AssetIcon> = (args) => <AssetIcon {...args} />;

export const Default = Template.bind({});

Default.args = {
  networkLogoUrl: 'https://frontend.beta.metazens.xyz/static/media/MATIC.78cb087e3fb45961f610523288cc94b9.svg',
  assetImageUrl: 'https://frontend.beta.metazens.xyz/static/media/DOSE.35c18daf6d64208142ccf4fdb0960067.svg',
};
