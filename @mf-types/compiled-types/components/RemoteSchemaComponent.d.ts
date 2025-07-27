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
declare const RemoteSchemaComponent: ({ fetchSchemaTemplates, fetchSchemaTemplate, createSchemaTemplate, updateSchemaTemplate, deleteSchemaTemplate, onCancel, showSnackbar, helpSlug, helpDocsURLs }: RemoteSchemaComponentProps) => import("react/jsx-runtime").JSX.Element | null;
export default RemoteSchemaComponent;
