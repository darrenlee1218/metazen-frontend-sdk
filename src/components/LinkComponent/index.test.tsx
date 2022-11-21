import React from 'react';
import TestRenderer from 'react-test-renderer';

import LinkComponent from './index';

describe('Test snapshot LinkComponent components', () => {
  it('should be render correctly', () => {
    const tree = TestRenderer.create(<LinkComponent>Link</LinkComponent>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
