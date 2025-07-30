import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { NovusInput } from "../Novus-MUI-wrappers";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

// Color constants
const COLORS = {
  background: {
    dark: '#21252B'
  },
  text: {
    light: '#FFFFFF'
  }
} as const;

interface MetaTagItem {
  key: string;
  value: string;
}

interface MetaTag {
  title: string;
  items: MetaTagItem[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  metaTags: MetaTag[];
}

const MetaPreviewDialog: React.FC<Props> = ({ open, onClose, metaTags }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open && metaTags) {
      const formattedContent = metaTags
        .map((item) => {
          const attributes = item.items
            .map((subItem) => `${subItem.key}="${subItem.value}"`)
            .join(" ");
          return `<meta ${attributes}></meta>`;
        })
        .join("\n");
      setContent(formattedContent);
    }
  }, [open, metaTags]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Preview SEO Meta</DialogTitle>
      <DialogContent>
        <NovusInput
          value={content}
          multiline
          rows={15}
          disabled
          novusSize="md"
          sx={{
            mt: 1,
            "& .MuiInputBase-root": {
              backgroundColor: COLORS.background.dark,
              color: COLORS.text.light,
              fontFamily: "monospace",
            },
            "& .MuiInputBase-input": {
              color: COLORS.text.light,
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <NovusButton onClick={onClose} variantType="secondary">
          OK
        </NovusButton>
      </DialogActions>
    </Dialog>
  );
};

export default MetaPreviewDialog; 