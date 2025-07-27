import React from 'react';
import './SchemaTemplateVariables.css';
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
declare const SchemaTemplateMain: React.FC<SchemaTemplateMainProps>;
export default SchemaTemplateMain;
