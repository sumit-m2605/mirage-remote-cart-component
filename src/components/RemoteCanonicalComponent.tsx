import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import NovusSnackbar from "./Novus-MUI-wrappers/NovusSnackbar";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusToggle from "./Novus-MUI-wrappers/NovusToggle";

interface Props {
  fetchCanonicalEnabled: () => Promise<boolean>;
  updateCanonicalEnabled: (value: boolean) => Promise<boolean>;
  onCancel: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const CanonicalTagRemote: React.FC<Props> = ({
  fetchCanonicalEnabled,
  updateCanonicalEnabled,
  onCancel,
  helpSlug,
  helpDocsURLs,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    success: true,
  });

  useEffect(() => {
    fetchCanonicalEnabled()
      .then(setEnabled)
      .catch(() =>
        setSnackbar({
          open: true,
          message: "  Failed to fetch canonical status",
          success: false,
        })
      )
      .finally(() => setLoading(false));
  }, [fetchCanonicalEnabled]);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const success = await updateCanonicalEnabled(value);
    setEnabled(value);
    setSnackbar({
      open: true,
      message: success
        ? `Canonical ${value ? "Enabled" : "Disabled"}`
        : "Canonical update failed",
      success,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <RemotePageHeader
        title="Self Canonical Tag"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <NovusToggle
            label={enabled ? "Canonical Enabled" : "Canonical Disabled"}
            labelPosition="right"
            checked={enabled}
            onChange={handleToggle}
          />
        }
      />

      <Box 
        sx={{
          display: 'flex',
          width: 'auto',
          padding: '16px 0',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          borderRadius: '12px',
          border: '1px solid #E0E0E0',
          background: '#FAFAFA',
          margin: '24px',
        }}
      >
        {/* Title Section */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 24px',
            width: '100%'
          }}
        >
          <Typography 
            sx={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#141414',
              margin: 0
            }}
          >
            What is a self-canonical tag?
          </Typography>
        </Box>

        {/* Divider */}
        <Box 
          sx={{
            width: '100%',
            height: '0',
            borderTop: '1px solid #E0E0E0'
          }}
        />

        {/* Content Section */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '0 24px',
          }}
        >
          <Typography 
            sx={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#5A5A5A',
              margin: 0
            }}
          >
            A canonical tag is a way of telling search engines that a specific URL
            represents the master copy of a page. A self-referential canonical tag
            is a tag that is defined on the main version of the page; irrespective
            of duplicate pages elsewhere.
          </Typography>

          <Typography 
            sx={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#5A5A5A',
              margin: 0
            }}
          >
            You can enable self-canonical tags on all pages of the Sales Channel
            website by activating the toggle above. Once enabled it will add
            self-reference canonical tags on all pages. In other words, for URL X,
            it will put the tag pointing to X on URL X.
          </Typography>
        </Box>
      </Box>

      <NovusSnackbar
        open={snackbar.open}
        severity={snackbar.success ? "success" : "error"}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        closable={false}
      />
    </Box>
  );
};

export default CanonicalTagRemote;
