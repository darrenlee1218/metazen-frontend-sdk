import React, { FC, PropsWithoutRef, useEffect, useRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

interface FallbackImageProps extends PropsWithoutRef<BoxProps<'img'>> {
  fallbackSrc: string;
}

export const FallbackImage: FC<FallbackImageProps> = ({ fallbackSrc, ...props }) => {
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (imageRef.current) {
      const imageEl = imageRef.current;

      function handleError(): void {
        imageEl.src = fallbackSrc;
        imageEl.alt = 'fallback';
      }

      imageEl.addEventListener('error', handleError);
      return () => {
        imageEl.removeEventListener('error', handleError);
      };
    }
  }, [fallbackSrc]);

  return <Box component="img" {...props} ref={imageRef} />;
};
