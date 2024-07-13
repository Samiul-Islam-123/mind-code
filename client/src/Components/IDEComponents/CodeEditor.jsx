import React, { useRef, useEffect } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange }) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  // Define onSave function
  const onSave = async () => {
    if (editorRef.current) {
      console.log('Saving...');
      try {
        // Example: Making an API call using axios
        // const response = await axios.post('/api/save', { code: editorRef.current.getValue() });
        // console.log(response.data);
      } catch (error) {
        console.error('Error saving:', error);
      }
    }
  };

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

      // Adding keydown event listener for Ctrl + S
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault(); // Prevent default browser save action
          onSave(); // Call onSave function
        }
      };

      // Ensure editor is focused to capture key events
      editor.focus();

      // Add keydown listener to editor instance
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, onSave);

      // Add event listener for keydown
      editor.onKeyDown(handleKeyDown);

      return () => {
        editor.removeKeyDownListener(handleKeyDown);
      };
    }
  }, [monaco, onChange, onSave, value]);

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
