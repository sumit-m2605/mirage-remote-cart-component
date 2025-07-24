import React, { useState } from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  styled, 
  Box, 
  Typography,
  Chip
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import type { SelectProps } from '@mui/material';

// Novus Label component styled according to Figma
const NovusLabel = styled(Typography)({
  fontFamily: '"Inter", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: 'rgba(0, 0, 0, 0.65)',
});

// Novus Dropdown styled component based on Figma design - EXACTLY like NovusInput
const NovusDropdownField = styled(Select)<SelectProps>(() => ({
  '& .MuiOutlinedInput-root': {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box !important',
    border: '1px solid #E0E0E0 !important',
    borderRadius: '16px !important',
    padding: 0,
    '&:hover': {
      borderColor: '#CBD5E0 !important',
    },
    '&.Mui-focused': {
      borderColor: '#000093 !important',
    },
    '&.Mui-error': {
      borderColor: '#F50031 !important',
    },
  },
  '& .MuiSelect-select': {
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
  '& .MuiSelect-icon': {
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '24px',
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

export interface NovusDropdownProps extends Omit<SelectProps, 'variant' | 'label'> {
  label?: string;
  required?: boolean;
  variantType?: 'default' | 'error' | 'success';
  novusSize?: 's' | 'm' | 'l';
  showHelpIcon?: boolean;
  helperText?: string;
  placeholder?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    secondaryText?: string;
  }>;
  selectedIcon?: React.ReactNode;
}

const NovusDropdownComponent: React.FC<NovusDropdownProps> = ({
  label,
  required = false,
  variantType = 'default',
  novusSize = 'm',
  showHelpIcon = false,
  helperText,
  placeholder = 'Select an option',
  options,
  selectedIcon,
  error,
  disabled,
  value,
  onChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const isError = error || variantType === 'error';
  const isSuccess = variantType === 'success';

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

  // Map novusSize to exact Figma specifications - EXACTLY like NovusInput
  const getSizeStyles = () => {
    switch (novusSize) {
      case 's':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '8px 12px !important',
            borderRadius: '6px !important',
            height: '32px !important',
            minHeight: '32px !important',
            maxHeight: '32px !important',
            gap: '10px',
            boxSizing: 'border-box !important',
            lineHeight: '32px !important',
          },
          '& .MuiSelect-select': {
            fontSize: '14px',
            lineHeight: '1.4285714285714286em',
            padding: '0 !important',
            height: 'auto !important',
            minHeight: 'auto !important',
          },
        };
      case 'm':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '12px 12px !important',
            borderRadius: '8px !important',
            height: '40px !important',
            minHeight: '40px !important',
            maxHeight: '40px !important',
            gap: '10px',
            boxSizing: 'border-box !important',
            lineHeight: '40px !important',
          },
          '& .MuiSelect-select': {
            fontSize: '14px',
            lineHeight: '1.4285714285714286em',
            padding: '0 !important',
            height: 'auto !important',
            minHeight: 'auto !important',
          },
        };
      case 'l':
        return {
          '& .MuiOutlinedInput-root': {
            padding: '16px 12px !important',
            borderRadius: '12px !important',
            height: '48px !important',
            minHeight: '48px !important',
            maxHeight: '48px !important',
            gap: '10px',
            boxSizing: 'border-box !important',
            lineHeight: '48px !important',
          },
          '& .MuiSelect-select': {
            fontSize: '16px',
            lineHeight: '1.5em',
            padding: '0 !important',
            height: 'auto !important',
            minHeight: 'auto !important',
          },
        };
      default:
        return {};
    }
  };

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (onChange) {
      onChange(event, props.children);
    }
  };

  const selectedOption = options.find(option => option.value === value);

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

      <NovusDropdownField
        value={value || ''}
        onChange={handleChange}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        displayEmpty
        disabled={disabled}
        error={isError}
        IconComponent={ChevronDownIcon}
        sx={{
          width: '100%',
          minWidth: '376px',
          opacity: disabled ? 0.6 : 1,
          '& .MuiOutlinedInput-root': {
            border: 'none !important',
            borderRadius: '0 !important',
            height: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            minHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            ...(novusSize === 's' && {
              padding: '6px 8px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '32px !important',
            }),
            ...(novusSize === 'm' && {
              padding: '8px 12px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '40px !important',
            }),
            ...(novusSize === 'l' && {
              padding: '12px 12px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '48px !important',
            }),
          },
          '& .MuiSelect-select': {
            fontSize: novusSize === 'l' ? '16px' : '14px',
            lineHeight: novusSize === 'l' ? '1.5em' : '1.4285714285714286em',
            padding: '0 !important',
            height: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            minHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
          },
          '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
            padding: '0rem 1rem !important',
            borderRadius: novusSize === 's' ? '6px !important' : novusSize === 'm' ? '8px !important' : '12px !important',
            height: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            minHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 's' ? '32px !important' : novusSize === 'm' ? '40px !important' : '48px !important',
            border: '1px solid #E0E0E0 !important',
            '&:hover': {
              borderColor: '#CBD5E0 !important',
            },
            '&:focus': {
              borderColor: '#000093 !important',
            },
            ...(isError && {
              borderColor: '#F50031 !important',
              '&:hover': {
                borderColor: '#F50031 !important',
              },
              '&:focus': {
                borderColor: '#F50031 !important',
              },
            }),
            ...(isSuccess && {
              borderColor: '#25AB21 !important',
              '&:hover': {
                borderColor: '#25AB21 !important',
              },
              '&:focus': {
                borderColor: '#25AB21 !important',
              },
            }),
          },
          '&.Mui-focused .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
            borderColor: isOpen ? '#000093 !important' : '#E0E0E0 !important',
            ...(isError && {
              borderColor: isOpen ? '#F50031 !important' : '#F50031 !important',
            }),
            ...(isSuccess && {
              borderColor: isOpen ? '#25AB21 !important' : '#25AB21 !important',
            }),
          },
          '& .MuiFormHelperText-root': {
            color: getHelperTextColor(),
          },
          ...getSizeStyles(),
        }}
        MenuProps={{
          disableScrollLock: true,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            sx: {
              backgroundColor: '#FFFFFF',
              border: '1px solid #FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 4px 16px 0px #00000029',
              padding: '8px',
              maxHeight: '296px',
              height: '296px',
              width: 'fit-content',
              minWidth: '100%',
              overflow: 'auto',
              margin: '4px 0px',
              '& .MuiList-root': {
                paddingTop: '0 !important',
                paddingBottom: '0 !important',
                width: '100%',
              },
              '& .MuiMenuItem-root': {
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                lineHeight: '1.5em',
                fontWeight: 400,
                color: '#141414',
                padding: '8px 12px',
                borderRadius: '8px',
                margin: '2px 0',
                minHeight: 'auto',
                height: '56px',
                width: '100% !important',
                minWidth: '100% !important',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 147, 0.08)',
                  color: '#000093',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 147, 0.12)',
                  },
                },
                '&.Mui-disabled': {
                  color: 'rgba(0, 0, 0, 0.38)',
                },
              },
              // Scrollbar styling
                              '&::-webkit-scrollbar': {
                  width: '8px',
                },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(20, 20, 20, 0.15)',
                borderRadius: '250px',
                width: '8px',
                height: '280px',
                margin: '4px 2px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(20, 20, 20, 0.25)',
              },
            },
          },
        }}
        renderValue={(selected) => {
          const selectedOption = options.find(option => option.value === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              {selectedOption?.icon && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedOption.icon}
                </Box>
              )}
              <Typography sx={{ color: '#141414', fontSize: 'inherit' }}>
                {selectedOption?.label || placeholder}
              </Typography>
            </Box>
          );
        }}
        {...props}
      >
        {/* Options */}
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            sx={{
              width: '100% !important',
              minWidth: '100% !important',
              padding: '8px 12px !important',
              height: '56px !important',
              borderRadius: '8px !important',
              margin: '2px 0 !important',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', minWidth: '100%' }}>
              {option.icon && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {option.icon}
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
                <Typography sx={{ color: option.disabled ? '#A0AEC0' : '#141414' }}>
                  {option.label}
                </Typography>
                {option.secondaryText && (
                  <Typography sx={{ 
                    fontSize: '12px', 
                    lineHeight: '1.3333333333333333em',
                    color: 'rgba(0, 0, 0, 0.65)',
                    marginTop: '2px'
                  }}>
                    {option.secondaryText}
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </NovusDropdownField>

      {helperText && (
        <Typography 
          sx={{ 
            marginTop: '4px',
            fontSize: '12px',
            lineHeight: '16px',
            fontFamily: '"Inter", sans-serif',
            color: getHelperTextColor(),
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default NovusDropdownComponent; 