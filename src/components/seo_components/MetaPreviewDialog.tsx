import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

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
        <TextField
          value={content}
          multiline
          rows={15}
          fullWidth
          disabled
          variant="outlined"
          sx={{
            mt: 1,
            "& .MuiInputBase-root": {
              backgroundColor: "#21252B",
              color: "#fff",
              fontFamily: "monospace",
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetaPreviewDialog; 