import React, { useRef, useEffect } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { useCurrentCode } from '../../Context/CurrentCodeContext';

const CodeEditor = ({ language, value, onChange }) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const {currentFilePath} = useCurrentCode();

  const fileExtensions = [
    { extension: 'html', language: 'html' },
    { extension: 'css', language: 'css' },
    { extension: 'js', language: 'javascript' },
    { extension: 'jsx', language: 'javascript' }, // React is still JavaScript
    { extension: 'ts', language: 'typescript' },
    { extension: 'tsx', language: 'typescript' }, // React with TypeScript is still TypeScript
    { extension: 'json', language: 'json' },
    { extension: 'xml', language: 'xml' },
    { extension: 'md', language: 'markdown' },
    { extension: 'py', language: 'python' },
    { extension: 'rb', language: 'ruby' },
    { extension: 'php', language: 'php' },
    { extension: 'java', language: 'java' },
    { extension: 'c', language: 'c' },
    { extension: 'cpp', language: 'cpp' },
    { extension: 'cs', language: 'csharp' },
    { extension: 'go', language: 'go' },
    { extension: 'rs', language: 'rust' },
    { extension: 'swift', language: 'swift' },
    { extension: 'kt', language: 'kotlin' },
    { extension: 'dart', language: 'dart' },
    { extension: 'sql', language: 'sql' },
    { extension: 'sh', language: 'shell' },
    { extension: 'bat', language: 'bat' },
    { extension: 'pl', language: 'perl' },
    { extension: 'r', language: 'r' },
    { extension: 'm', language: 'matlab' },
    { extension: 'vb', language: 'vb' },
    { extension: 'scala', language: 'scala' },
    { extension: 'lua', language: 'lua' },
    { extension: 'groovy', language: 'groovy' },
    { extension: 'coffee', language: 'coffeescript' },
    { extension: 'yaml', language: 'yaml' },
    { extension: 'yml', language: 'yaml' },
    { extension: 'ini', language: 'ini' },
    { extension: 'toml', language: 'toml' },
    { extension: 'dockerfile', language: 'dockerfile' },
    { extension: 'makefile', language: 'makefile' },
    { extension: 'gradle', language: 'gradle' },
    { extension: 'h', language: 'c' }, // Header files can be handled as C
    { extension: 'hpp', language: 'cpp' }, // Header files can be handled as C++
    { extension: 's', language: 'assembly' },
    { extension: 'asm', language: 'assembly' }
];


  function getLanguage(filePath) {
    if(filePath){

      const extension = (filePath.split(".")[1]);
      const foundElement = fileExtensions.filter((item) => item.extension === extension)
      return (foundElement[0].language);
    }
  }

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

      //getLanguage(currentFilePath)


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

  useEffect(() => {
    getLanguage(currentFilePath)

  },[currentFilePath])

  return (
    <Editor
      ref={editorRef}
      height="100%"
      language={getLanguage(currentFilePath)}
      theme="vs-dark"
      value={value}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
