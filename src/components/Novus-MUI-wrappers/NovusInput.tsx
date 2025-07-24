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
  novusSize?: 's' | 'm' | 'l';
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
  s: {
    height: 32,
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: 14,
  },
  m: {
    height: 40,
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: 14,
  },
  l: {
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
  novusSize = 'm',
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
  const size = sizeStyleMap[novusSize || 'm'];

  // Get helper text color based on variant
  const getHelperTextColor = () => {
    if (isError) return '#660014';
    if (isSuccess) return '#135610';
    return '#000000A6';
  };

  // Determine wrapper width behavior
  const shouldUnsetMinWidth =
    props.fullWidth || (props.sx && typeof props.sx === 'object' && 'width' in props.sx);

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: '376px',
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
          minWidth: '376px',
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
