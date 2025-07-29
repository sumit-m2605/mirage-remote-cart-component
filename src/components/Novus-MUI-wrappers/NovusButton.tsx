import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ButtonProps } from "@mui/material";

// Color variables
const COLORS = {
  // Primary colors
  PRIMARY_DEFAULT: "#3535F3",
  PRIMARY_HOVER: "#000093",
  PRIMARY_ACTIVE: "#00004C",
  PRIMARY_FOCUS: "#000093",
  
  // Secondary colors
  SECONDARY_BACKGROUND: "#ffffff",
  SECONDARY_BORDER: "#E0E0E0",
  SECONDARY_TEXT: "#000093",
  SECONDARY_HOVER_BG: "#E8E8FC",
  SECONDARY_ACTIVE_BG: "#ADADFC",
  SECONDARY_ACTIVE_TEXT: "#00004C",
  SECONDARY_DISABLED_BG: "#F5F5F5",
  SECONDARY_DISABLED_TEXT: "#A0A0A0",
  
  // Tertiary colors
  TERTIARY_BACKGROUND: "#ffffff",
  TERTIARY_TEXT: "#000093",
  TERTIARY_HOVER_TEXT: "#00004C",
  TERTIARY_ACTIVE_TEXT: "#010029",
  TERTIARY_DISABLED_TEXT: "#ADADFC",
  
  // Common colors
  WHITE: "#ffffff",
  BLACK: "#000000",
  DISABLED_OPACITY: 0.3,
  
  // Text colors
  TEXT_WHITE: "#ffffff",
  TEXT_DISABLED: "#9999FF",
} as const;

// Figma spec: Appearances (colors)
const colorMap = {
  default: COLORS.PRIMARY_DEFAULT,
  contrast: "#2C4BFF",
  positive: "#25AB21",
  negative: "#F50031",
  warning: "#F06D0F",
  ai: "linear-gradient(90deg, #1ECCB0 0%, #3535F3 100%)",
};

// Figma spec: Sizes
const sizeMap = {
  xs: {
    padding: "0px 12px",
    fontSize: "12px",
    height: "24px",
    lineHeight: "24px",
    spinnerSize: 16,
  },
  sm: {
    padding: "0px 16px",
    fontSize: "12px",
    height: "32px",
    lineHeight: "32px",
    spinnerSize: 18,
  },
  md: {
    padding: "0px 24px",
    fontSize: "14px",
    height: "40px",
    lineHeight: "40px",
    spinnerSize: 20,
  },
  lg: {
    padding: "0px 32px",
    fontSize: "16px",
    height: "48px",
    lineHeight: "48px",
    spinnerSize: 22,
  },
  xl: {
    padding: "0px 40px",
    fontSize: "24px",
    height: "64px",
    lineHeight: "64px",
    spinnerSize: 24,
  },
} as const;

type Appearance = keyof typeof colorMap;
type NovusSize = "xs" | "sm" | "md" | "lg" | "xl";
type VariantType = "primary" | "secondary" | "tertiary";


interface NovusButtonProps extends Omit<ButtonProps, "size"> {
  appearance?: Appearance;
  variantType?: VariantType;
  novusSize?: NovusSize;
  loading?: boolean;
  padding?: string;
}


const StyledNovusButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "variantType" &&
    prop !== "appearance" &&
    prop !== "novusSize" &&
    prop !== "loading",
})<NovusButtonProps>(
  ({
    appearance = "default",
    variantType = "primary",
    novusSize = "md",
    padding,
  }) => {
    const color = colorMap[appearance] as string;
    const sizeStyles = sizeMap[novusSize as keyof typeof sizeMap];
    const borderRadius = "250px";
    const fontFamily = "Inter, sans-serif";
    const fontWeight = 500;

    // Use custom padding if provided, otherwise use size-based padding
    const buttonPadding = padding || sizeStyles.padding;

    // Shared styles
    const shared = {
      borderRadius,
      fontFamily,
      fontWeight,
      padding: buttonPadding,
      fontSize: sizeStyles.fontSize,
      height: sizeStyles.height,
      lineHeight: sizeStyles.lineHeight,
      textTransform: "none" as const,
      boxShadow: "none",
      transition: "background 0.2s, color 0.2s, border 0.2s",
      position: "relative" as const,
      overflow: "hidden" as const,
      "& .MuiButton-startIcon, & .MuiButton-endIcon": {
        margin: 0,
      },
      // Prevent focus from persisting after click
      "&:focus:not(:focus-visible)": {
        outline: "none",
      },
      "&:focus-visible": {
        outline: "none",
      },
    };

    // Variant styles
    if (variantType === "primary") {
      return {
        ...shared,
        background: COLORS.PRIMARY_DEFAULT,
        border: `1px solid ${COLORS.PRIMARY_DEFAULT}`,
        color: COLORS.TEXT_WHITE,
        textDecoration: "none !important",
        "&:hover": {
          background: COLORS.PRIMARY_HOVER,
          borderColor: COLORS.PRIMARY_HOVER,
          color: COLORS.TEXT_WHITE,
        },
        "&:active, &.Mui-active": {
          background: `${COLORS.PRIMARY_ACTIVE} !important`,
          borderColor: `${COLORS.PRIMARY_ACTIVE} !important`,
          color: `${COLORS.TEXT_DISABLED} !important`,
        },
        "&:focus": {
          background: COLORS.PRIMARY_DEFAULT,
          borderColor: COLORS.PRIMARY_FOCUS,
          color: COLORS.PRIMARY_ACTIVE,
          outline: "none",
        },
        "&.Mui-disabled": {
          background: COLORS.PRIMARY_DEFAULT,
          borderColor: COLORS.PRIMARY_DEFAULT,
          color: COLORS.TEXT_WHITE,
          opacity: COLORS.DISABLED_OPACITY,
        },
      };
    }

    if (variantType === "secondary") {
      return {
        ...shared,
        background: COLORS.SECONDARY_BACKGROUND,
        border: `1px solid ${COLORS.SECONDARY_BORDER}`,
        color: COLORS.SECONDARY_TEXT,
        textDecoration: "none !important",
        "&:hover": {
          background: COLORS.SECONDARY_HOVER_BG,
          borderColor: COLORS.SECONDARY_BORDER,
          color: COLORS.SECONDARY_TEXT,
        },
        "&:active, &.Mui-active": {
          backgroundColor: `${COLORS.SECONDARY_ACTIVE_BG} !important`,
          borderColor: `${COLORS.SECONDARY_BORDER} !important`,
          color: `${COLORS.SECONDARY_ACTIVE_TEXT} !important`,
        },
        "&:focus": {
          background: COLORS.SECONDARY_BACKGROUND,
          borderColor: COLORS.SECONDARY_TEXT,
          color: COLORS.SECONDARY_ACTIVE_TEXT,
          outline: "none",
        },
        "&.Mui-disabled": {
          background: COLORS.SECONDARY_DISABLED_BG,
          borderColor: COLORS.SECONDARY_BORDER,
          color: COLORS.SECONDARY_DISABLED_TEXT,
          opacity: 1,
        },
      };
    }

    // Tertiary
    return {
      ...shared,
      background: COLORS.TERTIARY_BACKGROUND,
      border: `1px solid ${COLORS.TERTIARY_BACKGROUND}`,
      color: COLORS.TERTIARY_TEXT,
      "&:hover": {
        background: COLORS.TERTIARY_BACKGROUND,
        borderColor: COLORS.TERTIARY_BACKGROUND,
        color: COLORS.TERTIARY_HOVER_TEXT,
        textDecoration: "underline !important",
      },
      "&:active, &.Mui-active": {
        backgroundColor: `${COLORS.TERTIARY_BACKGROUND} !important`,
        borderColor: `${COLORS.TERTIARY_BACKGROUND} !important`,
        color: `${COLORS.TERTIARY_ACTIVE_TEXT} !important`,
      },
      "&:focus": {
        background: COLORS.TERTIARY_BACKGROUND,
        borderColor: COLORS.TERTIARY_TEXT,
        color: COLORS.TERTIARY_TEXT,
        outline: "none",
      },
      "&.Mui-disabled": {
        background: COLORS.TERTIARY_BACKGROUND,
        borderColor: COLORS.TERTIARY_BACKGROUND,
        color: COLORS.TERTIARY_DISABLED_TEXT,
        opacity: 1,
      },
    };
  }
);

// Map Novus size to MUI Button size for accessibility (affects padding, icon size, etc.)
const mapNovusToMuiSize = (novusSize: NovusSize): ButtonProps["size"] => {
  if (novusSize === "xs" || novusSize === "sm") return "small";
  if (novusSize === "md") return "medium";
  if (novusSize === "lg" || novusSize === "xl") return "large";
  return "medium";
};

const NovusButton: React.FC<NovusButtonProps> = ({
  appearance = "default",
  variantType = "primary",
  novusSize = "md",
  loading = false,
  disabled,
  children,
  onClick,
  padding,
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
      padding={padding}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={sizeStyles.spinnerSize}
          color="inherit"
          thickness={5}
        />
      ) : (
        children
      )}
    </StyledNovusButton>
  );
};

export default NovusButton;
