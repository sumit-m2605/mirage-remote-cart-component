import React from 'react';
import { 
  Select, 
  MenuItem, 
  styled, 
  Box, 
  Typography} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import type { SelectProps } from '@mui/material';

// Color variables
const COLORS = {
  // Border colors
  BORDER_DEFAULT: "#E0E0E0",
  BORDER_HOVER: "#CBD5E0",
  BORDER_FOCUSED: "#000093",
  BORDER_ERROR: "#F50031",
  BORDER_SUCCESS: "#25AB21",
  
  // Text colors
  TEXT_PRIMARY: "#141414",
  TEXT_SECONDARY: "#000000A6",
  TEXT_DISABLED: "#A0AEC0",
  TEXT_LABEL: "#A6A6A6",
  TEXT_ICON: "#A6A6A6",
  TEXT_PLACEHOLDER: "#A6A6A6",
  
  // Background colors
  BACKGROUND_WHITE: "#FFFFFF",
  BACKGROUND_HOVER: "#F5F5F5",
  BACKGROUND_SELECTED: "#F0F0FF",
  BACKGROUND_SELECTED_HOVER: "#E8E8FC",
  
  // Helper text colors
  HELPER_DEFAULT: "#000000A6",
  HELPER_ERROR: "#660014",
  HELPER_SUCCESS: "#135610",
  
  // Required indicator
  REQUIRED: "#F50031",
  
  // Scrollbar colors
  SCROLLBAR_TRACK: "transparent",
  SCROLLBAR_THUMB: "#D4D4D4",
  SCROLLBAR_THUMB_HOVER: "#B8B8B8",
  
  // Shadow
  SHADOW: "#00000029",
} as const;

// Novus Label component styled according to Figma
const NovusLabel = styled(Typography)({
  fontFamily: '"Inter", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  color: COLORS.TEXT_LABEL,
});

// Novus Dropdown styled component based on Figma design - EXACTLY like NovusInput
const NovusDropdownField = styled(Select)<SelectProps>(() => ({
  '& .MuiOutlinedInput-root': {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box !important',
    border: `1px solid ${COLORS.BORDER_DEFAULT} !important`,
    borderRadius: '16px !important',
    padding: 0,
    '&:hover': {
      borderColor: `${COLORS.BORDER_HOVER} !important`,
    },
    '&.Mui-focused': {
      borderColor: `${COLORS.BORDER_FOCUSED} !important`,
    },
    '&.Mui-error': {
      borderColor: `${COLORS.BORDER_ERROR} !important`,
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
    color: COLORS.TEXT_ICON,
    fontSize: '24px',
  },
  '& .MuiFormHelperText-root': {
    marginTop: 4,
    fontSize: 12,
    lineHeight: '16px',
    fontFamily: '"Inter", sans-serif',
    color: COLORS.HELPER_DEFAULT,
    '&.Mui-error': {
      color: COLORS.HELPER_ERROR,
    },
  },
}));

export interface NovusDropdownProps extends Omit<SelectProps, 'variant' | 'label'> {
  label?: string;
  required?: boolean;
  variantType?: 'default' | 'error' | 'success';
  novusSize?: 'sm' | 'md' | 'lg';
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
  novusSize = 'md',
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
    if (isError) return COLORS.HELPER_ERROR;
    if (isSuccess) return COLORS.HELPER_SUCCESS;
    return COLORS.HELPER_DEFAULT;
  };

  // Get border color based on variant
  const getBorderColor = () => {
    if (isError) return COLORS.BORDER_ERROR;
    if (isSuccess) return COLORS.BORDER_SUCCESS;
    return COLORS.BORDER_DEFAULT;
  };

  // Map novusSize to exact Figma specifications - EXACTLY like NovusInput
  const getSizeStyles = () => {
    switch (novusSize) {
      case 'sm':
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
      case 'md':
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
      case 'lg':
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
        minWidth: 0,
      }}
    >
      {label && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '4px' }}>
          <NovusLabel>{label}</NovusLabel>
          {required && <NovusLabel sx={{ color: COLORS.REQUIRED }}>*</NovusLabel>}
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
              <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_LABEL }}>?</Typography>
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
          minWidth: 0,
          opacity: disabled ? 0.6 : 1,
          '& .MuiOutlinedInput-root': {
            border: 'none !important',
            borderRadius: '0 !important',
            height: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            minHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            ...(novusSize === 'sm' && {
              padding: '6px 8px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '32px !important',
            }),
            ...(novusSize === 'md' && {
              padding: '8px 12px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '40px !important',
            }),
            ...(novusSize === 'lg' && {
              padding: '12px 12px !important',
              gap: '10px',
              boxSizing: 'border-box !important',
              lineHeight: '48px !important',
            }),
          },
          '& .MuiSelect-select': {
            fontSize: novusSize === 'lg' ? '16px' : '14px',
            lineHeight: novusSize === 'lg' ? '1.5em' : '1.4285714285714286em',
            padding: '0 !important',
            height: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            minHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
          },
          '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
            padding: '0rem 1rem !important',
            borderRadius: novusSize === 'sm' ? '6px !important' : novusSize === 'md' ? '8px !important' : '12px !important',
            height: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            minHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            maxHeight: novusSize === 'sm' ? '32px !important' : novusSize === 'md' ? '40px !important' : '48px !important',
            border: `1px solid ${COLORS.BORDER_DEFAULT} !important`,
            '&:hover': {
              borderColor: `${COLORS.BORDER_HOVER} !important`,
            },
            '&:focus': {
              borderColor: `${COLORS.BORDER_FOCUSED} !important`,
            },
            ...(isError && {
              borderColor: `${COLORS.BORDER_ERROR} !important`,
              '&:hover': {
                borderColor: `${COLORS.BORDER_ERROR} !important`,
              },
              '&:focus': {
                borderColor: `${COLORS.BORDER_ERROR} !important`,
              },
            }),
            ...(isSuccess && {
              borderColor: `${COLORS.BORDER_SUCCESS} !important`,
              '&:hover': {
                borderColor: `${COLORS.BORDER_SUCCESS} !important`,
              },
              '&:focus': {
                borderColor: `${COLORS.BORDER_SUCCESS} !important`,
              },
            }),
          },
          '&.Mui-focused .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
            borderColor: isOpen ? `${COLORS.BORDER_FOCUSED} !important` : `${COLORS.BORDER_DEFAULT} !important`,
            ...(isError && {
              borderColor: isOpen ? `${COLORS.BORDER_ERROR} !important` : `${COLORS.BORDER_ERROR} !important`,
            }),
            ...(isSuccess && {
              borderColor: isOpen ? `${COLORS.BORDER_SUCCESS} !important` : `${COLORS.BORDER_SUCCESS} !important`,
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
              backgroundColor: COLORS.BACKGROUND_WHITE,
              border: `1px solid ${COLORS.BACKGROUND_WHITE}`,
              borderRadius: novusSize === 'sm' ? '6px' : novusSize === 'md' ? '8px' : '12px',
              boxShadow: `0px 4px 16px 0px ${COLORS.SHADOW}`,
              padding: '4px',
              maxHeight: '250px',
              height: 'fit-content',
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
                fontFamily: '"Inter", sans-serif !important',
                fontSize: '12px !important',
                lineHeight: '1.5em !important',
                fontWeight: 400,
                color: COLORS.TEXT_PRIMARY,
                borderRadius: '8px',
                minHeight: '28px !important',
                width: '100% !important',
                minWidth: '100% !important',
                '& .MuiTypography-root': {
                  fontSize: '14px !important',
                  lineHeight: '1.5em !important',
                },
                '&:hover': {
                  backgroundColor: COLORS.BACKGROUND_HOVER,
                },
                '&.Mui-selected': {
                  backgroundColor: COLORS.BACKGROUND_SELECTED,
                  color: COLORS.BORDER_FOCUSED,
                  '&:hover': {
                    backgroundColor: COLORS.BACKGROUND_SELECTED_HOVER,
                  },
                },
                '&.Mui-disabled': {
                  color: COLORS.TEXT_DISABLED,
                },
              },
              // Scrollbar styling
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: COLORS.SCROLLBAR_TRACK,
              },
              '&::-webkit-scrollbar-thumb': {
                background: COLORS.SCROLLBAR_THUMB,
                borderRadius: '250px',
                width: '4px',
                height: '280px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: COLORS.SCROLLBAR_THUMB_HOVER,
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
              <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: 'inherit' }}>
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
                <Typography sx={{ 
                  color: option.disabled ? COLORS.TEXT_DISABLED : COLORS.TEXT_PRIMARY,
                  fontSize: '12px !important',
                }}>
                  {option.label}
                </Typography>
                {option.secondaryText && (
                  <Typography sx={{ 
                    fontSize: '12px', 
                    lineHeight: '1.3333333333333333em',
                    color: COLORS.TEXT_SECONDARY,
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