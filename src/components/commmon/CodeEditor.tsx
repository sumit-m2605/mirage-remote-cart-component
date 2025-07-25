import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  height?: string;
  placeholder?: string;
  language?: 'json' | 'xml' | 'schema';
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '300px',
  placeholder = '',
  language = 'json',
  readOnly = false,
  theme = 'dark',
}: CodeEditorProps) => {
  const extensions = language === 'json' || language === 'schema' ? [json()] : [xml()];

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={theme}
      placeholder={placeholder}
      extensions={extensions}
      onChange={(val) => onChange(val)}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: false,
        lineWrapping: true,
      }}
    />
  );
};

export default CodeEditor; 