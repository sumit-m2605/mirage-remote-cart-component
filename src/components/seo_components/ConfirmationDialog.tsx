import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<Props> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <NovusButton onClick={onCancel} variantType="secondary">
          {cancelText}
        </NovusButton>
        <NovusButton onClick={onConfirm} appearance="negative">
          {confirmText}
        </NovusButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 