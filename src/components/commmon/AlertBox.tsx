import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

interface AlertBoxProps {
  display?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  showCloseButton?: boolean;
}

const AlertContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#E7EEFF',
  border: '1px solid #2E31BE',
  borderRadius: '4px',
  minHeight: '46px',
  padding: '0 8px',
  marginBottom: '1rem',
});

const MainContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  fontSize: '13px',
  fontWeight: 400,
});

const WarnIcon = styled(Box)({
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
});

const CloseText = styled(Typography)({
  color: '#3535F3',
  fontWeight: 700,
  fontSize: '12px',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const AlertBox: React.FC<AlertBoxProps> = ({
  display = true,
  onClose,
  children,
  icon,
  actionButton,
  showCloseButton = true
}) => {
  if (!display) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <AlertContainer>
      <MainContent>
        <WarnIcon>
          {icon || <InfoIcon style={{ fontSize: '16px', color: '#2E31BE' }} />}
        </WarnIcon>
        <Box>
          {children}
        </Box>
      </MainContent>
      
      {actionButton || (showCloseButton && (
        <CloseText onClick={handleClose}>
          Okay, got it
        </CloseText>
      ))}
    </AlertContainer>
  );
};

export default AlertBox; 