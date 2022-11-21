import React, { FunctionComponent, useRef } from 'react';
import { SnackbarProvider as DefaultSnackbarProvider } from 'notistack';

import Grow from '@mui/material/Grow';
import { styled } from '@mui/material/styles';

import { SnackbarAction } from './SnackbarAction';

const StyledSnackbarProvider = styled(DefaultSnackbarProvider)`
  &.SnackbarItem-contentRoot {
    flex-wrap: nowrap;
    flex-direction: row-reverse;
    justify-content: space-around;

    .SnackbarItem-message {
      font-size: 12px;
    }

    .SnackbarItem-action {
      padding-left: 0;
      margin-right: 0;
      margin-left: 0;
    }
  }
`;

// wrap with custom config
export const SnackbarProvider: FunctionComponent = ({ children }) => {
  const ref = useRef<DefaultSnackbarProvider>(null);

  return (
    <StyledSnackbarProvider
      dense
      ref={ref}
      maxSnack={3}
      hideIconVariant
      preventDuplicate
      autoHideDuration={2000}
      TransitionComponent={Grow}
      action={(snackbarKey) => (
        <SnackbarAction
          onClick={() => {
            ref.current?.closeSnackbar(snackbarKey);
          }}
        />
      )}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      {children}
    </StyledSnackbarProvider>
  );
};

export { useSnackbar } from 'notistack';
