import React from 'react';
import { Box, Typography } from '@mui/material';

interface InfoBoxProps {
  title: string;
  description: string;
  flex?: string | { xs?: string; sm?: string; md?: string; lg?: string };
  bgcolor?: string;
  borderRadius?: number;
  boxShadow?: number;
  titleFontWeight?: number | string;
  titleMarginBottom?: number;
  descriptionFontSize?: string;
  descriptionColor?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  description,
  flex = { xs: "1 1 100%", md: "0 1 30%" },
  bgcolor = "#f9f9f9",
  borderRadius = 2,
  boxShadow = 1,
  titleFontWeight = 600,
  titleMarginBottom = 1,
  descriptionFontSize = "0.875rem",
  descriptionColor = "text.secondary"
}) => {
  return (
    <Box flex={flex}>
      <Box 
        p={2} 
        bgcolor={bgcolor} 
        borderRadius={borderRadius} 
        boxShadow={boxShadow}
      >
        <Typography 
          fontWeight={titleFontWeight} 
          mb={titleMarginBottom}
        >
          {title}
        </Typography>
        <Typography 
          fontSize={descriptionFontSize} 
          color={descriptionColor}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoBox; 