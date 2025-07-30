import React from 'react';
import {
  Snackbar,
  Box,
  Typography,
  IconButton,
  Slide,
  styled
} from '@mui/material';
import type { SlideProps } from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info
} from '@mui/icons-material';
import type { SnackbarProps } from '@mui/material';

// Color variables
const COLORS = {
  // Background colors
  BACKGROUND_DARK: "#141414",
  BACKGROUND_HOVER: "#292929",
  
  // Text colors
  TEXT_WHITE: "#FAFAFA",
  
  // Icon colors
  ICON_SUCCESS: "#25AB21",
  ICON_ERROR: "#FF3B3B",
  ICON_WARNING: "#FF7F00",
  ICON_INFO: "#2196F3",
  
  // Close button colors
  CLOSE_BUTTON: "#FAFAFA",
  CLOSE_BUTTON_OPACITY: 0.7,
  
  // Shadow colors
  SHADOW_DARK: "#292929",
  SHADOW_LIGHT: "#292929",
} as const;

type SnackbarSeverityType = 'success' | 'error' | 'warning' | 'info';

interface NovusSnackbarProps extends Omit<SnackbarProps, 'message'> {
  severity?: SnackbarSeverityType;
  title?: string;
  message?: string;
  closable?: boolean;
  showIcon?: boolean;
  autoHide?: boolean;
  autoHideDuration?: number;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

// Get icon based on severity
const getSnackbarIcon = (severity: SnackbarSeverityType) => {
  switch (severity) {
    case 'success':
      return <CheckCircle sx={{ fontSize: '24px', color: COLORS.ICON_SUCCESS }} />;
    case 'error':
      return <Error sx={{ fontSize: '24px', color: COLORS.ICON_ERROR }} />;
    case 'warning':
      return <Warning sx={{ fontSize: '24px', color: COLORS.ICON_WARNING }} />;
    case 'info':
      return <Info sx={{ fontSize: '24px', color: COLORS.ICON_INFO }} />;
    default:
      return <CheckCircle sx={{ fontSize: '24px', color: COLORS.ICON_SUCCESS }} />;
  }
};

// Styled Snackbar Content based on Figma design
const StyledSnackbarContent = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  padding: '12px',
  backgroundColor: COLORS.BACKGROUND_DARK,
  border: `1px solid ${COLORS.BACKGROUND_DARK}`,
  borderRadius: '12px',
  boxShadow: `0px 4px 16px 0px ${COLORS.SHADOW_DARK}, 0px 0px 8px 0px ${COLORS.SHADOW_LIGHT}`,
  maxWidth: '299px',
  minWidth: '280px',
  position: 'relative',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

  '& .snackbar-icon': {
    flexShrink: 0,
    margin: 0,
    padding: 0,
  },

  '& .snackbar-content': {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '2px',
  },

  '& .snackbar-title': {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.4285714285714286,
    color: COLORS.TEXT_WHITE,
    textAlign: 'left',
  },

  '& .snackbar-close': {
    flexShrink: 0,
    marginLeft: 'auto',
    padding: '4px',
    borderRadius: '50%',
    minWidth: 'auto',
    width: '24px',
    height: '24px',
    color: COLORS.CLOSE_BUTTON,
    opacity: COLORS.CLOSE_BUTTON_OPACITY,
    transition: 'opacity 0.2s ease',

    '&:hover': {
      opacity: 1,
      backgroundColor: COLORS.BACKGROUND_HOVER,
    },
  },
});

// Slide transition for Snackbar
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

const NovusSnackbar: React.FC<NovusSnackbarProps> = ({
  open = true,
  severity = 'success',
  title,
  message,
  closable = true,
  showIcon = true,
  autoHide = true,
  autoHideDuration = 3000,
  onClose,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  ...props
}) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose?.(event, reason);
  };

  const displayText = title || message || '';

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHide ? autoHideDuration : null}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={anchorOrigin}
      {...props}
    >
      <StyledSnackbarContent>
        {showIcon && (
          <Box className="snackbar-icon">
            {getSnackbarIcon(severity)}
          </Box>
        )}

        <Box className="snackbar-content">
          <Typography className="snackbar-title">
            {displayText}
          </Typography>
        </Box>

        {closable && (
          <IconButton
            className="snackbar-close"
            onClick={handleClose}
            size="small"
          >
            <Close sx={{ fontSize: '16px' }} />
          </IconButton>
        )}
      </StyledSnackbarContent>
    </Snackbar>
  );
};

export default NovusSnackbar;
export type { NovusSnackbarProps, SnackbarSeverityType }; 