import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import ButtonComponent from '@components/Button';
import { useAuth } from '@contexts/auth';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  align-items: center;

  padding: ${({ theme }) => theme.spacing(4)};
`;

export const SessionExpired: FC = () => {
  const { signIn } = useAuth();
  return (
    <Main>
      <Typography mt={2} variant="h1" fontWeight={600}>
        Session Expired
      </Typography>
      <Typography align="center" color="text.secondary" mt={2} variant="h4">
        Your session has timed out.
        <br />
        Please login again.
      </Typography>

      <Box component="span" sx={{ flexGrow: 1 }} />
      <ButtonComponent fullWidth variant="contained" color="primary" onClick={signIn}>
        Return to Login
      </ButtonComponent>
    </Main>
  );
};
