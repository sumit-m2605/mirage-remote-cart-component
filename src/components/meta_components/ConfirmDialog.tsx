// src/components/meta-tags/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  Box
} from '@mui/material';
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

// Color constants
const COLORS = {
  primary: '#141414',
  secondary: '#A6A6A6',
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5'
  },
  border: '#E0E0E0',
  button: {
    delete: {
      primary: '#F50031',
      hover: '#D10029',
      active: '#B80024'
    },
    hover: '#0A0A0A'
  }
} as const;

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.16)',
          maxHeight: '80vh'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: COLORS.background.secondary,
          borderBottom: `1px solid ${COLORS.border}`
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: COLORS.primary
            }}
          >
            Delete Meta Tag?
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '4px',
              width: '24px',
              height: '24px',
              borderRadius: '250px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: COLORS.button.hover
              }
            }}
          >
            <Box
              sx={{
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: COLORS.background.primary
        }}
      >
        <Box
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '1.5',
            color: COLORS.secondary
          }}
        >
          Are you sure you want to delete this meta tag?
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: '24px',
          padding: '16px 24px',
          backgroundColor: COLORS.background.primary
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '12px'
          }}
        >
          <NovusButton 
            onClick={onClose} 
            variantType="secondary"
            novusSize="md"
          >
            Cancel
          </NovusButton>
          <NovusButton 
            onClick={onConfirm}
            variantType="primary"
            novusSize="md"
            sx={{
              backgroundColor: COLORS.button.delete.primary,
              borderColor: COLORS.button.delete.primary,
              color: COLORS.background.primary,
              '&:hover': {
                backgroundColor: COLORS.button.delete.hover,
                borderColor: COLORS.button.delete.hover
              },
              '&:active': {
                backgroundColor: COLORS.button.delete.active,
                borderColor: COLORS.button.delete.active
              }
            }}
          >
            Delete
          </NovusButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
