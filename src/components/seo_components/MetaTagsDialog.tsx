import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { NovusInput } from "../Novus-MUI-wrappers";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

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
  onSave: (data: MetaTag) => void;
  onUpdate: (data: { tags: MetaTag; index: number }) => void;
  metaTags: MetaTag[];
  editData?: { data: MetaTag; index: number };
}

const MetaTagsDialog: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  onUpdate,
  metaTags,
  editData,
}) => {
  const [title, setTitle] = useState("");
  const [metaTagsItems, setMetaTagsItems] = useState<MetaTagItem[]>([
    { key: "", value: "" },
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [initialData, setInitialData] = useState<MetaTag | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editData) {
        const { data, index } = editData;
        setTitle(data.title);
        setMetaTagsItems(data.items);
        setIsEditMode(true);
        setEditIndex(index);
        setInitialData(data);
      } else {
        reset();
      }
    }
  }, [open, editData]);

  const reset = () => {
    setTitle("");
    setMetaTagsItems([{ key: "", value: "" }]);
    setIsEditMode(false);
    setEditIndex(-1);
    setInitialData(null);
  };

  const handleClose = () => {
    if (isEditMode && editIndex > -1 && initialData) {
      onUpdate({ tags: initialData, index: editIndex });
    }
    onClose();
    reset();
  };

  const addMetaTag = () => {
    setMetaTagsItems([...metaTagsItems, { key: "", value: "" }]);
  };

  const deleteMetaTag = (index: number) => {
    if (metaTagsItems.length <= 1) {
      // Show error - minimum one meta tag should be present
      return;
    }
    
    if (metaTagsItems[index].key === "" && metaTagsItems[index].value === "") {
      const newItems = metaTagsItems.filter((_, i) => i !== index);
      setMetaTagsItems(newItems);
      return;
    }
    
    // Show confirmation dialog for non-empty items
    const newItems = metaTagsItems.filter((_, i) => i !== index);
    setMetaTagsItems(newItems);
  };

  const updateMetaTagItem = (index: number, field: "key" | "value", value: string) => {
    const newItems = [...metaTagsItems];
    newItems[index][field] = value;
    setMetaTagsItems(newItems);
  };

  const isValidState = () => {
    return (
      metaTagsItems.some((item) => item.key && item.value) && !!title
    );
  };

  const checkSpaceValidation = (value: string) => {
    const spaceRegex = /^(?!.*\s{2,})\S(?:.*\S)?$/i;
    return new RegExp(spaceRegex).test(value.trim());
  };

  const checkNameValid = (value: string) => {
    const regex = /^[a-z0-9 -]+$/i;
    return new RegExp(regex).test(value.trim());
  };

  const checkValidKey = (item: MetaTagItem) => {
    const regex = /^[A-Za-z0-9.,\-_:/;&<>'\s"&lt;&gt;-]*$/i;
    return (
      new RegExp(regex).test(item.key.trim()) &&
      new RegExp(regex).test(item.value.trim())
    );
  };

  const checkValidation = () => {
    for (const item of metaTagsItems) {
      if (!checkSpaceValidation(item.key) || !checkSpaceValidation(item.value)) {
        // Show error: Extra spaces in between characters
        return false;
      }
      
      if (!checkValidKey(item)) {
        // Show error: Allowed: Alphanumeric, punctuations, spaces, and some special characters
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!isValidState()) {
      // Show error: Invalid/Empty Meta Tags
      return;
    }

    if (!checkSpaceValidation(title)) {
      // Show error: Extra spaces in between characters
      return;
    }

    if (!checkNameValid(title)) {
      // Show error: Name can contain only letters, numbers, space and dash(-)
      return;
    }

    if (!checkValidation()) {
      return;
    }

    const trimmedMetaTags = metaTagsItems.map((tag) => ({
      key: tag.key.trim(),
      value: tag.value.trim(),
    }));

    const metaTagsData: MetaTag = {
      title: title.trim(),
      items: trimmedMetaTags,
    };

    if (isEditMode && editIndex > -1) {
      onUpdate({ tags: metaTagsData, index: editIndex });
      onClose();
      return;
    }

    onSave(metaTagsData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit SEO Meta Tag" : "Add SEO Meta Tags"}
      </DialogTitle>
      <DialogContent>
        <NovusInput
          label="Name*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          novusSize="m"
        />

        <Box mt={2}>
          {metaTagsItems.map((item, index) => (
            <Box
              key={index}
              display="flex"
              gap={2}
              alignItems="flex-start"
              mb={2}
            >
              <Box sx={{ flex: 1 }}>
                <NovusInput
                  label="Key*"
                  value={item.key}
                  onChange={(e) => updateMetaTagItem(index, "key", e.target.value)}
                  required
                  novusSize="m"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <NovusInput
                  label="Value*"
                  value={item.value}
                  onChange={(e) => updateMetaTagItem(index, "value", e.target.value)}
                  required
                  novusSize="m"
                />
              </Box>
              {metaTagsItems.length > 1 && (
                <IconButton
                  onClick={() => deleteMetaTag(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        <NovusButton
          variantType="secondary"
          onClick={addMetaTag}
          startIcon={<AddIcon />}
          sx={{ mt: 1 }}
        >
          Add
        </NovusButton>
      </DialogContent>
      <DialogActions>
        <NovusButton onClick={handleClose} variantType="secondary">
          Cancel
        </NovusButton>
        <NovusButton onClick={handleSave}>
          Save
        </NovusButton>
      </DialogActions>
    </Dialog>
  );
};

export default MetaTagsDialog; 