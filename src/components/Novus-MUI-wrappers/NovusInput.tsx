import React from 'react';
import { TextField, styled, Box, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

const NovusLabel = styled(Typography)({
  fontFamily: '"Inter", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: 'rgba(0, 0, 0, 0.65)',
});

export interface NovusInputProps extends Omit<TextFieldProps, 'variant' | 'label'> {
  label?: string;
  required?: boolean;
  variantType?: 'default' | 'error' | 'success';
  novusSize?: 'sm' | 'md' | 'lg';
  showHelpIcon?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

const NovusInputField = styled(TextField)<TextFieldProps>(() => ({
  '& .MuiOutlinedInput-root': {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box !important',
    border: '1px solid #E0E0E0',
    borderRadius: '16px !important',
    padding: 0,
    '&:hover': {
      borderColor: '#CBD5E0',
    },
    '&.Mui-focused': {
      borderColor: '#000093',
    },
    '&.Mui-error': {
      borderColor: '#F50031',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Inter", sans-serif',
    padding: '0 !important',
    margin: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    height: '100% !important',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  // Textarea specific styling - only applied when multiline is true
  '& .MuiInputBase-inputMultiline': {
    resize: 'vertical',
    minHeight: '80px',
    padding: '12px !important',
    alignItems: 'flex-start',
    overflow: 'auto',
    '&::-webkit-resizer': {
      borderWidth: '8px',
      borderStyle: 'solid',
      borderColor: 'transparent #E0E0E0 #E0E0E0 transparent',
      backgroundColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
    borderRadius: '16px !important',
  },
  '& .MuiInputLabel-root': {
    display: 'none !important',
  },
  '& .MuiFormHelperText-root': {
    marginTop: 4,
    fontSize: 12,
    lineHeight: '16px',
    fontFamily: '"Inter", sans-serif',
    color: '#000000A6', // Default color
    '&.Mui-error': {
      color: '#660014', // Error color
    },
  },
}));

const sizeStyleMap: Record<string, any> = {
  sm: {
    height: 32,
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: 14,
  },
  md: {
    height: 40,
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: 14,
  },
  lg: {
    height: 48,
    padding: '12px 12px',
    borderRadius: '12px',
    fontSize: 16,
  },
};

const NovusInputComponent: React.FC<NovusInputProps> = ({
  label,
  required = false,
  variantType = 'default',
  novusSize = 'md',
  showHelpIcon = false,
  showCharacterCount = false,
  maxLength,
  error,
  disabled,
  helperText,
  value,
  ...props
}) => {
  const isError = variantType === 'error' || error;
  const isSuccess = variantType === 'success';
  const currentLength = typeof value === 'string' ? value.length : 0;
  const size = sizeStyleMap[novusSize || 'md'];

  // Get helper text color based on variant
  const getHelperTextColor = () => {
    if (isError) return '#660014';
    if (isSuccess) return '#135610';
    return '#000000A6';
  };

  // Get border color based on variant
  const getBorderColor = () => {
    if (isError) return '#F50031';
    if (isSuccess) return '#25AB21';
    return '#E0E0E0';
  };

  // Determine wrapper width behavior
  const shouldUnsetMinWidth =
    props.fullWidth || (props.sx && typeof props.sx === 'object' && 'width' in props.sx);

  // Map novusSize to exact Figma specifications
  const getSizeStyles = () => {
    switch (novusSize) {
      case 'sm':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '8px 12px', // Spacing + Padding/4 (4+4=8) top/bottom, Spacing + Padding/8 (4+8=12) left/right
            borderRadius: '6px', // BorderRadius/Core/6
            height: '32px',
            minHeight: '32px',
            maxHeight: '32px',
            gap: '10px',
            boxSizing: 'border-box',
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '14px',
            lineHeight: '1.4285714285714286em',
            padding: '0',
          },
          '& .MuiInputBase-inputMultiline': {
            minHeight: '60px',
            padding: '8px 12px !important',
          },
        };
      case 'md':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '12px 12px', // Spacing + Padding/8 (4+8=12) top/bottom, Padding/12 left/right
            borderRadius: '8px', // BorderRadius/Component/Input field S
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            gap: '10px',
            boxSizing: 'border-box',
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '14px',
            lineHeight: '1.4285714285714286em',
            padding: '0',
          },
          '& .MuiInputBase-inputMultiline': {
            minHeight: '80px',
            padding: '12px 12px !important',
          },
        };
      case 'lg':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '16px 12px', // Spacing + Padding/12 (4+12=16) top/bottom, Padding/12 left/right
            borderRadius: '12px', // BorderRadius/Component/Input field L
            height: '48px',
            minHeight: '48px',
            maxHeight: '48px',
            gap: '10px',
            boxSizing: 'border-box',
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '16px',
            lineHeight: '1.5em',
            padding: '0',
          },
          '& .MuiInputBase-inputMultiline': {
            minHeight: '100px',
            padding: '16px 12px !important',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
      }}
    >
      {label && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '4px' }}>
          <NovusLabel>{label}</NovusLabel>
          {required && <NovusLabel sx={{ color: '#F50031' }}>*</NovusLabel>}
          {showHelpIcon && (
            <Box
              sx={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.65)' }}>?</Typography>
            </Box>
          )}
        </Box>
      )}

      <NovusInputField
        variant="outlined"
        error={isError}
        disabled={disabled}
        helperText={helperText}
        value={value}
        inputProps={{
          maxLength: maxLength,
        }}
        sx={{
          width: '100%',
          minWidth: 0,
          opacity: disabled ? 0.6 : 1,
          '& .MuiOutlinedInput-root': {
            height: `${size.height}px !important`,
            padding: `${size.padding} !important`,
            borderRadius: `${size.borderRadius} !important`,
            fontSize: `${size.fontSize}px !important`,
          },
          '& .MuiInputBase-input': {
            fontSize: `${size.fontSize}px !important`,
            lineHeight: '1 !important',
          },
          '& .MuiFormHelperText-root': {
            color: getHelperTextColor(),
          },
          // Only apply these overrides for multiline inputs
          ...(props.multiline && {
            '& .MuiOutlinedInput-root': {
              height: 'auto !important',
              minHeight: '80px !important',
              maxHeight: 'none !important',
            },
          }),
        }}
        {...props}
      />

      {showCharacterCount && maxLength && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 0.5,
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.65)',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {currentLength}/{maxLength}
        </Box>
      )}
    </Box>
  );
};

export default NovusInputComponent;
