import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme, CustomTheme } from '@mui/material/styles';

import { InGameSigningPageContentProps, InGameSigningType } from '@gryfyn-types/props/InGameSigningProps';

const InGameSigningPageContent: React.FC<InGameSigningPageContentProps> = ({ type, message, typedData, txDetails }) => {
  const theme = useTheme() as CustomTheme;

  return (
    <>
      {type === InGameSigningType.MESSAGE && typeof message !== 'undefined' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Divider sx={{ width: '100%', my: 3, borderBottomWidth: 2 }} />
          <Typography variant="h3" sx={{ mb: 2 }} color={theme.palette.colors.secondaryText}>
            {`Message:`}
          </Typography>
          <Typography variant="h3" sx={{ display: 'contents', wordWrap: 'break-word' }}>
            {message}
          </Typography>
          <Divider sx={{ width: '100%', my: 3, borderBottomWidth: 2, color: theme.palette.colors.secondaryText }} />
        </Box>
      )}
      {type === InGameSigningType.TYPED_DATA && typeof typedData !== 'undefined' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Divider sx={{ width: '100%', my: 3, borderBottomWidth: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
            <Typography variant="h3" sx={{ flex: 1, fontWeight: 'bold' }} color={theme.palette.colors.secondaryText}>
              {`DOMAIN`}
            </Typography>
            <Typography
              variant="h3"
              color={theme.palette.colors.secondaryText}
              sx={{ flex: 2, textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {`${typedData.domain.name} version ${typedData.domain.version}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" sx={{ flex: 1, fontWeight: 'bold' }} color={theme.palette.colors.secondaryText}>
              {`CONTRACT`}
            </Typography>
            <Typography
              variant="h3"
              color={theme.palette.colors.secondaryText}
              sx={{ flex: 2, textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {typedData.domain.verifyingContract}
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }} color={theme.palette.colors.secondaryText}>
            {`MESSAGE`}
          </Typography>
          <Box sx={{ border: 1, p: 2 }}>
            {Object.entries({ ...typedData.message }).map(([key, value], messageIndex) => (
              <Box
                key={`typed-data-${messageIndex}`}
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h3" color={theme.palette.colors.secondaryText} sx={{ flex: 1 }}>
                  {key}
                </Typography>
                <Typography
                  variant="h3"
                  color={theme.palette.colors.secondaryText}
                  sx={{ flex: 2, wordBreak: 'break-word', textAlign: 'right' }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ width: '100%', my: 3, borderBottomWidth: 2, color: theme.palette.colors.secondaryText }} />
        </Box>
      )}
      {type === InGameSigningType.TRANSACTION && typeof txDetails !== 'undefined' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h3"
            sx={{ flex: 1, fontWeight: 'bold', my: 3 }}
            color={theme.palette.colors.secondaryText}
          >
            {`Transaction Details`}
          </Typography>
          <Box sx={{ border: 1, p: 2 }}>
            {Object.entries({ ...txDetails }).map(([key, value], txDetailsIndex) => (
              <Box
                key={`tx-details-${txDetailsIndex}`}
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h3" color={theme.palette.colors.secondaryText} sx={{ flex: 1 }}>
                  {key}
                </Typography>
                <Typography
                  variant="h3"
                  color={theme.palette.colors.secondaryText}
                  sx={{ flex: 2, wordBreak: 'break-word', textAlign: 'right' }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default InGameSigningPageContent;
