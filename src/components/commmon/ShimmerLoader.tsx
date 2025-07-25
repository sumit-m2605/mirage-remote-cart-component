import React from 'react';
import { Box } from '@mui/material';

interface ShimmerLoaderProps {
  width?: string | number;
  height?: string | number;
  margin?: string | number;
}

const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({ 
  width = '100%', 
  height = '100%', 
  margin = '10px auto' 
}) => {
  return (
    <Box
      sx={{
        width,
        height,
        margin,
        '& .wrapper': {
          width: '0px',
          animation: 'fullView 0.5s forwards linear',
        },
        '& .animate': {
          animation: 'shimmer 3s infinite',
          background: 'linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%)',
          backgroundSize: '1000px 100%',
          height: '100%',
        },
        '@keyframes fullView': {
          '100%': {
            width: '100%',
          },
        },
        '@keyframes shimmer': {
          from: {
            backgroundPosition: '-1000px 0',
          },
          to: {
            backgroundPosition: '1000px 0',
          },
        },
      }}
    >
      <Box className="wrapper">
        <Box className="animate" />
      </Box>
    </Box>
  );
};

export default ShimmerLoader; 