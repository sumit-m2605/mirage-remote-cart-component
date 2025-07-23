import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  IconButton, 
  Collapse, 
  Typography,
  Snackbar,
  Slide,
  SlideProps
} from '@mui/material';
import { 
  Close, 
  CheckCircle, 
  Error, 
  Warning, 
  Info, 
  Success 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { AlertProps, SnackbarProps } from '@mui/material';

// Novus Design System Color Palette
const novusColors = {
  // Primary Colors
  primary: {
    main: '#3535f3',
    light: '#5a5af5',
    dark: '#2a2ac0',
    contrast: '#ffffff',
    background: '#f0f0ff',
    border: '#3535f3',
  },
  secondary: {
    main: '#2C4BFF',
    light: '#5a6bff',
    dark: '#1e35cc',
    contrast: '#ffffff',
    background: '#f0f4ff',
    border: '#2C4BFF',
  },
  // Semantic Colors
  success: {
    main: '#00B140',
    light: '#33c166',
    dark: '#008f33',
    contrast: '#ffffff',
    background: '#f0fff4',
    border: '#00B140',
  },
  error: {
    main: '#FF3B3B',
    light: '#ff6666',
    dark: '#cc2f2f',
    contrast: '#ffffff',
    background: '#fff5f5',
    border: '#FF3B3B',
  },
  warning: {
    main: '#FF7F00',
    light: '#ff9933',
    dark: '#cc6600',
    contrast: '#ffffff',
    background: '#fffbf0',
    border: '#FF7F00',
  },
  info: {
    main: '#2196F3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrast: '#ffffff',
    background: '#f0f8ff',
    border: '#2196F3',
  },
  // Neutral Colors
  neutral: {
    main: '#6B7280',
    light: '#9CA3AF',
    dark: '#4B5563',
    contrast: '#ffffff',
    background: '#f9fafb',
    border: '#6B7280',
  },
};

type NovusColorType = keyof typeof novusColors;
type AlertVariantType = 'filled' | 'outlined' | 'soft' | 'bordered';
type AlertSizeType = 'small' | 'medium' | 'large';
type AlertSeverityType = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral';

interface NovusAlertProps extends Omit<AlertProps, 'severity' | 'variant'> {
  novusColor?: NovusColorType;
  severity?: AlertSeverityType;
  variant?: AlertVariantType;
  size?: AlertSizeType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  closable?: boolean;
  autoHideDuration?: number;
  showIcon?: boolean;
  fullWidth?: boolean;
  elevation?: number;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

interface NovusSnackbarProps extends Omit<SnackbarProps, 'message'> {
  novusColor?: NovusColorType;
  severity?: AlertSeverityType;
  variant?: AlertVariantType;
  size?: AlertSizeType;
  title?: string;
  message?: string;
  description?: string;
  action?: React.ReactNode;
  closable?: boolean;
  showIcon?: boolean;
  autoHideDuration?: number;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const StyledAlert = styled(Alert, {
  shouldForwardProp: (prop) => 
    !['novusColor', 'variant', 'size', 'showIcon'].includes(prop as string),
})<NovusAlertProps>(({ 
  novusColor = 'primary', 
  variant = 'soft', 
  size = 'medium',
  showIcon = true,
  theme 
}) => {
  const colorData = novusColors[novusColor];
  
  // Size configurations
  const sizeConfig = {
    small: {
      padding: '8px 12px',
      fontSize: '12px',
      iconSize: 16,
      borderRadius: '6px',
      gap: '8px',
    },
    medium: {
      padding: '12px 16px',
      fontSize: '14px',
      iconSize: 20,
      borderRadius: '8px',
      gap: '12px',
    },
    large: {
      padding: '16px 20px',
      fontSize: '16px',
      iconSize: 24,
      borderRadius: '10px',
      gap: '16px',
    },
  };

  const currentSize = sizeConfig[size];

  // Variant-specific styles
  const variantStyles = {
    filled: {
      backgroundColor: colorData.main,
      color: colorData.contrast,
      border: 'none',
      '& .MuiAlert-icon': {
        color: colorData.contrast,
      },
      '& .MuiAlert-action': {
        color: colorData.contrast,
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colorData.main,
      border: `1px solid ${colorData.border}`,
      '& .MuiAlert-icon': {
        color: colorData.main,
      },
      '& .MuiAlert-action': {
        color: colorData.main,
      },
    },
    soft: {
      backgroundColor: colorData.background,
      color: colorData.main,
      border: 'none',
      '& .MuiAlert-icon': {
        color: colorData.main,
      },
      '& .MuiAlert-action': {
        color: colorData.main,
      },
    },
    bordered: {
      backgroundColor: colorData.background,
      color: colorData.main,
      border: `2px solid ${colorData.border}`,
      '& .MuiAlert-icon': {
        color: colorData.main,
      },
      '& .MuiAlert-action': {
        color: colorData.main,
      },
    },
  };

  const currentVariant = variantStyles[variant];

  return {
    ...currentSize,
    ...currentVariant,
    display: 'flex',
    alignItems: 'flex-start',
    gap: currentSize.gap,
    fontWeight: 400,
    lineHeight: 1.5,
    boxShadow: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    
    '& .MuiAlert-icon': {
      fontSize: currentSize.iconSize,
      marginTop: '2px',
      flexShrink: 0,
    },
    
    '& .MuiAlert-message': {
      flex: 1,
      minWidth: 0,
    },
    
    '& .MuiAlert-action': {
      padding: 0,
      marginTop: '-2px',
      marginBottom: '-2px',
      marginRight: '-4px',
    },
    
    '& .MuiAlertTitle-root': {
      fontSize: size === 'small' ? '13px' : size === 'large' ? '18px' : '16px',
      fontWeight: 600,
      marginBottom: '4px',
      lineHeight: 1.4,
    },
    
    '& .MuiAlert-description': {
      fontSize: currentSize.fontSize,
      lineHeight: 1.5,
      marginTop: '4px',
    },
    
    // Hover effects
    '&:hover': {
      transform: variant === 'soft' || variant === 'bordered' ? 'translateY(-1px)' : 'none',
      boxShadow: variant === 'soft' || variant === 'bordered' ? 
        `0 4px 12px ${colorData.main}20` : 'none',
    },
    
    // Focus state
    '&:focus-within': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${colorData.main}20`,
    },
  };
});

const StyledSnackbar = styled(Snackbar)<NovusSnackbarProps>(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    minWidth: 'auto',
    maxWidth: '600px',
  },
}));

// Icon mapping
const getAlertIcon = (severity: AlertSeverityType, size: AlertSizeType) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  
  const iconMap = {
    success: <CheckCircle sx={{ fontSize: iconSize }} />,
    error: <Error sx={{ fontSize: iconSize }} />,
    warning: <Warning sx={{ fontSize: iconSize }} />,
    info: <Info sx={{ fontSize: iconSize }} />,
    primary: <Info sx={{ fontSize: iconSize }} />,
    secondary: <Info sx={{ fontSize: iconSize }} />,
    neutral: <Info sx={{ fontSize: iconSize }} />,
  };
  
  return iconMap[severity];
};

// Slide transition for Snackbar
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

const NovusAlert: React.FC<NovusAlertProps> = ({
  children,
  novusColor = 'primary',
  severity = 'primary',
  variant = 'soft',
  size = 'medium',
  title,
  description,
  action,
  closable = false,
  showIcon = true,
  fullWidth = false,
  elevation,
  onClose,
  ...props
}) => {
  const [open, setOpen] = useState(true);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setOpen(false);
    onClose?.(event, reason);
  };

  const colorData = novusColors[novusColor];
  const icon = showIcon ? getAlertIcon(severity, size) : null;

  return (
    <Collapse in={open}>
      <StyledAlert
        novusColor={novusColor}
        variant={variant}
        size={size}
        showIcon={showIcon}
        icon={icon}
        action={
          <>
            {action}
            {closable && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleClose}
                sx={{
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: `${colorData.main}20`,
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </>
        }
        onClose={closable ? handleClose : undefined}
        sx={{
          width: fullWidth ? '100%' : 'auto',
          boxShadow: elevation ? theme.shadows[elevation] : 'none',
        }}
        {...props}
      >
        <Box>
          {title && (
            <AlertTitle sx={{ margin: 0 }}>
              {title}
            </AlertTitle>
          )}
          <Box>
            {children}
            {description && (
              <Typography 
                className="MuiAlert-description"
                sx={{ 
                  marginTop: title ? '4px' : 0,
                  opacity: 0.8,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Box>
      </StyledAlert>
    </Collapse>
  );
};

const NovusSnackbar: React.FC<NovusSnackbarProps> = ({
  open = true,
  novusColor = 'primary',
  severity = 'primary',
  variant = 'soft',
  size = 'medium',
  title,
  message,
  description,
  action,
  closable = true,
  showIcon = true,
  autoHideDuration = 6000,
  onClose,
  ...props
}) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose?.(event, reason);
  };

  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      {...props}
    >
      <NovusAlert
        novusColor={novusColor}
        severity={severity}
        variant={variant}
        size={size}
        title={title}
        showIcon={showIcon}
        action={action}
        closable={closable}
        onClose={handleClose}
        fullWidth
      >
        {message}
        {description && (
          <Typography 
            className="MuiAlert-description"
            sx={{ 
              marginTop: title ? '4px' : 0,
              opacity: 0.8,
            }}
          >
            {description}
          </Typography>
        )}
      </NovusAlert>
    </StyledSnackbar>
  );
};

export default NovusAlert;
export { NovusSnackbar };
export type { 
  NovusAlertProps, 
  NovusSnackbarProps, 
  NovusColorType, 
  AlertVariantType, 
  AlertSizeType, 
  AlertSeverityType 
}; 