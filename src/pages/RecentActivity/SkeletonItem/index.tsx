import React, { useEffect } from 'react';

import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import { CustomTheme, useTheme } from '@mui/material/styles';

interface ItemProps {
  fetchNextPage: () => void;
  acionFilter: string;
  typeFilter?: string;
}
export const SkeletonItem: React.FC<ItemProps> = ({ fetchNextPage, acionFilter, typeFilter = '' }) => {
  const theme = useTheme() as CustomTheme;
  useEffect(() => {
    if (acionFilter !== '' || typeFilter !== '') {
      fetchNextPage();
    }
  });
  return (
    <div style={{ marginLeft: '24px', marginRight: '24px' }}>
      <ListItem
        component="div"
        sx={{
          backgroundColor: theme.palette.colors.clickableGray,
          borderRadius: 4,
          mt: 1,
          mb: 1,
        }}
      >
        <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <div>
          <Skeleton variant="rectangular" animation="wave" width={120} height={10} sx={{ borderRadius: 2, mt: 0.5 }} />
          <Skeleton variant="rectangular" animation="wave" width={160} height={10} sx={{ borderRadius: 2, mt: 1 }} />
          <Skeleton
            variant="rectangular"
            animation={false}
            width={190}
            height={10}
            sx={{ borderRadius: 2, mt: 1, mb: 0.5 }}
          />
        </div>
      </ListItem>
    </div>
  );
};
