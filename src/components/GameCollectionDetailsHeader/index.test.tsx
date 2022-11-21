import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import GameCollectionDetailsHeader from '.';

let container: any = null;

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
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

it('renders all the required header content.', () => {
  act(() => {
    render(<GameCollectionDetailsHeader nftTitle="Test" />, container);
  });
  expect(container.textContent).toContain('Test');
});
