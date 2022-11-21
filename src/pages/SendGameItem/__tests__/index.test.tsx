import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { SendGameItem } from '..';
import { useSendGameItem } from '@hooks/useSendGameItem';
import { constants } from 'ethers';

jest.mock('../SendGameItemForm', () => ({
  __esModule: true,
  SendGameItemForm: () => 'SendGameItemForm',
}));

jest.mock('../SendGameItemConfirm', () => ({
  __esModule: true,
  SendGameItemConfirm: () => 'SendGameItemConfirm',
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useParams: () => ({
    key: '',
    tokenId: '',
  }),
}));

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));

jest.mock('@hooks/useSendGameItem');
const mockUseSendGameItem = useSendGameItem as jest.MockedFunction<typeof useSendGameItem>;

describe('Send Game Item', () => {
  it('should render SendGameItemForm when step is FillForm', () => {
    mockUseSendGameItem.mockReturnValueOnce({
      nativeCurrency: {},
      nftToken: {},
      nftMetadata: {},
      step: 0,
    } as any);
    const { container } = render(<SendGameItem />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        SendGameItemForm
      </div>
    `);
  });

  it('should render SendGameItemConfirm when step is Confirm', () => {
    mockUseSendGameItem.mockReturnValueOnce({
      nftToken: {},
      nftMetadata: {},
      nativeCurrency: {},
      step: 1,
      transactionFee: '0',
      recipientAddress: constants.AddressZero,
    } as any);
    const { container } = render(<SendGameItem />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        SendGameItemConfirm
      </div>
    `);
  });
});
