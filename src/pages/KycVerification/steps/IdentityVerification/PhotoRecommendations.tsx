import React, { FC } from 'react';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

const recommendations = [
  'Bright and clear, easy to read',
  'All corners of the document should be visible',
  'Document should occupy the majority of the picture',
];

export const PhotoRecommendations: FC = () => {
  return (
    <Stack>
      <Typography variant="h4" color="text.secondary">
        Take a photo of your document. The photo should be:
      </Typography>
      <List sx={{ pl: 2 }}>
        {recommendations.map((recc) => (
          <ListItem
            key={recc}
            sx={{
              py: 0.5,
              px: 1,
              display: 'list-item',
              listStyle: 'outside circle',
              fontSize: 10,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              {recc}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};
