import React from "react";
import { Switch, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { SwitchProps } from "@mui/material";

// Color variables
const COLORS = {
  // Thumb colors
  THUMB_DEFAULT: "#5A5A5A",
  THUMB_CHECKED: "#FFFFFF",
  
  // Track colors
  TRACK_DEFAULT: "#FFFFFF",
  TRACK_CHECKED: "#3535F3",
  TRACK_HOVER: "#000093",
  TRACK_PRESSED: "#00004C",
  
  // Border colors
  BORDER_DEFAULT: "#5A5A5A",
  BORDER_HOVER: "#3535F3",
  BORDER_PRESSED: "#000093",
  BORDER_FOCUSED: "#000093",
  
  // Label colors
  LABEL_DEFAULT: "#141414",
  
  // Disabled opacity
  DISABLED_OPACITY: 0.6,
} as const;

const createStyledSwitch = (size: "sm" | "md" | "lg") => {
  const sizeConfig = {
    sm: {
      width: 28,
      height: 16,
      thumbSize: 10,
      padding: 3,
      transform: 12,
      borderRadius: 8,
    },
    md: {
      width: 36,
      height: 20,
      thumbSize: 12,
      padding: 4,
      transform: 16,
      borderRadius: 10,
    },
    lg: {
      width: 44,
      height: 24,
      thumbSize: 16,
      padding: 4,
      transform: 20,
      borderRadius: 12,
    },
  };

  const config = sizeConfig[size];

  return styled(Switch)(({ theme }) => ({
    width: config.width,
    height: config.height,
    padding: 0,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    "& .MuiSwitch-switchBase": {
      padding: config.padding,
      transition: theme.transitions.create(["transform"], {
        duration: 300,
        easing: "ease-in-out",
      }),
      "&.Mui-checked": {
        transform: `translateX(${config.transform}px)`,
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: COLORS.TRACK_CHECKED,
          opacity: 1,
          border: 0,
        },
        "& .MuiSwitch-thumb": {
          backgroundColor: COLORS.THUMB_CHECKED,
        },
      },
      "& .MuiSwitch-switchBase.Mui-checked:hover + .MuiSwitch-track": {
        backgroundColor: `${COLORS.TRACK_HOVER} !important`,
      },
      "& .MuiSwitch-switchBase.Mui-checked:active + .MuiSwitch-track": {
        backgroundColor: `${COLORS.TRACK_PRESSED} !important`,
      },
      "& .MuiSwitch-switchBase.Mui-checked.Mui-focusVisible + .MuiSwitch-track": {
        outline: `2px solid ${COLORS.BORDER_FOCUSED}`,
        outlineOffset: "2px",
      },
              "&:hover": {
          "& + .MuiSwitch-track": {
            borderColor: COLORS.BORDER_HOVER,
          },
        },
        "&:active": {
          "& + .MuiSwitch-track": {
            borderColor: COLORS.BORDER_PRESSED,
          },
        },
        "&.Mui-focusVisible": {
          "& + .MuiSwitch-track": {
            borderColor: COLORS.BORDER_FOCUSED,
          },
        },
    },
    "& .MuiSwitch-thumb": {
      width: config.thumbSize,
      height: config.thumbSize,
      borderRadius: "50%",
      backgroundColor: COLORS.THUMB_DEFAULT,
      transition: theme.transitions.create(["background-color"], {
        duration: 300,
        easing: "ease-in-out",
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: config.borderRadius,
      backgroundColor: COLORS.TRACK_DEFAULT,
      opacity: 1,
      border: `1px solid ${COLORS.BORDER_DEFAULT}`,
      boxSizing: "border-box",
      transition: theme.transitions.create(["background-color", "border-color"], {
        duration: 300,
      }),
    },
    "&.Mui-disabled": {
      opacity: COLORS.DISABLED_OPACITY,
      "& .MuiSwitch-track": {
        opacity: COLORS.DISABLED_OPACITY,
      },
      "& .MuiSwitch-thumb": {
        opacity: COLORS.DISABLED_OPACITY,
      },
    },
  }));
};

interface NovusToggleProps extends Omit<SwitchProps, 'size'> {
  label?: string;
  supportText?: string;
  labelPosition?: "left" | "right" | "top" | "bottom";
  labelColor?: string;
  size?: "sm" | "md" | "lg";
}

const NovusToggle: React.FC<NovusToggleProps> = ({
  label,
  supportText,
  labelPosition = "right",
  labelColor,
  size = "md",
  ...props
}) => {
  const flexDirection =
    labelPosition === "left"
      ? "row-reverse"
      : labelPosition === "top"
      ? "column"
      : labelPosition === "bottom"
      ? "column-reverse"
      : "row";

  const color = labelColor || COLORS.LABEL_DEFAULT;
  const StyledSwitch = createStyledSwitch(size);

  const getLabelTypography = () => {
    switch (size) {
      case "sm":
        return { fontSize: 14, fontWeight: 400 };
      case "md":
        return { fontSize: 14, fontWeight: 400 };
      case "lg":
        return { fontSize: 16, fontWeight: 400 };
      default:
        return { fontSize: 14, fontWeight: 400 };
    }
  };

  const labelTypography = getLabelTypography();

  return (
    <Box display="flex" flexDirection={flexDirection} alignItems="center" gap={1}>
      {label && (
        <Typography fontSize={labelTypography.fontSize} fontWeight={labelTypography.fontWeight} color={color}>
          {label}
        </Typography>
      )}
      <StyledSwitch {...props} />
      {supportText && (
        <Typography fontSize={12} color="text.secondary">
          {supportText}
        </Typography>
      )}
    </Box>
  );
};

export default NovusToggle;
