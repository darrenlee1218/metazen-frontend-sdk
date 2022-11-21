import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { WalletProps } from '@gryfyn-types/props/WalletProps';
import { setWalletConfig } from '@redux/reducer/walletConfig';

const WalletConfig: React.FunctionComponent<{ walletProps: WalletProps }> = ({
  walletProps: { isOpen, handleClose, config },
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(setWalletConfig(config));
    }
  }, [dispatch, isOpen, config]);

  return null;
};

export default WalletConfig;
