import { act } from 'react-dom/test-utils';
import React, { ComponentProps } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ThemeProvider } from '@mui/material/styles';

import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import { defaultNftAssetMetadata } from '@gryfyn-types/data-transfer-objects/DefaultNftAssetMetadata';

import theme from '@theme/theme';
import { SnackbarProvider } from '@lib/snackbar';
import GameCollectionInfo from '.';

let container: any = null;

const mockedUsedNavigate = jest.fn();
const mockedDispatch = jest.fn();
const mockedSelector = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as any),
  useDispatch: () => mockedDispatch,
  useSelector: () => mockedSelector,
}));

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

it('render all the required content.', () => {
  act(() => {
    const nftAssetMetadata: NftAssetMetadata = defaultNftAssetMetadata;
    const props = {
      nftAssetMetadata,
      sendNavRoute: '',
    } as ComponentProps<typeof GameCollectionInfo>;
    nftAssetMetadata.data.description = 'Test Description';
    render(
      <ThemeProvider theme={theme()}>
        <SnackbarProvider>
          <GameCollectionInfo {...props} />,
        </SnackbarProvider>
      </ThemeProvider>,
      container,
    );
  });
  expect(container.textContent).toContain('Test Description');
  expect(container.textContent).toContain('Description');
  expect(container.textContent).toContain('Properties');
});
