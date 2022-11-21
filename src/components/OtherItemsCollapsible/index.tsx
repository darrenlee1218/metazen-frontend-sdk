import React, { FC, ReactNode } from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';

interface OtherItemsCollapsibleProps {
  label: string;
  numItems: number;
  isOpen: boolean;
  children: ReactNode;
  onClick: () => void;
}

export const OtherItemsCollapsible: FC<OtherItemsCollapsibleProps> = ({
  label,
  numItems,
  isOpen,
  children,
  onClick: toggle,
}) => {
  const theme = useTheme();

  if (numItems === 0) return null;

  return (
    <div>
      <Button
        disableRipple
        variant="text"
        onClick={toggle}
        sx={{
          p: 0,
          alignItems: 'flex-start',
          ':hover': {
            backgroundColor: 'initial',
          },
          '.MuiButton-endIcon svg': {
            fontSize: 14,
            transform: `rotate(${!isOpen ? 0 : 180}deg)`,
            transition: theme.transitions.create('transform'),
            color: theme.palette.text.secondary,
          },
        }}
        endIcon={<ArrowDownIcon width="12px" height="12px" stroke="currentColor" />}
      >
        <Typography color="text.secondary" variant="h5" sx={{ textTransform: 'none', fontWeight: 300 }}>
          {label}
        </Typography>
      </Button>

      <Divider />

      <Collapse data-testid="collapse" in={isOpen}>
        {children}
      </Collapse>
    </div>
  );
};
