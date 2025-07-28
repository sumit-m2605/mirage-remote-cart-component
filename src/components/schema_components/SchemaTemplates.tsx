import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import RemotePageHeader from '../commmon/RemotePageHeader';
import NovusButton from '../Novus-MUI-wrappers/NovusButton';
import SchemaTemplateListing from './SchemaTemplateListing';

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
  helpSlug = 'seo',
  helpDocsURLs = { seo: 'https://platform.fynd.com/help/docs/manage-website/seo' },
  fetchSchemaTemplates
}) => {
  const renderActions = () => (
    <></>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <RemotePageHeader
        title="Schema"
        onBack={onBack}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={renderActions()}
      />

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px',
        overflow: 'hidden'
      }}>
        {/* Schema Description Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            alignSelf: 'stretch',
            borderRadius: '12px',
            border: '1px solid #ffffff',
            background: '#ffffff',
            marginBottom: '24px',
            flexShrink: 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '18px 24px',
              alignItems: 'center',
              gap: 6,
              alignSelf: 'stretch'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                flex: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography
                  sx={{
                    color: '#5C5C5C',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    flex: 1
                  }}
                >
                  Use this section to create Schema templates to be used in SEO to improve the visibility, credibility, and user engagement of the storefront's content in search engine results. Format the Schema content, by using sample variables.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                padding: '9.5px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.25
              }}
            >
              <NovusButton
                variantType="secondary"
                onClick={onCreateTemplate}
              >
                Create
              </NovusButton>
            </Box>
          </Box>
        </Box>

        {/* Main Content - Only Listing */}
        <Box sx={{ 
          backgroundColor: '#ffffff', 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
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