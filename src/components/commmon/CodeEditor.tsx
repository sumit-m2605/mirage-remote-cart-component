import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';

const CodeEditor = ({
  value,
  onChange,
  height = '300px',
  placeholder = '',
}: {
  value: string;
  onChange: (val: string) => void;
  height?: string;
  placeholder?: string;
}) => {
  return (
    <CodeMirror
      value={value}
      height={height}
      theme="dark"
      placeholder={placeholder}
      extensions={[xml()]}
      onChange={(val) => onChange(val)}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
      }}
    />
  );
};

export default CodeEditor;
