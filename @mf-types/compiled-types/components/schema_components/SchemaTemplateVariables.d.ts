interface SchemaTemplateVariablesProps {
    isEditMode?: boolean;
    schemaId?: string;
    onSave?: (data: any) => void;
    initialData?: any;
    fetchSchemaTemplate?: (id: string) => Promise<any>;
    getDefaultSEOSchema?: (pageType: string) => Promise<any>;
}
declare const SchemaTemplateVariables: import("react").ForwardRefExoticComponent<SchemaTemplateVariablesProps & import("react").RefAttributes<any>>;
export default SchemaTemplateVariables;
