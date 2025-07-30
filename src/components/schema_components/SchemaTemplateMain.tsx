import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import SchemaTemplateVariables from './SchemaTemplateVariables';
import SchemaTemplateEdit from './SchemaTemplateEdit';
import RemotePageHeader from '../commmon/RemotePageHeader';
import NovusButton from '../Novus-MUI-wrappers/NovusButton';
import NovusToggle from '../Novus-MUI-wrappers/NovusToggle';
import './SchemaTemplateVariables.css';

// Color definitions
const COLORS = {
  BACKGROUND: {
    PRIMARY: '#F5F5F5',
  },
  OVERLAY: {
    BACKGROUND: '#00000080',
    TEXT: '#FFFFFF',
  },
};

// Base64 encoding function (same as Vue component)
const base64Encode = (rawData: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(rawData);
  return btoa(String.fromCharCode(...new Uint8Array(data)));
};

interface SchemaTemplateMainProps {
  isEditMode?: boolean;
  schemaId?: string;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  helpSlug?: string;
  helpDocsURLs?: Record<string, string>;
  fetchSchemaTemplate?: (id: string) => Promise<any>;
  createSchemaTemplate?: (data: any) => Promise<any>;
  updateSchemaTemplate?: (id: string, data: any) => Promise<any>;
  getDefaultSEOSchema?: (pageType: string) => Promise<any>;
  showSnackbar?: (message: string, type: 'success' | 'error') => void;
}

const SchemaTemplateMain: React.FC<SchemaTemplateMainProps> = ({
  isEditMode = false,
  schemaId,
  onSave,
  onCancel,
  initialData,
  helpSlug = 'seo',
  helpDocsURLs = { seo: 'https://platform.fynd.com/help/docs/manage-website/seo' },
  fetchSchemaTemplate,
  createSchemaTemplate,
  updateSchemaTemplate,
  getDefaultSEOSchema,
  showSnackbar
}) => {
  const [isActive, setIsActive] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [schemaTemplateData, setSchemaTemplateData] = useState<any>({});
  
  // Refs for child components
  const variablesRef = useRef<any>(null);
  const editRef = useRef<any>(null);

  useEffect(() => {
    if (initialData) {
      console.log('SchemaTemplateMain - initialData received:', initialData);
      setSchemaTemplateData(initialData);
      // Set active state from initial data, default to true if not provided
      setIsActive(initialData.active !== false);
    }
  }, [initialData]);

  const handleVariablesSave = (data: any) => {
    setSchemaTemplateData((prev: any) => ({ ...prev, ...data }));
  };

  const handleEditSave = (data: any) => {
    setSchemaTemplateData((prev: any) => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setPageLoading(true);
    try {
      // Get current data from child components if available
      const currentVariablesData = variablesRef.current?.getCurrentData?.() || {};
      const currentEditData = editRef.current?.getCurrentData?.() || {};
      
      // Merge with existing data
      const currentData = {
        ...schemaTemplateData,
        ...currentVariablesData,
        ...currentEditData
      };
      
      // Basic validation
      if (!currentData?.page_type) {
        showSnackbar?.('Please select a page type', 'error');
        setPageLoading(false);
        return;
      }
      
      if (!currentData?.schema) {
        showSnackbar?.('Please provide schema content', 'error');
        setPageLoading(false);
        return;
      }
      
      if (!currentData?.title) {
        showSnackbar?.('Please provide a title', 'error');
        setPageLoading(false);
        return;
      }

      // Encode schema data using base64 (same as Vue component)
      const encodedSchema = base64Encode(currentData.schema);
      
      const finalData = {
        ...currentData,
        active: isActive,
        schema: encodedSchema // Use encoded schema
      };
      
      console.log('Saving schema template with data:', finalData);
      
      // Call onSave with the prepared data - the parent component will handle the API call
      onSave?.(finalData);
    } catch (error) {
      console.error('Error saving schema template:', error);
      showSnackbar?.('Failed to save schema template', 'error');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const renderActions = () => (
    <Box className="header-actions">
      <Box className="active-toggle-container">
        <NovusToggle
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          label="Active"
          labelPosition="right"
        />
      </Box>
      <NovusButton
        variantType="primary"
        onClick={handleSave}
        disabled={pageLoading}
        novusSize="md"
      >
        {pageLoading ? 'Saving...' : (isEditMode ? 'Save' : 'Create')}
      </NovusButton>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: COLORS.BACKGROUND.PRIMARY, width: '100%' }}>
      <RemotePageHeader
        title={isEditMode ? 'Edit Schema' : 'Create Schema'}
        onBack={handleCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={renderActions()}
      />

      {/* Main Body */}
      <Box 
        className="main-layout"
        sx={{ 
          display: 'flex', 
          padding: '24px',
          gap: '24px',
          minHeight: 'calc(100vh - 80px)',
          width: '100%',
          backgroundColor: COLORS.BACKGROUND.PRIMARY,
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'flex-start',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Container - Variables */}
        <Box 
          className="left-container"
          sx={{ 
            flex: '1 1 0%', 
            minWidth: 0,
            width: '100%'
          }}
        >
          <SchemaTemplateVariables
            ref={variablesRef as any}
            isEditMode={isEditMode}
            schemaId={schemaId}
            onSave={handleVariablesSave}
            initialData={schemaTemplateData}
            fetchSchemaTemplate={fetchSchemaTemplate}
            getDefaultSEOSchema={getDefaultSEOSchema}
          />
        </Box>

        {/* Right Container - Edit Form */}
        <Box 
          className="right-container"
          sx={{ 
            flex: '0 0 auto', 
            width: { xs: '100%', lg: 400 }
          }}
        >
          <SchemaTemplateEdit
            ref={editRef as any}
            isEditMode={isEditMode}
            schemaId={schemaId}
            onSave={handleEditSave}
            initialData={schemaTemplateData}
          />
        </Box>
      </Box>

      {pageLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.OVERLAY.BACKGROUND,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.OVERLAY.TEXT,
            fontSize: '16px',
            zIndex: 1000
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SchemaTemplateMain; 