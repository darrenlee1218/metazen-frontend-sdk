import React, { FC } from 'react';
import styled from '@emotion/styled';

import Skeleton from '@mui/material/Skeleton';

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & > * {
    border-radius: 4px;
  }

  & > * + * {
    margin-top: ${({ theme }) => theme.spacing(3)};
  }
`;

export const LoadingSkeleton: FC = () => {
  return (
    <Root>
      <Skeleton sx={{ height: 24 }} variant="rectangular" />
      <Skeleton sx={{ flexGrow: 1 }} variant="rectangular" />
      <Skeleton sx={{ height: 40, flexShrink: 0 }} variant="rectangular" />
    </Root>
  );
};
