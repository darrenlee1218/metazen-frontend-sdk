import React, { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { clearAll } from '@redux/reducer/app';
import { selectHostName } from '@redux/selector';
import * as Web3MethodMap from '@services/web3/web3-api-service/messageEventHandler/methodMap';
import { useMutation, useQuery } from '@tanstack/react-query';

const REACT_APP_METAZENS_API = process.env.REACT_APP_METAZENS_API ?? '';

interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: Error;
  signIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextProps>({} as AuthContextProps);

export const checkIsLoggedIn = async (): Promise<boolean> => {
  const resp = await fetch(`${REACT_APP_METAZENS_API}/login/status`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  });

  if (resp.status === 200) {
    return true;
  }
  if (resp.status === 503) {
    console.error('[Auth] - Service unavailable, please try again later');
    throw new Error('Service unavailable, please try again later');
  } else {
    return false;
  }
};

export const useAuth = (): AuthContextProps => {
  return useContext<AuthContextProps>(AuthContext);
};

export const AuthProvider: FC = ({ children }) => {
  const dispatch = useDispatch();
  const platform = useSelector(selectHostName);

  const {
    isLoading,
    data: isAuthenticated = false,
    refetch,
  } = useQuery(['login', 'status'], checkIsLoggedIn, {
    enabled: Boolean(platform),
    onSuccess: async (_isAuthenticated) => {
      if (_isAuthenticated) {
        await Web3MethodMap.handleLogin();
      } else {
        console.debug('Unauthenticated, redirecting...');
        window.location.href = `${REACT_APP_METAZENS_API}/login?platform=${platform}`;
      }
    },
  });

  const { mutateAsync: handleLogout } = useMutation(
    async () => {
      await fetch(`${REACT_APP_METAZENS_API}/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
      });
    },
    {
      onSuccess: async () => {
        await Web3MethodMap.handleLogout();
      },
      onSettled: () => {
        dispatch(clearAll());
      },
    },
  );

  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          p: 0,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress disableShrink />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        signIn: refetch,
        signOut: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
