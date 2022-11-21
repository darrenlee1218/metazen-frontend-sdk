import React from 'react';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { StepStatus } from '@hooks/useAccountLevel';
import IconTitleStatus from '.';

let container: any = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders correctly given DISABLED status', () => {
  act(() => {
    render(
      <IconTitleStatus
        heading="label-value"
        iconNode={<QrCodeIcon color="primary" sx={{ fontSize: '14px' }} />}
        status={StepStatus.Locked}
      />,
      container,
    );
  });
  expect(container.textContent).toBe('label-value');
});

it('renders correctly given ENABLED status', () => {
  act(() => {
    render(
      <IconTitleStatus
        heading="label-value"
        iconNode={<QrCodeIcon color="primary" sx={{ fontSize: '14px' }} />}
        status={StepStatus.Unlocked}
      />,
      container,
    );
  });
  expect(container.textContent).toBe('label-value');
});

it('renders correctly given disabled status, empty label, iconUrl', () => {
  act(() => {
    render(
      <IconTitleStatus
        heading=""
        iconNode={<QrCodeIcon color="primary" sx={{ fontSize: '14px' }} />}
        status={StepStatus.Locked}
      />,
      container,
    );
  });
  expect(container.textContent).toBe('');
});
