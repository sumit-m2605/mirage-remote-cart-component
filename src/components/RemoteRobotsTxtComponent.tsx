// REMOTE COMPONENT: src/components/RemoteRobotsTxtComponent.tsx
import React, { useEffect, useState } from "react";
import root from 'window-or-global';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusButton from "./Novus-MUI-wrappers/NovusButton";
import CodeEditor from "./commmon/CodeEditor";
import AlertBox from "./commmon/AlertBox";
import ShimmerLoader from "./commmon/ShimmerLoader";

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
        title="Edit Robots.txt"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <>
            <NovusButton variantType="secondary" novusSize="s" onClick={handleReset}>
              Reset
            </NovusButton>
            <NovusButton
              variantType="primary"
              novusSize="s"
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
        flexDirection="column"
        flex={1}
        padding={2}
        gap={2}
      >
{/* 
xxx
        {console.log('root:', root)}
        {console.log('root.env:', root.env)}
        {console.log('root.env?.BROWSER_CONFIG:', root.env?.BROWSER_CONFIG)}
        {root.env?.FYND_PLATFORM_DOMAIN || 'pppp'}
   xxx */}
        <AlertBox showCloseButton={false}>
          A robots.txt file tells search engines which pages not to index. Learn more from Google Search docs.
        </AlertBox>

        <Box>
          <CodeEditor
            value={robotsTxt}
            onChange={setRobotsTxt}
            placeholder="Paste robots.txt content here..."
            height="300px"
          />
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
