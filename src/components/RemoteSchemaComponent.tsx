import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SchemaTemplates from './schema_components/SchemaTemplates';
import SchemaTemplateMain from './schema_components/SchemaTemplateMain';

interface RemoteSchemaComponentProps {
  fetchSchemaTemplates?: (params: any) => Promise<any>;
  fetchSchemaTemplate?: (id: string) => Promise<any>;
  createSchemaTemplate?: (data: any) => Promise<any>;
  updateSchemaTemplate?: (id: string, data: any) => Promise<any>;
  deleteSchemaTemplate?: (id: string) => Promise<any>;
  getDefaultSEOSchema?: (pageType: string) => Promise<any>;
  onCancel?: () => void;
  showSnackbar?: (message: string, type: 'success' | 'error') => void;
  helpSlug?: string;
  helpDocsURLs?: Record<string, string>;
}

const RemoteSchemaComponent = ({
  fetchSchemaTemplates,
  fetchSchemaTemplate,
  createSchemaTemplate,
  updateSchemaTemplate,
  deleteSchemaTemplate,
  getDefaultSEOSchema,
  onCancel,
  showSnackbar,
  helpSlug = 'seo',
  helpDocsURLs = { seo: 'https://platform.fynd.com/help/docs/manage-website/seo' }
}: RemoteSchemaComponentProps) => {
  const [currentView, setCurrentView] = useState<'listing' | 'create' | 'edit'>('listing');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Scroll to top when component mounts and when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleCreateTemplate = () => {
    setCurrentView('create');
  };

  const handleEditTemplate = async (template: any) => {
    try {
      setEditLoading(true);
      console.log('RemoteSchemaComponent - handleEditTemplate called with:', template);
      
      // If we have fetchSchemaTemplate function, fetch the complete template data
      if (fetchSchemaTemplate && template._id) {
        const response = await fetchSchemaTemplate(template._id);
        console.log('RemoteSchemaComponent - fetchSchemaTemplate response:', response);
        
        // Handle different response structures
        const completeTemplate = response?.data || response;
        console.log('RemoteSchemaComponent - complete template extracted:', completeTemplate);
        setSelectedTemplate(completeTemplate);
      } else {
        // Fallback to the template data from listing
        console.log('RemoteSchemaComponent - using template from listing:', template);
        setSelectedTemplate(template);
      }
      setCurrentView('edit');
    } catch (error) {
      console.error('Error fetching complete template data:', error);
      // Fallback to the template data from listing
      setSelectedTemplate(template);
      setCurrentView('edit');
    } finally {
      setEditLoading(false);
    }
  };

  const handleBackToListing = () => {
    setCurrentView('listing');
    setSelectedTemplate(null);
  };

  const handleBackToMain = () => {
    // Scroll to top when going back to main view
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onCancel?.();
  };

  const handleSaveTemplate = async (data: any) => {
    try {
      if (currentView === 'create' && createSchemaTemplate) {
        await createSchemaTemplate(data);
        showSnackbar?.('Schema template created successfully', 'success');
      } else if (currentView === 'edit' && selectedTemplate && updateSchemaTemplate) {
        await updateSchemaTemplate(selectedTemplate._id, data);
        showSnackbar?.('Schema template updated successfully', 'success');
      }
      
      // Return to listing after successful save
      setCurrentView('listing');
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      showSnackbar?.('Failed to save schema template', 'error');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      if (deleteSchemaTemplate) {
        await deleteSchemaTemplate(templateId);
        showSnackbar?.('Schema template deleted successfully', 'success');
        // Refresh listing if needed
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      showSnackbar?.('Failed to delete schema template', 'error');
    }
  };

  // Render based on current view
  if (currentView === 'listing') {
    return (
      <SchemaTemplates
        onBack={handleBackToMain}
        onCreateTemplate={handleCreateTemplate}
        onEditTemplate={handleEditTemplate}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        fetchSchemaTemplates={fetchSchemaTemplates}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <SchemaTemplateMain
        isEditMode={false}
        onSave={handleSaveTemplate}
        onCancel={handleBackToListing}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        fetchSchemaTemplate={fetchSchemaTemplate}
        createSchemaTemplate={createSchemaTemplate}
        updateSchemaTemplate={updateSchemaTemplate}
        getDefaultSEOSchema={getDefaultSEOSchema}
        showSnackbar={showSnackbar}
      />
    );
  }

  if (currentView === 'edit' && selectedTemplate) {
    return (
      <SchemaTemplateMain
        isEditMode={true}
        schemaId={selectedTemplate._id}
        initialData={selectedTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleBackToListing}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        fetchSchemaTemplate={fetchSchemaTemplate}
        createSchemaTemplate={createSchemaTemplate}
        updateSchemaTemplate={updateSchemaTemplate}
        getDefaultSEOSchema={getDefaultSEOSchema}
        showSnackbar={showSnackbar}
      />
    );
  }

  if (currentView === 'edit' && editLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading template details...</Typography>
      </Box>
    );
  }

  if (currentView === 'edit' && !selectedTemplate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>No template selected. Please go back and try again.</Typography>
      </Box>
    );
  }

  return null;
};

export default RemoteSchemaComponent; 