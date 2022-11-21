import React from 'react';
import Box from '@mui/material/Box';

import TitleWithIconOnTopProps from '@gryfyn-types/props/TitleWithIconOnTopProps';

const TitleWithIconOnTop = ({ imageLayout, titleLayout }: TitleWithIconOnTopProps): React.ReactElement => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {imageLayout}
      {titleLayout}
    </Box>
  );
};

export default TitleWithIconOnTop;
