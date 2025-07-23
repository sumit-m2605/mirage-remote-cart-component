import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';

// Figma spec: Appearances (colors)
const colorMap = {
  default: '#3535F3',
  contrast: '#2C4BFF',
  positive: '#25AB21',
  negative: '#F50031',
  warning: '#F06D0F',
  ai: 'linear-gradient(90deg, #1ECCB0 0%, #3535F3 100%)',
};

// Figma spec: Sizes
const sizeMap = {
  xs: {
    padding: '4px 12px',
    fontSize: '12px',
    minHeight: '24px',
    spinnerSize: 16,
  },
  s: {
    padding: '4px 16px',
    fontSize: '12px',
    minHeight: '32px',
    spinnerSize: 18,
  },
  m: {
    padding: '8px 24px',
    fontSize: '14px',
    minHeight: '40px',
    spinnerSize: 20,
  },
  l: {
    padding: '12px 32px',
    fontSize: '16px',
    minHeight: '48px',
    spinnerSize: 22,
  },
  xl: {
    padding: '16px 40px',
    fontSize: '24px',
    minHeight: '64px',
    spinnerSize: 24,
  },
} as const;

type Appearance = keyof typeof colorMap;
type NovusSize = keyof typeof sizeMap;
type VariantType = 'primary' | 'secondary' | 'tertiary';

type StateType = 'normal' | 'hover' | 'pressed' | 'focused' | 'disabled' | 'loading';

interface NovusButtonProps extends Omit<ButtonProps, 'size'> {
  appearance?: Appearance;
  variantType?: VariantType;
  novusSize?: NovusSize;
  loading?: boolean;
}

const getGradient = (appearance: Appearance) => {
  if (appearance === 'ai') {
    return colorMap.ai;
  }
  return undefined;
};

const StyledNovusButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'variantType' && prop !== 'appearance' && prop !== 'novusSize' && prop !== 'loading',
})<NovusButtonProps>(({ appearance = 'default', variantType = 'primary', novusSize = 'm', disabled, loading }) => {
  const color = colorMap[appearance] as string;
  const sizeStyles = sizeMap[novusSize];
  const isGradient = appearance === 'ai';
  const borderRadius = '250px';
  const fontFamily = 'Inter, sans-serif';
  const fontWeight = 500;

  // State colors
  const hoverBg = appearance === 'default' ? '#2C4BFF' : color;
  const pressedBg = appearance === 'default' ? '#000093' : color;
  const disabledOpacity = 0.3;

  // Shared styles
  const shared = {
    borderRadius,
    fontFamily,
    fontWeight,
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    minHeight: sizeStyles.minHeight,
    textTransform: 'none' as const,
    boxShadow: 'none',
    transition: 'background 0.2s, color 0.2s, border 0.2s',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      margin: 0,
    },
  };

  // Variant styles
  if (variantType === 'primary') {
    return {
      ...shared,
      background: isGradient ? getGradient(appearance) : color,
      color: '#fff',
      '&:hover': {
        background: isGradient ? getGradient(appearance) : hoverBg,
        opacity: 0.9,
      },
      '&:active': {
        background: isGradient ? getGradient(appearance) : pressedBg,
        opacity: 0.8,
      },
      '&.Mui-disabled': {
        background: isGradient ? getGradient(appearance) : color,
        color: '#fff',
        opacity: disabledOpacity,
      },
    };
  }

  if (variantType === 'secondary') {
    return {
      ...shared,
      background: '#fff',
      border: `1px solid ${color}`,
      color: color,
      '&:hover': {
        background: '#f7f9ff',
        borderColor: color,
      },
      '&:active': {
        background: '#f0f0f0',
        borderColor: color,
      },
      '&.Mui-disabled': {
        background: '#fff',
        borderColor: color,
        color: color,
        opacity: disabledOpacity,
      },
    };
  }

  // Tertiary
  return {
    ...shared,
    background: 'transparent',
    color: color,
    '&:hover': {
      background: '#f5f5f5',
    },
    '&:active': {
      background: '#ededed',
    },
    '&.Mui-disabled': {
      color: color,
      opacity: disabledOpacity,
    },
  };
});

// Map Novus size to MUI Button size for accessibility (affects padding, icon size, etc.)
const mapNovusToMuiSize = (novusSize: NovusSize): ButtonProps['size'] => {
  if (novusSize === 'xs' || novusSize === 's') return 'small';
  if (novusSize === 'm') return 'medium';
  if (novusSize === 'l' || novusSize === 'xl') return 'large';
  return 'medium';
};

const NovusButton: React.FC<NovusButtonProps> = ({
  appearance = 'default',
  variantType = 'primary',
  novusSize = 'm',
  loading = false,
  disabled,
  children,
  ...props
}) => {
  const sizeStyles = sizeMap[novusSize];
  const muiSize = mapNovusToMuiSize(novusSize);
  return (
    <StyledNovusButton
      appearance={appearance}
      variantType={variantType}
      novusSize={novusSize}
      size={muiSize}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <CircularProgress size={sizeStyles.spinnerSize} color="inherit" thickness={5} />
      ) : (
        children
      )}
    </StyledNovusButton>
  );
};

export default NovusButton;
