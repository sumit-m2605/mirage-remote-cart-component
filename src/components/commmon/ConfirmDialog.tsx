// src/components/meta-tags/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Meta Tag</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this meta tag?</Typography>
      </DialogContent>
      <DialogActions>
        <NovusButton onClick={onClose} variantType="secondary">Cancel</NovusButton>
        <NovusButton appearance="negative" onClick={onConfirm}>Delete</NovusButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
