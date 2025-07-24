import React, { useState, useEffect } from 'react';
import SchemaTemplates from './schema_components/SchemaTemplates';
import SchemaTemplateMain from './schema_components/SchemaTemplateMain';

interface RemoteSchemaComponentProps {
  fetchSchemaTemplates?: (params: any) => Promise<any>;
  fetchSchemaTemplate?: (id: string) => Promise<any>;
  createSchemaTemplate?: (data: any) => Promise<any>;
  updateSchemaTemplate?: (id: string, data: any) => Promise<any>;
  deleteSchemaTemplate?: (id: string) => Promise<any>;
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
  onCancel,
  showSnackbar,
  helpSlug = 'seo',
  helpDocsURLs = { seo: 'https://platform.fynd.com/help/docs/manage-website/seo' }
}: RemoteSchemaComponentProps) => {
  const [currentView, setCurrentView] = useState<'listing' | 'create' | 'edit'>('listing');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleCreateTemplate = () => {
    setCurrentView('create');
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCurrentView('edit');
  };

  const handleBackToListing = () => {
    setCurrentView('listing');
    setSelectedTemplate(null);
  };

  const handleBackToMain = () => {
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
        showSnackbar={showSnackbar}
      />
    );
  }

  return null;
};

export default RemoteSchemaComponent; 