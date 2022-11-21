import React from 'react';
import Link, { LinkProps } from '@mui/material/Link';

const LinkComponent: React.FC<LinkProps> = (props) => (
  <Link sx={{ cursor: 'pointer', pb: '8px' }} underline="hover" color="text.primary" {...props}>
    {props.children}
  </Link>
);

export default LinkComponent;
