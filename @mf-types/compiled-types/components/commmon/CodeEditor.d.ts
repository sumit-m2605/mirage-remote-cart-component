import React from 'react';
interface CodeEditorProps {
    value: string;
    onChange: (val: string) => void;
    height?: string;
    placeholder?: string;
    language?: 'json' | 'xml' | 'schema';
    readOnly?: boolean;
    theme?: 'light' | 'dark';
}
declare const CodeEditor: React.FC<CodeEditorProps>;
export default CodeEditor;
