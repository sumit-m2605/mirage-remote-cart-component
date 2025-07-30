// REMOTE COMPONENT: src/components/RemoteRobotsTxtComponent.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
} from "@mui/material";
import NovusSnackbar from "./Novus-MUI-wrappers/NovusSnackbar";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusButton from "./Novus-MUI-wrappers/NovusButton";
import CodeEditor from "./commmon/CodeEditor";
import ShimmerLoader from "./commmon/ShimmerLoader";
import InfoBox from "./commmon/InfoBox";

// Color constants
const COLORS = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5'
  },
  border: '#FAFAFA'
} as const;

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
          message: "  Failed to load robots.txt",
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
        message: "Robots.txt updated successfully",
        success: true,
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: `  Failed to update Robots.txt${
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
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <ShimmerLoader height="200px" />
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor={COLORS.background.secondary}
      height="100%"
    >
      <RemotePageHeader
        title="Edit Robots.txt"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <>
            <NovusButton 
              variantType="secondary" 
              novusSize="md" 
              onClick={handleReset}>
              Reset
            </NovusButton>
            <NovusButton
              variantType="primary"
              novusSize="md"
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
        flexDirection={{ xs: 'column', md: 'row' }}
        flex={1}
        padding={{ xs: '16px', sm: '20px', md: '24px' }}
        gap={{ xs: '16px', sm: '18px', md: '20px' }}
        overflow="auto"
        minHeight={0}
      >
        
        <Box
        bgcolor={COLORS.background.primary}
        borderRadius={{ xs: '8px', sm: '10px', md: '12px' }}
        border={`1px solid ${COLORS.border}`}
        padding={{ xs: '16px', sm: '20px', md: '24px' }}
        height={'fit-content'}
        flex={{ xs: "1 1 100%", md: "0 1 70%" }}
        sx={{
          '& .CodeMirror': {
            height: { xs: '250px', sm: '280px', md: '300px' } as any,
          }
        }}
        >
          <CodeEditor
            value={robotsTxt}
            onChange={setRobotsTxt}
            placeholder="Paste robots.txt content here..."
            height="300px"
            theme="dark"
          />
        </Box>

        <InfoBox 
          title="What is Robot.txt?"
          listItems={[
            "A robots.txt file specifies the pages or files that a search engine crawler is allowed/prohibited to request from your site.",
            "This is mainly used to avoid overloading your site with requests; however, it's not a mechanism of keeping your web page away from search engines, e.g. Google.",
            "To keep a web page out of search engines, you should use noindex directives, or add a password protection to your page."
          ]}
          listStyle="bullet"
          flex={{ xs: "1 1 100%", md: "0 1 30%" }}
        />

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

export default RobotsTxtRemote;
