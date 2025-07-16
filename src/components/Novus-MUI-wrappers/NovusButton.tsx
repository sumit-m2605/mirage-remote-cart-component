import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';

type VariantType = 'primary' | 'secondary' | 'tertiary';

const colorMap = {
  default: '#3535f3',
  contrast: '#2C4BFF',
  positive: '#00B140',
  error: '#FF3B3B',
  warning: '#FF7F00',
};

interface NovusButtonProps extends ButtonProps {
  novusColor?: keyof typeof colorMap;
  variantType?: VariantType;
}

const StyledNovusButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'variantType' && prop !== 'novusColor',
})<NovusButtonProps>(({ variantType = 'primary', novusColor = 'default' }) => {
  const baseColor = colorMap[novusColor];

  const shared = {
    borderRadius: 999,
    fontWeight: 600,
    padding: '10px 24px',
    fontSize: '14px',
    boxShadow: 'none',
    textTransform: 'none' as const,
    '&:hover': {
      boxShadow: 'none',
      opacity: 0.9,
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  if (variantType === 'primary') {
    return {
      ...shared,
      backgroundColor: baseColor,
      color: '#fff',
      '&:hover': {
        backgroundColor: baseColor,
        opacity: 0.9,
      },
      '&.Mui-disabled': {
        backgroundColor: baseColor,
        color: '#fff',
      },
    };
  }

  if (variantType === 'secondary') {
    return {
      ...shared,
      backgroundColor: '#fff',
      border: `1px solid ${baseColor}`,
      color: baseColor,
      '&:hover': {
        backgroundColor: '#f7f9ff',
      },
      '&.Mui-disabled': {
        backgroundColor: '#fff',
        borderColor: baseColor,
        color: baseColor,
      },
    };
  }

  // Tertiary
  return {
    ...shared,
    backgroundColor: 'transparent',
    color: baseColor,
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&.Mui-disabled': {
      color: baseColor,
    },
  };
});

const NovusButton: React.FC<NovusButtonProps> = (props) => {
  return <StyledNovusButton {...props} />;
};

export default NovusButton;
