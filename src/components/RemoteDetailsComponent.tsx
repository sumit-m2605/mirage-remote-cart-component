import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import NovusSnackbar from "./Novus-MUI-wrappers/NovusSnackbar";
import RemotePageHeader from "./commmon/RemotePageHeader";
import NovusButton from "./Novus-MUI-wrappers/NovusButton";
import SEOComponent from "./seo_components/SEOComponent";
import ShimmerLoader from "./commmon/ShimmerLoader";
import InfoBox from "./commmon/InfoBox";

// Types moved from index.ts
interface SEOData {
  title: string;
  description: string;
  image_url: string;
  breadcrumbs: Array<{
    url?: string;
    action?: any;
  }>;
  sitemap: {
    priority: number;
    frequency: string;
  };
  meta_tags: Array<{
    title: string;
    items: Array<{
      key: string;
      value: string;
    }>;
  }>;
  canonical_url: string;
}

interface AppInfo {
  name?: string;
  description?: string;
  image_url?: string;
  domains?: Array<{
    name: string;
    is_primary: boolean;
  }>;
}

interface SEODataResponse {
  details?: {
    title?: string;
    description?: string;
    image_url?: string;
  };
  sitemap?: {
    priority: number;
    frequency: string;
  };
}

interface Props {
  fetchAppInfo: () => Promise<AppInfo>;
  fetchSEO: () => Promise<{ seo: SEODataResponse }>;
  updateSEO: (data: { details: any; sitemap: any }) => Promise<{ details: any }>;
  generateSEO: (body: any, type: string) => Promise<any>;
  uploadImage?: (file: File) => Promise<string>;
  fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
  fetchBrandImages?: (params: any) => Promise<any>;
  fetchCollectionImages?: (params: any) => Promise<any>;
  fetchProductImages?: (params: any) => Promise<any>;
  onCancel: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const DetailsRemote: React.FC<Props> = ({
  fetchAppInfo,
  fetchSEO,
  updateSEO,
  generateSEO,
  uploadImage,
  fetchGalleryImages,
  fetchBrandImages,
  fetchCollectionImages,
  fetchProductImages,
  onCancel,
  helpSlug,
  helpDocsURLs,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [appInfo, setAppInfo] = useState<AppInfo>({});
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    image_url: "",
    breadcrumbs: [],
    sitemap: {
      priority: 0.5,
      frequency: "never",
    },
    meta_tags: [],
    canonical_url: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    success: true,
  });

  // Computed values
  const primaryDomainName = appInfo.domains?.find((d) => d.is_primary)?.name || "";

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      setLoading(true);
      const [appInfoRes, seoRes] = await Promise.all([
        fetchAppInfo(),
        fetchSEO(),
      ]);

      setAppInfo(appInfoRes);
      
      const { details } = (seoRes && seoRes.seo) || {};
      const { name, description, image_url } = appInfoRes || {};

      // Initialize app details with app info
      let appDetails = {
        title: name || "",
        description: description || "",
        image_url: image_url || "",
      };

      // Override with SEO details if available
      if (details?.title) appDetails.title = details.title;
      if (details?.description) appDetails.description = details.description;
      if (details?.image_url) appDetails.image_url = details.image_url;

      const sitemap = seoRes?.seo?.sitemap || { priority: 0.5, frequency: "never" };

      setSeoData({
        title: appDetails.title,
        description: appDetails.description,
        image_url: appDetails.image_url,
        breadcrumbs: [],
        sitemap,
        meta_tags: [],
        canonical_url: "",
      });
    } catch (error) {
      console.error("Failed to fetch details:", error);
      setPageError(true);
      setSnackbar({
        open: true,
        message: "  Failed to fetch application details",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateSEO({
        details: {
          title: seoData.title,
          description: seoData.description,
          image_url: seoData.image_url,
        },
        sitemap: seoData.sitemap,
      });

      setSnackbar({
        open: true,
        message: "Application details updated successfully",
        success: true,
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `  Failed to update Application Details${
          error && error.message ? ` : ${error.message}` : ""
        }`,
        success: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSEOUpdate = (data: SEOData) => {
    setSeoData(data);
  };

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({
      open: true,
      message: type === "success" ? `${message}` : `  ${message}`,
      success: type === "success",
    });
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <ShimmerLoader height="200px" />
      </Box>
    );
  }

  if (pageError) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error" mb={2}>
          Failed to load application details
        </Typography>
        <NovusButton variantType="secondary" novusSize="sm" onClick={getDetails}>
          Retry
        </NovusButton>
      </Box>
    );
  }

  return (
    <Box
      className="panel"
      display="flex"
      flexDirection="column"
      height="100vh"
    >
      <RemotePageHeader
        title="Edit Application Details"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <NovusButton
            variantType="secondary"
            novusSize="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </NovusButton>
        }
      />

      <Box
        display="flex"
        flex={1}
        flexDirection={{ xs: "column", md: "row" }}
        p={3}
        gap={3}
      >
        {/* Main Content */}
        <Box
          flex={1}
          sx={{
            width: { xs: "100%", md: "70%" },
          }}
        >
          <SEOComponent
            value={seoData}
            url={`https://${primaryDomainName}`}
            text={`https://${primaryDomainName}`}
            type="website"
            showImageUploader={true}
            sitemapEnabled={true}
            breadcrumbEnabled={false}
            metaTagsEnabled={false}
            canonicalUrlEnabled={false}
            onUpdate={handleSEOUpdate}
            generateSEO={generateSEO}
            showSnackbar={showSnackbar}
            uploadImage={uploadImage}
            fetchGalleryImages={fetchGalleryImages}
            fetchBrandImages={fetchBrandImages}
            fetchCollectionImages={fetchCollectionImages}
            fetchProductImages={fetchProductImages}
          />
        </Box>

        {/* Help Section */}
        <InfoBox 
          title="Where will Application details be used?"
          listItems={[
            "Enter the application details (e.g. name of sales channel) that will be used in the meta fields i.e. title and description of all your web pages.",
            "These details will be used by default unless you specify custom SEO fields for your web pages."
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

export default DetailsRemote; 