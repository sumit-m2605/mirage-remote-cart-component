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
    padding: '0px 12px',
    fontSize: '12px',
    height: '24px',
    lineHeight: '24px',
    spinnerSize: 16,
  },
  sm: {
    padding: '0px 16px',
    fontSize: '12px',
    height: '32px',
    lineHeight: '32px',
    spinnerSize: 18,
  },
  md: {
    padding: '0px 24px',
    fontSize: '14px',
    height: '40px',
    lineHeight: '40px',
    spinnerSize: 20,
  },
  lg: {
    padding: '0px 32px',
    fontSize: '16px',
    height: '48px',
    lineHeight: '48px',
    spinnerSize: 22,
  },
  xl: {
    padding: '0px 40px',
    fontSize: '24px',
    height: '64px',
    lineHeight: '64px',
    spinnerSize: 24,
  },
} as const;

type Appearance = keyof typeof colorMap;
type NovusSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
})<NovusButtonProps>(({ appearance = 'default', variantType = 'primary', novusSize = 'md', disabled, loading }) => {
  const color = colorMap[appearance] as string;
  const sizeStyles = sizeMap[novusSize as keyof typeof sizeMap];
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
    height: sizeStyles.height,
    lineHeight: sizeStyles.lineHeight,
    textTransform: 'none' as const,
    boxShadow: 'none',
    transition: 'background 0.2s, color 0.2s, border 0.2s',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      margin: 0,
    },
    // Prevent focus from persisting after click
    '&:focus:not(:focus-visible)': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: 'none',
    },
  };

  // Variant styles
  if (variantType === 'primary') {
    return {
      ...shared,
      background: '#3535F3',
      border: '1px solid #3535F3',
      color: '#ffffff',
      '&:hover': {
        background: '#000093',
        borderColor: '#000093',
        color: '#ffffff',
      },
      '&:active, &.Mui-active': {
        background: '#00004C !important',
        borderColor: '#00004C !important',
        color: '#9999FF !important',
      },
      '&:focus': {
        background: '#3535F3',
        borderColor: '#000093',
        color: '#00004C',
        outline: 'none',
      },
      '&.Mui-disabled': {
        background: '#3535F3',
        borderColor: '#3535F3',
        color: '#ffffff',
        opacity: disabledOpacity,
      },
    };
  }

  if (variantType === 'secondary') {
    return {
      ...shared,
      background: '#ffffff',
      border: '1px solid #E0E0E0',
      color: '#000093',
      '&:hover': {
        background: '#E8E8FC',
        borderColor: '#E0E0E0',
        color: '#000093',
      },
      '&:active, &.Mui-active': {
        backgroundColor: '#ADADFC !important',
        borderColor: '#E0E0E0 !important',
        color: '#00004C !important',
      },
      '&:focus': {
        background: '#ffffff',
        borderColor: '#000093',
        color: '#00004C',
        outline: 'none',
      },
      '&.Mui-disabled': {
        background: '#F5F5F5',
        borderColor: '#E0E0E0',
        color: '#A0A0A0',
        opacity: 1,
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
    '&:active, &.Mui-active': {
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
  if (novusSize === 'xs' || novusSize === 'sm') return 'small';
  if (novusSize === 'md') return 'medium';
  if (novusSize === 'lg' || novusSize === 'xl') return 'large';
  return 'medium';
};

const NovusButton: React.FC<NovusButtonProps> = ({
  appearance = 'default',
  variantType = 'primary',
  novusSize = 'md',
  loading = false,
  disabled,
  children,
  onClick,
  ...props
}) => {
  const sizeStyles = sizeMap[novusSize as keyof typeof sizeMap];
  const muiSize = mapNovusToMuiSize(novusSize);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick if provided
    if (onClick) {
      onClick(event);
    }
    
    // Remove focus after click using multiple methods
    const button = event.currentTarget;
    button.blur();
    
    // Force remove focus using document.activeElement
    if (document.activeElement === button) {
      (document.activeElement as HTMLElement).blur();
    }
    
    // Also try to focus on body to ensure button loses focus
    document.body.focus();
  };

  return (
    <StyledNovusButton
      appearance={appearance}
      variantType={variantType}
      novusSize={novusSize}
      size={muiSize}
      disabled={disabled || loading}
      disableRipple
      onClick={handleClick}
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
