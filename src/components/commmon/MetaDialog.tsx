// src/components/meta-tags/MetaDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import type { MetaTag } from './MetaTags';

interface Props {
  open: boolean;
  meta: MetaTag | null;
  onClose: () => void;
  onSave: (meta: MetaTag) => void;
}

const MetaDialog: React.FC<Props> = ({ open, meta, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (meta) {
      setName(meta.name);
      setContent(meta.content);
    } else {
      setName('');
      setContent('');
    }
  }, [meta]);

  const handleSave = () => {
    if (!name || !content) return;
    onSave({ name, content });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{meta ? 'Edit Meta Tag' : 'Add Meta Tag'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            multiline
            rows={6}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!name || !content}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetaDialog;
