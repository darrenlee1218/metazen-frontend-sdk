import React from 'react';

class DefaultErrorBoundary extends React.Component {
  state = {
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { errorMessage: JSON.stringify(error) };
  }

  render() {
    if (this.state.errorMessage) {
      return <p>Error: {this.state.errorMessage}.</p>;
    }
    return this.props.children;
  }
}

export default DefaultErrorBoundary;
