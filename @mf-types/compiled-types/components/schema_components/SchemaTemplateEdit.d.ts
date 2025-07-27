import './SchemaTemplateVariables.css';
interface SchemaTemplateEditProps {
    isEditMode?: boolean;
    schemaId?: string;
    onSave?: (data: any) => void;
    initialData?: any;
    systemDisableEdit?: boolean;
}
declare const SchemaTemplateEdit: import("react").ForwardRefExoticComponent<SchemaTemplateEditProps & import("react").RefAttributes<any>>;
export default SchemaTemplateEdit;
