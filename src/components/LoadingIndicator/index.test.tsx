import React from 'react';
import TestRenderer from 'react-test-renderer';

import LoadingIndicator from './index';

describe('Test snapshot LoadingIndicator components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(<LoadingIndicator />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
