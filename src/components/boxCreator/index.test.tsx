import React from 'react';
import { render } from '@testing-library/react';

import { boxCreator } from '.';

describe('boxCreator', () => {
  const setup = () => {
    const Box = boxCreator({ width: 100 });
    return render(<Box>Children</Box>);
  };

  it('renders children correctly', () => {
    const { baseElement } = setup();
    expect(baseElement.textContent).toBe('Children');
  });
});
