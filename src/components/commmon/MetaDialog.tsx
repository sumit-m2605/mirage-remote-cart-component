// src/components/meta-tags/MetaDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import type { MetaTag } from "./MetaTags";
import { NovusInput } from "../Novus-MUI-wrappers";
import CodeEditor from "./CodeEditor";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

interface Props {
  open: boolean;
  meta: MetaTag | null;
  onClose: () => void;
  onSave: (meta: MetaTag) => void;
}

const MetaDialog: React.FC<Props> = ({ open, meta, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (meta) {
      setName(meta.name);
      setContent(meta.content);
    } else {
      setName("");
      setContent("");
    }
  }, [meta]);

  const handleSave = () => {
    if (!name || !content) return;
    onSave({ name, content });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{meta?.name ? "Edit Meta Tag" : "Add Meta Tag"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <NovusInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            novusSize="m"
          />

          <Box>
            <Box fontWeight={500} mb={1}>
              Content
            </Box>
            <CodeEditor
              value={content}
              onChange={setContent}
              height="180px"
              placeholder="Enter meta tag content..."
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <NovusButton variantType="secondary" onClick={onClose}>
          Cancel
        </NovusButton>
        <NovusButton
          variantType="primary"
          onClick={handleSave}
          disabled={!name || !content}
        >
          Save
        </NovusButton>
      </DialogActions>
    </Dialog>
  );
};

export default MetaDialog;
