import React, { useRef, useEffect } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco && editorRef.current) {
      // Accessing editor instance
      const editor = editorRef.current;
      
      // Set initial value
      editor.setValue(value);

      // Handle editor content change
      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });
    }
  }, [monaco, onChange, value]);

  const handleSetEditorValue = (newValue) => {
    if (editorRef.current) {
      editorRef.current.setValue(newValue);
    }
  };

  const handleGetEditorValue = () => {
    if (editorRef.current) {
      return editorRef.current.getValue();
    }
    return '';
  };

  const handleFocusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <Editor
      ref={editorRef}
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
