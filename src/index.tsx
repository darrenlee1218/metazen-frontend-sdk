import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import './index.css';
import { Demo } from './demo/Demo';
import { BlankPage } from './pages/Blank';
import { LoginCheckPage } from './pages/LoginCheck';
import { Web3Wallet } from './services/web3/Web3Wallet';

const WITH_DEMO = process.env.REACT_APP_WITH_DEMO === 'true';

Sentry.init({
  dsn: 'https://140e72e833a347da9c719c4165923743@sentry.hextech.io/4',
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

declare global {
  // declare target window to emit message to
  interface Window {
    emitTarget: EmitTarget;
  }
}

class EmitTarget {
  private target: Window;
  constructor() {
    this.target = window;
  }

  getTarget() {
    return this.target;
  }

  setTarget(target: Window) {
    this.target = target;
  }
}
// with web3 provider trigger, message events should fire to parent iframe
window.emitTarget = new EmitTarget();
window.emitTarget.setTarget(window.parent);
// if not using devtool, this window should be opened by iframe. window.parent will point to that
const isWeb3Wallet =
  window.location !== window.parent.location &&
  (localStorage.getItem('path') === '/web3-wallet' || location.pathname === '/web3-wallet');

switch (true) {
  case isWeb3Wallet:
    localStorage.setItem('path', '/web3-wallet');
    ReactDOM.render(
      <React.StrictMode>
        <Web3Wallet />
      </React.StrictMode>,
      document.getElementById('root'),
    );
    break;
  case WITH_DEMO && location.pathname === '/demo':
    ReactDOM.render(
      <React.StrictMode>
        <Demo />
      </React.StrictMode>,
      document.getElementById('root'),
    );
    break;
  case location.pathname === '/mfa-success':
    ReactDOM.render(
      <React.StrictMode>
        <BlankPage />
      </React.StrictMode>,
      document.getElementById('root'),
    );
    break;
  default:
    // show a thank you page and ask user to close it
    ReactDOM.render(
      <React.StrictMode>
        <LoginCheckPage />
      </React.StrictMode>,
      document.getElementById('root'),
    );
    break;
}

export * from './Wallet';

export type { WalletProps } from './types/props/WalletProps';

export { routePaths } from './pages/navigation';

export { default as Colors } from './theme/colors';
export { demoConfigs } from './demo/config';
