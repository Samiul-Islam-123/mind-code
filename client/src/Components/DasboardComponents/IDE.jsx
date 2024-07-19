import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Checkbox, CircularProgress, FormControlLabel, Grid, Icon, IconButton, Typography } from '@mui/material';
import FileTree from '../IDEComponents/FileTree';
import CodeEditor from '../IDEComponents/CodeEditor';
import Terminal from '../IDEComponents/TerminalComponent';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"
import { useUser } from '@clerk/clerk-react';
import buildTree from '../../Utils/TreeStrcuture';
import { useCurrentCode } from '../../Context/CurrentCodeContext';
import detectLanguages from '../../Utils/languageDetector';
import { debounce } from 'lodash';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from '../CustomUIComponents/FormDialog';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SaveIcon from '@mui/icons-material/Save';
import { SocketContextProvider, useSocket } from '../../Context/SocketContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useUserData } from '../../Context/UserDataContext';


const IDE = () => {
  const [language, setLanguage] = useState('javascript');
  const codeEditorRef = useRef(null);
  const { projectID } = useParams();
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [fileStructure, setFileStructure] = useState(null);
  const { currentCode, setCurrentCode, currentFilePath, setprojectPath, projectPath, currentFolder, loading, setLoading } = useCurrentCode();
  const navigate = useNavigate();
  const [autoSave, setAutoSave] = useState(false); // State to manage auto-save
  const [fileTreeKey, setFileTreeKey] = useState(0);
  const socket = useSocket();
  const {userData} = useUserData();

  // Update fileTreeKey to trigger FileTree component rerender
  const updateFileTree = () => {
    setFileTreeKey(prevKey => prevKey + 1); 
  };

  const handleCodeChange = (newValue, event) => {
    setCurrentCode(newValue);
    if (autoSave) {
      debounceSaveFile();
    }
  };

  const debounceSaveFile = useCallback(debounce(() => {
    handleCurrentFileSave();
  }, 1000), [currentCode, currentFilePath]);

  async function fetchProjectData() {
    setLoading(true);
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/project/${projectID}/${user.id}`);
    if (response.data.success === true) {
      setFiles(response.data.Data);
      setprojectPath(response.data.projectData.ProjectPath)
      const updatedFileStructure = buildTree(response.data.Data, response.data.projectData.Projectname);
      setFileStructure(updatedFileStructure);
    } else {
      alert(response.data.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjectData();
  }, []);

  useEffect(() => {
    if(socket){
      socket.on('run-project-output', msg => {
        console.log(msg)
      })
    }
  },[socket])

  const handleCurrentFileSave = async () => {
    setLoading(true)
    const payload = {
      filePath: currentFilePath,
      fileContents: currentCode,
      clerkID: user.id
    }

    if (payload.filePath === "") {
      alert("Please select a file to save");
      setLoading(false);
      return;
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/save-file`, payload);
    setLoading(false)
  }

  const handleTerminalData = (data) => {
    console.log(data);
  };

  const handleRunCode = () => {
  };

  return (
  
      <Grid container spacing={1} style={{ height: '100vh' }}>
        <Grid item xs={2}>
          <IconButton onClick={() => navigate("/dashboard/project/" + projectID)}>
            <Icon><ArrowBackIcon /></Icon>
          </IconButton>

          <IconButton onClick={async () => {
            setLoading(true);
            const fileName = prompt("Enter file name along with its extension");
            if (fileName && fileName.includes('.')) {
              const payload = {
                fileName: fileName,
                fileContent: fileName,
                directoryPath: `${projectPath}/${currentFolder}`,
                clerkID: user.id
              }

              const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/new-file`, payload)
              if (response.data.success === true) {
                await fetchProjectData();
                updateFileTree();
              } else {
                alert(response.data.message)
              }
            } else {
              alert("Invalid file name")
            }
            setLoading(false)
          }}>
            <Icon><NoteAddIcon /></Icon>
          </IconButton>

          <IconButton onClick={async () => {
            const folderName = prompt("Enter folder name ");
            if (folderName && folderName.includes('.') === false) {
              setLoading(true)
              const payload = {
                DirName: `${currentFolder}/${folderName}`,
                projectDirectory: `${projectPath}`,
                clerkID: user.id
              }

              const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/new-folder`, payload)
              if (response.data.success === true) {
                await fetchProjectData();
                updateFileTree();
              } else {
                alert(response.data.message)
              }
            } else {
              alert("Invalid folder name")
            }
            setLoading(false)
          }}>
            <Icon><CreateNewFolderIcon /></Icon>
          </IconButton>

          <IconButton onClick={async () => {
            setLoading(true)
            try {
              const payload = {
                dirPath: `${projectPath}/${currentFolder}`,
                clerkID: user.id,
              };

              if (payload.dirPath.includes('.')) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/delete-file`, {
                  filePath: `${projectPath}/${currentFolder}`
                });
                if (response.data.success) {
                  await fetchProjectData();
                  updateFileTree();
                } else {
                  alert(response.data.message);
                }
              } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/delete-folder`, {
                  folderPath: `${projectPath}/${currentFolder}`
                });
                if (response.data.success) {
                  await fetchProjectData();
                  updateFileTree();
                } else {
                  alert(response.data.message);
                }
              }
            } catch (error) {
              console.error('Error deleting folder:', error);
            }
            setLoading(false)
          }}>
            <Icon><DeleteIcon /></Icon>
          </IconButton>

          <IconButton onClick={async () => {
            const newDirName = prompt("Rename");
            if (newDirName) {
              setLoading(true)
              try {
                const payload = {
                  oldPath: `${projectPath}/${currentFolder}`,
                  newDirName: newDirName,
                  clerkID: user.id,
                };

                const response = await axios.put(`${process.env.REACT_APP_API_URL}/editor/rename`, payload);
                if (response.data.success) {
                  await fetchProjectData();
                  updateFileTree();
                } else {
                  alert(response.data.message);
                }
              } catch (error) {
                console.error('Error renaming:', error);
              }
              setLoading(false)
            } else {
              alert("New name not provided")
            }
          }}>
            <Icon><DriveFileRenameOutlineIcon /></Icon>
          </IconButton>

          {loading && <CircularProgress size={24} />}

          {(fileStructure != null && files != null) && (
            <FileTree key={fileTreeKey} fileStructure={fileStructure} files={files} />
          )}
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
          <Button disabled={autoSave} variant='contained' style={{ marginBottom: "5px", marginTop: "5px" }} onClick={handleCurrentFileSave}>
            Save current file
          </Button>

          <IconButton onClick={() => {
            socket.emit('run-project', "node")
            //console.log(userData)
          }}>
            <PlayCircleFilledWhiteIcon />
          </IconButton>

          <IconButton>
            <StopCircleIcon />
          </IconButton>

          <FormControlLabel
            control={<Checkbox checked={autoSave} onChange={() => setAutoSave(!autoSave)} />}
            label="Enable auto save"
          />

          <Terminal onData={handleTerminalData} />
        </Grid>
      </Grid>
    
  );
};

export default IDE;
