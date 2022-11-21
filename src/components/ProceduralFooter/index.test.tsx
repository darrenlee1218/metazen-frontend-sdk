import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ProceduralFooter } from '.';

describe('Procedural Footer', () => {
  it('should render a divider if requiredDivider is true', () => {
    const handleAdvance = jest.fn();
    const baseDom = render(<ProceduralFooter requireDivider onAdvance={handleAdvance} isAdvanceEnabled={false} />);
    expect(baseDom.container).toMatchSnapshot();
  });

  it('should render cancel button when onCancel is provided', () => {
    const handleCancel = jest.fn();
    const handleAdvance = jest.fn();
    const baseDom = render(
      <ProceduralFooter requireDivider onAdvance={handleAdvance} onCancel={handleCancel} isAdvanceEnabled={false} />,
    );
    expect(baseDom.container).toMatchSnapshot();
  });

  it('should not be able to call handleAdvance if isAdvanceEnabled is false', () => {
    const handleAdvance = jest.fn();
    const baseDom = render(<ProceduralFooter requireDivider onAdvance={handleAdvance} isAdvanceEnabled={false} />);

    fireEvent.click(baseDom.getByText('Next'));
    expect(handleAdvance).not.toHaveBeenCalled();
  });

  it('should be able to successfully call callbacks', () => {
    const handleCancel = jest.fn();
    const handleAdvance = jest.fn();
    const baseDom = render(
      <ProceduralFooter requireDivider isAdvanceEnabled onCancel={handleCancel} onAdvance={handleAdvance} />,
    );

    fireEvent.click(baseDom.getByText('Next'));
    expect(handleAdvance).toHaveBeenCalled();

    fireEvent.click(baseDom.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalled();
  });
});
