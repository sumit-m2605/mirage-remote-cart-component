import React from "react";
import { TextField, styled, Box, Typography, InputAdornment } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

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
  BACKGROUND_TRANSPARENT: "#FFFFFF",
  
  // Helper text colors
  HELPER_DEFAULT: "#000000A6",
  HELPER_ERROR: "#660014",
  HELPER_SUCCESS: "#135610",
  
  // Required indicator
  REQUIRED: "#A6A6A6",
} as const;

const NovusLabel = styled(Typography)({
  fontFamily: '"Inter", sans-serif',
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "20px",
  color: COLORS.TEXT_LABEL,
});

export interface NovusInputProps
  extends Omit<TextFieldProps, "variant" | "label"> {
  label?: string;
  required?: boolean;
  variantType?: "default" | "error" | "success";
  novusSize?: "sm" | "md" | "lg";
  showHelpIcon?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const NovusInputField = styled(TextField)<TextFieldProps>(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: COLORS.BACKGROUND_WHITE,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box !important",
    border: `1px solid ${COLORS.BORDER_DEFAULT}`,
    borderRadius: "8px !important",
    padding: 0,
    "&:hover": {
      borderColor: COLORS.BORDER_HOVER,
    },
    "&.Mui-focused": {
      borderColor: COLORS.BORDER_FOCUSED,
    },
    "&.Mui-error": {
      borderColor: COLORS.BORDER_ERROR,
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: '"Inter", sans-serif',
    padding: "0 !important",
    margin: 0,
    border: "none",
    outline: "none",
    background: COLORS.BACKGROUND_TRANSPARENT,
    height: "100% !important",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  // Textarea specific styling - only applied when multiline is true
  "& .MuiInputBase-inputMultiline": {
    resize: "vertical",
    minHeight: "80px",
    padding: "12px !important",
    alignItems: "flex-start",
    overflow: "auto",
    borderRadius: "8px !important",
    "&::-webkit-resizer": {
      borderWidth: "8px",
      borderStyle: "solid",
      borderColor: `transparent ${COLORS.BORDER_DEFAULT} ${COLORS.BORDER_DEFAULT} transparent`,
      backgroundColor: COLORS.BACKGROUND_TRANSPARENT,
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none !important",
    borderRadius: "16px !important",
  },
  "& .MuiInputLabel-root": {
    display: "none !important",
  },
  "& .MuiFormHelperText-root": {
    marginTop: 4,
    fontSize: 12,
    lineHeight: "16px",
    fontFamily: '"Inter", sans-serif',
    color: COLORS.HELPER_DEFAULT,
    "&.Mui-error": {
      color: COLORS.HELPER_ERROR,
    },
  },
}));

const sizeStyleMap: Record<string, any> = {
  sm: {
    height: 32,
    padding: "6px 8px",
    borderRadius: "6px",
    fontSize: 14,
  },
  md: {
    height: 40,
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: 14,
  },
  lg: {
    height: 48,
    padding: "12px 12px",
    borderRadius: "12px",
    fontSize: 16,
  },
};

const NovusInputComponent: React.FC<NovusInputProps> = ({
  label,
  required = false,
  variantType = "default",
  novusSize = "md",
  showHelpIcon = false,
  showCharacterCount = false,
  maxLength,
  startIcon,
  endIcon,
  error,
  disabled,
  helperText,
  value,
  ...props
}) => {
  const isError = variantType === "error" || error;
  const isSuccess = variantType === "success";
  const currentLength = typeof value === "string" ? value.length : 0;
  const size = sizeStyleMap[novusSize || "md"];

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

  // Determine wrapper width behavior
  const shouldUnsetMinWidth =
    props.fullWidth ||
    (props.sx && typeof props.sx === "object" && "width" in props.sx);

  // Map novusSize to exact Figma specifications
  const getSizeStyles = () => {
    switch (novusSize) {
      case "sm":
        return {
          "& .MuiOutlinedInput-root": {
            padding: "8px 12px",
            borderRadius: "6px",
            height: "32px",
            minHeight: "32px",
            maxHeight: "32px",
            gap: "10px",
            boxSizing: "border-box",
          },
          "& .MuiOutlinedInput-input": {
            fontSize: "14px",
            lineHeight: "1.4285714285714286em",
            padding: "0",
          },
          "& .MuiInputBase-inputMultiline": {
            minHeight: "60px",
            padding: "8px 12px !important",
          },
        };
      case "md":
        return {
          "& .MuiOutlinedInput-root": {
            padding: "12px 12px",
            borderRadius: "8px",
            height: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            gap: "10px",
            boxSizing: "border-box",
          },
          "& .MuiOutlinedInput-input": {
            fontSize: "14px",
            lineHeight: "1.4285714285714286em",
            padding: "0",
          },
          "& .MuiInputBase-inputMultiline": {
            minHeight: "80px",
            padding: "12px 12px !important",
          },
        };
      case "lg":
        return {
          "& .MuiOutlinedInput-root": {
            padding: "16px 12px",
            borderRadius: "12px",
            height: "48px",
            minHeight: "48px",
            maxHeight: "48px",
            gap: "10px",
            boxSizing: "border-box",
          },
          "& .MuiOutlinedInput-input": {
            fontSize: "16px",
            lineHeight: "1.5em",
            padding: "0",
          },
          "& .MuiInputBase-inputMultiline": {
            minHeight: "100px",
            padding: "16px 12px !important",
          },
        };
      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {(label || (showCharacterCount && maxLength)) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "4px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {label && <NovusLabel>{label}</NovusLabel>}
            {required && <NovusLabel sx={{ color: COLORS.REQUIRED }}>*</NovusLabel>}
            {showHelpIcon && (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: COLORS.TEXT_LABEL,
                    fontWeight: 400,
                  }}
                >
                  ?
                </Typography>
              </Box>
            )}
          </Box>
          {showCharacterCount && maxLength && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: COLORS.TEXT_LABEL,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {currentLength}/{maxLength}
            </Typography>
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
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start" sx={{ color: COLORS.TEXT_ICON }}>
              {startIcon}
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end" sx={{ color: COLORS.TEXT_ICON }}>
              {endIcon}
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          width: "100%",
          minWidth: 0,
          opacity: disabled ? 0.6 : 1,
          "& .MuiOutlinedInput-root": {
            height: `${size.height}px !important`,
            padding: `${size.padding} !important`,
            borderRadius: `${size.borderRadius} !important`,
            fontSize: `${size.fontSize}px !important`,
          },
          "& .MuiInputBase-input": {
            fontSize: `${size.fontSize}px !important`,
            lineHeight: "1 !important",
          },
          "& .MuiFormHelperText-root": {
            color: getHelperTextColor(),
            margin: "0px !important",
            marginTop: "4px !important",
          },
          "& .MuiInputAdornment-root": {
            color: COLORS.TEXT_ICON,
          },
          ...(props.multiline && {
            "& .MuiOutlinedInput-root": {
              height: "auto !important",
              minHeight: "80px !important",
              maxHeight: "none !important",
            },
          }),
        }}
        {...props}
      />
    </Box>
  );
};

export default NovusInputComponent;
