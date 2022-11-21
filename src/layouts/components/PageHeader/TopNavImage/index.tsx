import React from 'react';
import Box from '@mui/material/Box';
import { CSSObject } from '@mui/system';

interface ṬopNavImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  sx?: CSSObject;
}
const TopNavImage: React.FunctionComponent<ṬopNavImageProps> = ({ sx = {}, ...rest }) => (
  <Box sx={{ width: '24px', height: '24px', borderRadius: '3px', ...sx }} component="img" {...rest} />
);

export default TopNavImage;
