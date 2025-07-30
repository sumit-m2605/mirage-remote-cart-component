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
import CodeEditor from "../commmon/CodeEditor";
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
    hover: '#0A0A0A'
  },
  shadow: '#292929'
} as const;

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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: `0px 4px 16px 0px ${COLORS.shadow}`,
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
            {meta?.name ? "Edit Meta Tag" : "Add Meta Tag"}
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
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'stretch',
            gap: '24px'
          }}
        >
          <NovusInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            novusSize="md"
          />

          <Box>
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                marginBottom: '4px'
              }}
            >
              <Box
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '1.429',
                  color: COLORS.secondary
                }}
              >
                Content
              </Box>
            </Box>
            <CodeEditor
              value={content}
              onChange={setContent}
              height="345px"
              placeholder="Enter meta tag content..."
              theme="dark"
            />
          </Box>
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
          backgroundColor: COLORS.background.primary,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '12px'
          }}
        >
          <NovusButton 
            variantType="secondary" 
            onClick={onClose}
            novusSize="md"
          >
            Cancel
          </NovusButton>
          <NovusButton
            variantType="primary"
            onClick={handleSave}
            disabled={!name || !content}
            novusSize="md"
          >
            Save
          </NovusButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MetaDialog;
