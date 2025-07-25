import React, { useEffect, useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusToggle from "./Novus-MUI-wrappers/NovusToggle";
import NovusButton from "./Novus-MUI-wrappers/NovusButton";
import CodeEditor from "./commmon/CodeEditor";
import ShimmerLoader from "./commmon/ShimmerLoader";

interface Props {
  fetchSitemapStatus: () => Promise<{ enabled: boolean; content: string }>;
  updateSitemapStatus: (enabled: boolean) => Promise<boolean>;
  updateSitemapContent: (content: string) => Promise<boolean>;
  onCancel: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const SitemapRemote: React.FC<Props> = ({
  fetchSitemapStatus,
  updateSitemapStatus,
  updateSitemapContent,
  onCancel,
  helpSlug,
  helpDocsURLs,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    success: true,
  });

  useEffect(() => {
    fetchSitemapStatus()
      .then(({ enabled, content }) => {
        setEnabled(enabled);
        setContent(content);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "❌ Failed to fetch sitemap info",
          success: false,
        })
      )
      .finally(() => setLoading(false));
  }, [fetchSitemapStatus]);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const success = await updateSitemapStatus(value);
    setEnabled(value);
    setSnackbar({
      open: true,
      message: success
        ? `✅ Sitemap ${value ? "Enabled" : "Disabled"}`
        : "❌ Update failed",
      success,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isValidXML =
        /^<\?xml.*\?>/.test(content.trim()) || content.trim().startsWith("<");
      if (!isValidXML) {
        setSnackbar({
          open: true,
          message: "❌ Invalid Sitemap.xml format",
          success: false,
        });
        return;
      }
      const success = await updateSitemapContent(content);
      setSnackbar({
        open: true,
        message: success
          ? "✅ Sitemap.xml updated successfully"
          : "❌ Failed to update content",
        success,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box p={4}>
        <ShimmerLoader height="200px" />
      </Box>
    );

  return (
    <Box
      className="page-container integration-container"
      display="flex"
      flexDirection="column"
    >
      <RemotePageHeader
        title="Sitemap"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <Box display="flex" alignItems="center" gap={2}>
            <NovusToggle
              label={enabled ? "Sitemaps Enabled" : "Sitemaps Disabled"}
              checked={enabled}
              onChange={handleToggle}
            />
            <NovusButton
              novusSize="s"
              variantType="secondary" onClick={() => setContent("")}>
              Reset
            </NovusButton>
            <NovusButton
            novusSize="s"
              variantType="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </NovusButton>
          </Box>
        }
      />

      <Box
        display="flex"
        flex={1}
        flexDirection={{ xs: "column", md: "row" }}
        padding={3}
        gap={3}
      >
        <Box flex={1}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Custom Sitemap
          </Typography>
          <Typography fontSize={13} color="text.secondary" mb={2}>
            Content added in the custom sitemap below will be integrated into
            the default sitemap and will not replace your default sitemap.
          </Typography>
          <CodeEditor value={content} onChange={setContent} />
        </Box>

        <Box width="30%" p={2} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
          <Typography fontWeight={600} mb={1}>
            What is sitemap?
          </Typography>
          <Typography fontSize="0.875rem" color="text.secondary">
            A sitemap tells search engines how your site is structured. It helps
            search crawlers understand what pages to index. Custom additions
            will be merged with the default sitemap.
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.success ? "success" : "error"}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SitemapRemote;
