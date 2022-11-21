import React from 'react';
import TestRenderer from 'react-test-renderer';

import BackNavigation from './index';

describe('Test snapshot BackNavigation components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(<BackNavigation label="Home" onBackPress={() => {}} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
