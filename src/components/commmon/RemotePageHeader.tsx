import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NovusButton from '../Novus-MUI-wrappers/NovusButton';

interface RemotePageHeaderProps {
  title: string;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
  disableSave?: boolean;
  saving?: boolean;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const RemotePageHeader: React.FC<RemotePageHeaderProps> = ({
  title,
  onBack,
  onReset,
  onSave,
  disableSave,
  saving,
  helpSlug,
  helpDocsURLs
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleHelpClick = () => {
    const url = helpDocsURLs[helpSlug || 'helpHome'] || helpDocsURLs.helpHome;
    window.open(url, '_blank');
    handleMenuClose();
  };

  return (
    <Box
      bgcolor="#ffffff"
      boxShadow="0 1px 0px 0 rgba(0,0,0,0.1)"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>{title}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <NovusButton variantType="secondary" onClick={onReset}>
          Reset
        </NovusButton>
        <NovusButton
          variantType="primary"
          onClick={onSave}
          disabled={disableSave}
        >
          {saving ? 'Saving...' : 'Save'}
        </NovusButton>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleHelpClick}>Help</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default RemotePageHeader;
