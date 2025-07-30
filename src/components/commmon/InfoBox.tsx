import React from 'react';
import { Box, Typography } from '@mui/material';

// Color constants
const COLORS = {
  primary: '#141414',
  secondary: '#5A5A5A',
  background: {
    primary: '#FAFAFA'
  },
  border: '#E0E0E0'
} as const;

interface InfoBoxProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  flex?: string | { xs?: string; sm?: string; md?: string; lg?: string };
  bgcolor?: string;
  borderRadius?: number;
  boxShadow?: number;
  titleFontWeight?: number | string;
  titleMarginBottom?: number;
  descriptionFontSize?: string;
  descriptionColor?: string;
  listItems?: string[];
  listStyle?: 'bullet' | 'number' | 'none';
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  description,
  children,
  flex = { xs: "1 1 100%", md: "0 1 30%" },
  listItems = [],
  listStyle = 'bullet'
}) => {
  const renderList = () => {
    if (listItems.length === 0) return null;

    const listStyleType = listStyle === 'bullet' ? 'disc' : listStyle === 'number' ? 'decimal' : 'none';
    
    return (
      <Box component="ul" sx={{ 
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        margin: 0, 
        paddingLeft: listStyle === 'none' ? 0 : '17px',
        listStyleType,
        '& li': {
          fontSize: '12px',
          color: COLORS.secondary,
          lineHeight: '16px',
          marginBottom: '4px',
          '&:last-child': {
            marginBottom: 0
          }
        }
      }}>
        {listItems.map((item, index) => (
          <Box component="li" key={index}>
            {item}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box flex={flex}>
      <Box 
        sx={{
          display: 'flex',
          width: 'auto',
          padding: '16px 0',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          background: COLORS.background.primary
        }}
      >
        {/* Title Section */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 24px',
            width: '100%'
          }}
        >
          <Typography 
            sx={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: COLORS.primary,
              margin: 0
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Divider */}
        <Box 
          sx={{
            width: '100%',
            height: '0',
            borderTop: `1px solid ${COLORS.border}`
          }}
        />

        {/* Content Section */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '0 24px',
          }}
        >
          {/* Description */}
          {description && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography 
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: COLORS.secondary,
                  margin: 0
                }}
              >
                {description}
              </Typography>
            </Box>
          )}

          {/* List */}
          {listItems.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {renderList()}
            </Box>
          )}

          {/* Custom Children */}
          {children && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {children}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InfoBox; 