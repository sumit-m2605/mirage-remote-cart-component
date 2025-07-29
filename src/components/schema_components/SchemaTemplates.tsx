import React from "react";
import { Box, Typography, Container } from "@mui/material";
import RemotePageHeader from "../commmon/RemotePageHeader";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";
import SchemaTemplateListing from "./SchemaTemplateListing";

interface SchemaTemplatesProps {
  onBack: () => void;
  onCreateTemplate: () => void;
  onEditTemplate: (template: any) => void;
  helpSlug?: string;
  helpDocsURLs?: Record<string, string>;
  fetchSchemaTemplates?: (params: any) => Promise<any>;
}

const SchemaTemplates: React.FC<SchemaTemplatesProps> = ({
  onBack,
  onCreateTemplate,
  onEditTemplate,
  helpSlug = "seo",
  helpDocsURLs = {
    seo: "https://platform.fynd.com/help/docs/manage-website/seo",
  },
  fetchSchemaTemplates,
}) => {
  const renderActions = () => (
    <>
      <NovusButton
        variantType="primary"
        onClick={onCreateTemplate}
        novusSize="md"
      >
        Create
      </NovusButton>
    </>
  );

  return (
    <Box sx={{ 
      display: "flex",
      flexDirection: "column",
      bgcolor: "#F5F5F5",
      height: "100%",
      minHeight: "100%",
    }}>
      <RemotePageHeader
        title="Schema"
        onBack={onBack}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={renderActions()}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          overflow: "auto",
        }}
      >
        {/* Main Content - Only Listing */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: "12px",
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <SchemaTemplateListing
            onEditTemplate={onEditTemplate}
            fetchSchemaTemplates={fetchSchemaTemplates}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SchemaTemplates;
