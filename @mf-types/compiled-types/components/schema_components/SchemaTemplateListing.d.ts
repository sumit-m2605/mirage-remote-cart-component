import React from "react";
interface SchemaTemplate {
    _id: string;
    title: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    schema?: string;
    page_type?: string;
    target_json?: string | object;
}
interface SchemaTemplateListingProps {
    onEditTemplate: (template: SchemaTemplate) => void;
    fetchSchemaTemplates?: (params: any) => Promise<any>;
}
declare const SchemaTemplateListing: React.FC<SchemaTemplateListingProps>;
export default SchemaTemplateListing;
