import React from 'react';
import TestRenderer from 'react-test-renderer';

import Btn from '.';

describe('Button', () => {
  test('renders correctly', () => {
    const element = TestRenderer.create(<Btn variant="outlined">Im a button</Btn>);
    expect(element.toJSON()).toMatchSnapshot();
  });
});
