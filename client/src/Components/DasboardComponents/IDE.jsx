import React, { useState, useRef } from 'react';
import { Grid } from '@mui/material';
import FileTree from '../IDEComponents/FileTree';
import CodeEditor from '../IDEComponents/CodeEditor';
import Terminal from '../IDEComponents/TerminalComponent';

const IDE = () => {
  const [code, setCode] = useState('// Start coding...');
  const [language, setLanguage] = useState('javascript');
  const codeEditorRef = useRef(null);

  const handleCodeChange = (newValue, event) => {
    setCode(newValue);
  };

  const handleTerminalData = (data) => {
    console.log(data);
    // Handle terminal input, send commands to server, etc.
  };

  const handleRunCode = () => {
    // const currentCode = codeEditorRef.current.handleGetEditorValue();
    // console.log('Running code:', currentCode);
    // // Implement code execution logic here
    console.log(code)
  };

  return (
    <Grid container spacing={1} style={{ height: '100vh' }}>
      <Grid item xs={3}>
        <FileTree />
      </Grid>
      <Grid item xs={6}>
        <CodeEditor
          ref={codeEditorRef}
          language={language}
          value={code}
          onChange={handleCodeChange}
        />
      </Grid>
      <Grid item xs={3}>
        <Terminal onData={handleTerminalData} />
        <button onClick={handleRunCode}>Run Code</button>
      </Grid>
    </Grid>
  );
};

export default IDE;
