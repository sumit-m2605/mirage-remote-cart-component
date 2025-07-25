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
import InfoBox from "./commmon/InfoBox";

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
      bgcolor={'#F5F5F5'}
    >
      <RemotePageHeader
        title="Sitemap"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <Box display="flex" alignItems="center" gap={1}>
            <NovusToggle
              label={enabled ? "Sitemaps Enabled" : "Sitemaps Disabled"}
              checked={enabled}
              onChange={handleToggle}
            />
            <NovusButton
              novusSize="sm"
              variantType="secondary" onClick={() => setContent("")}>
              Reset
            </NovusButton>
            <NovusButton
            novusSize="sm"
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
        flexDirection="row"
        flex={1}
        padding={'24px'}
        gap={'20px'}
      >
        <Box
          bgcolor={'#FFFFFF'}
          borderRadius={'12px'}
          border={'1px solid #FAFAFA'}
          padding={'24px'}
          height={'fit-content'}
          flex={{ xs: "1 1 100%", md: "0 1 70%" }}
        >
          <Typography variant="h6" fontWeight={600} mb={1}>
            Custom Sitemap
          </Typography>
          <Typography fontSize={13} color="text.secondary" mb={2}>
            Content added in the custom sitemap below will be integrated into
            the default sitemap and will not replace your default sitemap.
          </Typography>
          <CodeEditor 
            value={content} 
            onChange={setContent}
            placeholder="Paste sitemap.xml content here..."
            height="300px"
            theme="light"
          />
        </Box>

        <InfoBox 
          title="What is Sitemap?"
          listItems={[
            "A sitemap tells search engines how your site is structured and helps search crawlers understand what pages to index.",
            "It provides a list of all the important pages on your website, making it easier for search engines to discover and crawl your content.",
            "Custom additions will be merged with the default sitemap and will not replace your existing sitemap structure."
          ]}
          listStyle="bullet"
          flex={{ xs: "1 1 100%", md: "0 1 30%" }}
        />
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
