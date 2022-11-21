import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AssetVariant, NftAssetTile } from '.';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

const defaultProps: ComponentProps<typeof NftAssetTile> = {
  variant: AssetVariant.Collection,
  assetIconUrl: 'assetIcon.jpg',
  networkIconUrl: undefined,
  assetName: 'NFT Asset',
  assetQuantity: '1',
  onClick: () => {},
};

it('calls the onClick callback when there is a click event', () => {
  const callback = jest.fn();
  const props = { ...defaultProps, onClick: callback };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  fireEvent.click(screen.getByAltText('NFT Asset image'));
  expect(callback).toHaveBeenCalled();
});

it('renders the quantity badge within the image when variant is Item', () => {
  const props = { ...defaultProps, variant: AssetVariant.Item, assetQuantity: '100' };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  const imageElement = screen.getByAltText('NFT Asset image');
  expect(imageElement.nextSibling).toHaveTextContent('100');
  const descriptorElement = screen.getByTestId('asset-descriptor');
  expect(descriptorElement.textContent).toBe('NFT Asset');
});

it('does not render quantity badge within image when assetQuantity is 1', () => {
  const props = { ...defaultProps, variant: AssetVariant.Item, assetQuantity: '1' };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  const imageElement = screen.getByAltText('NFT Asset image');
  expect(imageElement.nextSibling).toBe(null);
});

it('renders the quantity text in the descriptor when variant is Collection', () => {
  const props = { ...defaultProps, variant: AssetVariant.Collection, assetQuantity: '100' };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  const imageElement = screen.getByAltText('NFT Asset image');
  expect(imageElement.nextSibling).not.toBeInTheDocument();
  const descriptorElement = screen.getByTestId('asset-descriptor');
  expect(descriptorElement.textContent).toBe(['NFT Asset', '100 items'].join(''));
});

it('renders a skeleton when variant is Collection but assetQuantity is undefined', () => {
  const props = { ...defaultProps, variant: AssetVariant.Collection, assetQuantity: undefined };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  expect(screen.getByTestId('asset-descriptor')).toMatchSnapshot();
});

it('renders the networkIcon when it is defined', () => {
  const props = { ...defaultProps, networkIconUrl: 'networkIcon.jpg' };
  render(<NftAssetTile {...props} />, { wrapper: TestProviders });
  const imageElement = screen.getByAltText('network icon');
  expect(imageElement).toBeInTheDocument();
});

it('matches snapshot', () => {
  const { container } = render(<NftAssetTile {...defaultProps} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
