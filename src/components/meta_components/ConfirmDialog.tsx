// src/components/meta-tags/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  Box
} from '@mui/material';
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

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
          backgroundColor: '#F5F5F5',
          borderBottom: '1px solid #E0E0E0'
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              color: '#141414'
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
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
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
          backgroundColor: '#FFFFFF'
        }}
      >
        <Box
          sx={{
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '1.5',
            color: 'rgba(0, 0, 0, 0.65)'
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
          backgroundColor: '#FFFFFF'
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
            novusSize="sm"
          >
            Cancel
          </NovusButton>
          <NovusButton 
            onClick={onConfirm}
            variantType="primary"
            novusSize="sm"
            sx={{
              backgroundColor: '#F50031',
              borderColor: '#F50031',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#D10029',
                borderColor: '#D10029'
              },
              '&:active': {
                backgroundColor: '#B80024',
                borderColor: '#B80024'
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
