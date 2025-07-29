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
            labelColor={enabled ? "#3f51b5" : "#9b9b9b"}
            checked={enabled}
            onChange={handleToggle}
          />
        }
      />

      <Box bgcolor="#fff" m={3} p={3} borderRadius={'12px'}>
        <Typography
          className="contain-heading"
          fontWeight={700}
          fontSize={14}
          mb={2}
        >
          What is a self-canonical tag?
        </Typography>
        <Typography
          className="contain-desc"
          fontSize={13}
          color="#9b9b9b"
          mb={3}
        >
          A canonical tag is a way of telling search engines that a specific URL
          represents the master copy of a page. A self-referential canonical tag
          is a tag that is defined on the main version of the page; irrespective
          of duplicate pages elsewhere.
        </Typography>
        <Typography
          className="contain-heading top"
          fontWeight={700}
          fontSize={14}
          mb={2}
        >
          How to enable self-canonical tags for my Sales Channel website?
        </Typography>
        <Typography className="contain-desc" fontSize={13} color="#9b9b9b">
          You can enable self-canonical tags on all pages of the Sales Channel
          website by activating the toggle above. Once enabled it will add
          self-reference canonical tags on all pages. In other words, for URL X,
          it will put the tag pointing to X on URL X.
        </Typography>
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
