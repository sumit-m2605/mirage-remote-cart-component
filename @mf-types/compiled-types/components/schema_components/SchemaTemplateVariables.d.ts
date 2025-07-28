import React from "react";
interface SchemaTemplateVariablesProps {
    isEditMode?: boolean;
    schemaId?: string;
    onSave?: (data: any) => void;
    initialData?: any;
    fetchSchemaTemplate?: (id: string) => Promise<any>;
    getDefaultSEOSchema?: (pageType: string) => Promise<any>;
}
declare const SchemaTemplateVariables: React.ForwardRefExoticComponent<SchemaTemplateVariablesProps & React.RefAttributes<any>>;
export default SchemaTemplateVariables;
