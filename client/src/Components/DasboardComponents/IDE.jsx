import React, { useState, useRef, useEffect } from 'react';
import { Button, Grid, Icon, IconButton, Typography } from '@mui/material';
import FileTree from '../IDEComponents/FileTree';
import CodeEditor from '../IDEComponents/CodeEditor';
import Terminal from '../IDEComponents/TerminalComponent';
import { useParams } from 'react-router-dom';
import axios from "axios"
import { useUser } from '@clerk/clerk-react';
import buildTree from '../../Utils/TreeStrcuture';
import { useCurrentCode } from '../../Context/CurrentCodeContext';
import detectLanguages from '../../Utils/languageDetector';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from '../CustomUIComponents/FormDialog';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SaveIcon from '@mui/icons-material/Save';
import { SocketContextProvider } from '../../Context/SocketContext';

const IDE = () => {
  const [language, setLanguage] = useState('javascript');
  const codeEditorRef = useRef(null);
  const {projectID} = useParams();
  const {user} = useUser();
  const [files, setFiles] = useState([]);
  const [fileStructure, setFileStructure] = useState(null);
  const {currentCode, setCurrentCode, currentFilePath, setprojectPath} = useCurrentCode();

  const handleCodeChange = (newValue, event) => {
    setCurrentCode(newValue);
  };

  // useEffect(() => {
  //   console.log(detectLanguages(currentCode))
  // },[currentCode])

  async function fetchProjectData(){
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/project/${projectID}/${user.id}`);
    //console.log(`${process.env.REACT_APP_API_URL}/project/${projectID}/${user.id}`)
    //console.log(response)
    if(response.data.success === true)
      {setFiles(response.data.Data);
        setprojectPath(response.data.projectData.ProjectPath)
        setFileStructure(buildTree(response.data.Data, response.data.projectData.Projectname));

      }
    else{
      alert(response.data.message)
      console.log(response)
    }
  }

  useEffect(() => {
    fetchProjectData();

  },[])

  const handleCurrentFileSave = async() => {
    const payload = {
      filePath : currentFilePath,
      fileContents : currentCode,
      clerkID : user.id
    }

      if (payload.filePath === "") {
        alert("Please select a file to save");
        return; // Exit the function early if filePath is empty
      }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/save-file`, payload);
    console.log(response)
  }

  const handleTerminalData = (data) => {
    console.log(data);
    // Handle terminal input, send commands to server, etc.
  };

  const handleRunCode = () => {
    // const currentCode = codeEditorRef.current.handleGetEditorValue();
    // console.log('Running code:', currentCode);
    // // Implement code execution logic here
    //console.log(code)
  };

  return (
    <SocketContextProvider>

    <Grid container spacing={1} style={{ height: '100vh' }}>
      <Grid item xs={2}>
      <IconButton
      
      onClick={() => {
        const fileName = prompt("Enter file name alogn with its extension");
        if(fileName && fileName.includes('.'))
          {
          console.log("Creating "+fileName)
        }
        else{
          alert("Invalid file name")
        }
      }}
      >
      <Icon>
        <NoteAddIcon />
      </Icon>
    </IconButton>

        <IconButton>
          <Icon>
              <CreateNewFolderIcon />
          </Icon>
        </IconButton>

        <IconButton >
          <Icon>
              <DeleteIcon />
          </Icon>
        </IconButton>

        <IconButton>
          <Icon>
            <DriveFileRenameOutlineIcon />
          </Icon>
        </IconButton>

       
      {(fileStructure!=null && files!= null) && (<>
        <FileTree  fileStructure={fileStructure} files={files}/>
      </>)}
      </Grid>
      <Grid item xs={7}>
        
        <CodeEditor
          ref={codeEditorRef}
          language={language}
          value={currentCode}
          onChange={handleCodeChange}
          />
      </Grid>
      <Grid item xs={3}>
      <Button variant='contained' style={{
        marginBottom : "5px",
        marginTop : "5px"
      }} onClick={handleCurrentFileSave}>
          Save current file
        </Button>
        <Terminal onData={handleTerminalData} />
        
      </Grid>
    </Grid>
        </SocketContextProvider>
  );
};

export default IDE;
