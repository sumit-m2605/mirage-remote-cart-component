// REMOTE COMPONENT: src/components/RemoteRobotsTxtComponent.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusButton from "./Novus-MUI-wrappers/NovusButton";
import CodeEditor from "./commmon/CodeEditor";

interface Props {
  fetchRobotsTxt: () => Promise<string>;
  saveRobotsTxt: (text: string) => Promise<void>;
  onCancel: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const RobotsTxtRemote: React.FC<Props> = ({
  fetchRobotsTxt,
  saveRobotsTxt,
  onCancel,
  helpSlug,
  helpDocsURLs,
}) => {
  const [robotsTxt, setRobotsTxt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    success: true,
  });

  useEffect(() => {
    fetchRobotsTxt()
      .then((txt) => setRobotsTxt(txt))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "❌ Failed to load robots.txt",
          success: false,
        })
      )
      .finally(() => setLoading(false));
  }, [fetchRobotsTxt]);

  const handleReset = () => {
    setRobotsTxt("User-agent: *\nDisallow: /");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveRobotsTxt(robotsTxt);
      setSnackbar({
        open: true,
        message: "✅ Robots.txt updated successfully",
        success: true,
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `❌ Failed to update Robots.txt${
          err?.message ? " : " + err.message : ""
        }`,
        success: false,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      className="page-container integration-container"
      display="flex"
      flexDirection="column"
    >
      <RemotePageHeader
        title="Edit Robots.txt"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <>
            <NovusButton variantType="secondary" onClick={handleReset}>
              Reset
            </NovusButton>
            <NovusButton
              variantType="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </NovusButton>
          </>
        }
      />

      <Box
        display="flex"
        flex={1}
        padding={2}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
      >
        <Box flex={{ xs: "1 1 100%", md: "0 1 70%" }}>
          <CodeEditor
            value={robotsTxt}
            onChange={setRobotsTxt}
            placeholder="Paste robots.txt content here..."
            height="300px"
          />
        </Box>

        <Box flex={{ xs: "1 1 100%", md: "0 1 30%" }}>
          <Box p={2} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
            <Typography fontWeight={600} mb={1}>
              What is Robots.txt?
            </Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              A robots.txt file tells search engines which pages not to index.
              Learn more from Google Search docs.
            </Typography>
          </Box>
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

export default RobotsTxtRemote;
