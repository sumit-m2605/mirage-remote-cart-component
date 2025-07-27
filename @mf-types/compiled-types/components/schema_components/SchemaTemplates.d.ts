import React from 'react';
interface SchemaTemplatesProps {
    onBack: () => void;
    onCreateTemplate: () => void;
    onEditTemplate: (template: any) => void;
    helpSlug?: string;
    helpDocsURLs?: Record<string, string>;
    fetchSchemaTemplates?: (params: any) => Promise<any>;
}
declare const SchemaTemplates: React.FC<SchemaTemplatesProps>;
export default SchemaTemplates;
