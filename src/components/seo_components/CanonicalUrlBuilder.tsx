import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import { NovusInput } from "../Novus-MUI-wrappers";

interface Props {
  canonicalUrlPath: string;
  canonicalUrlDomain: string;
  onUpdateCanonicalUrlPath: (data: { canonical_url: string }) => void;
}

const CanonicalUrlBuilder: React.FC<Props> = ({
  canonicalUrlPath,
  canonicalUrlDomain,
  onUpdateCanonicalUrlPath,
}) => {
  const [urlPath, setUrlPath] = useState(canonicalUrlPath);
  const [urlDomain, setUrlDomain] = useState(canonicalUrlDomain);

  useEffect(() => {
    setUrlPath(canonicalUrlPath);
    setUrlDomain(canonicalUrlDomain);
  }, [canonicalUrlPath, canonicalUrlDomain]);

  const handleUrlPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = event.target.value;
    setUrlPath(newPath);
    
    // Debounced update
    const timeoutId = setTimeout(() => {
      onUpdateCanonicalUrlPath({ canonical_url: newPath });
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const tooltipText = "A canonical url is the best representation page of a group of duplicate pages";

  return (
    <Box mt={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} color="#41434C">
          Canonical URL
        </Typography>
        <Tooltip title={tooltipText} arrow>
          <IconButton size="small" sx={{ ml: 1 }}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box sx={{ width: "30%" }}>
          <NovusInput
            label="Domain"
            value={urlDomain}
            disabled
            novusSize="m"
          />
        </Box>
        <Box sx={{ width: "70%" }}>
          <NovusInput
            label="Path"
            value={urlPath}
            onChange={handleUrlPathChange}
            placeholder="Enter canonical url path"
            novusSize="m"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CanonicalUrlBuilder; 