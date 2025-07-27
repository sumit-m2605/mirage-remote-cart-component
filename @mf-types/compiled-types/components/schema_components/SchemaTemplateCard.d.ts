import React from 'react';
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
interface SchemaTemplateCardProps {
    template: SchemaTemplate;
    onEdit: (template: SchemaTemplate) => void;
}
declare const SchemaTemplateCard: React.FC<SchemaTemplateCardProps>;
export default SchemaTemplateCard;
