import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Checkbox, CircularProgress, FormControlLabel, Grid, Icon, IconButton, Typography } from '@mui/material';
import FileTree from '../IDEComponents/FileTree';
import CodeEditor from '../IDEComponents/CodeEditor';
import Terminal from '../IDEComponents/TerminalComponent';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { useUser } from '@clerk/clerk-react';
import buildTree from '../../Utils/TreeStrcuture';
import { useCurrentCode } from '../../Context/CurrentCodeContext';
import detectLanguages from '../../Utils/languageDetector';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SaveIcon from '@mui/icons-material/Save';
import { SocketContextProvider, useSocket } from '../../Context/SocketContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useUserData } from '../../Context/UserDataContext';
import debounce from 'lodash/debounce';


const IDE = () => {
  const [language, setLanguage] = useState('javascript');
  const codeEditorRef = useRef(null);
  const { projectID } = useParams();
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [fileStructure, setFileStructure] = useState(null);
  const { currentCode, setCurrentCode, currentFilePath, setprojectPath, projectPath, currentFolder, loading, setLoading } = useCurrentCode();
  const navigate = useNavigate();
  const [autoSave, setAutoSave] = useState(false);
  const [fileTreeKey, setFileTreeKey] = useState(0);
  const socket = useSocket();
  const { userData } = useUserData();
  const [templateName, setTemplateName] = useState("")

  // Update fileTreeKey to trigger FileTree component rerender
  const updateFileTree = () => {
    setFileTreeKey(prevKey => prevKey + 1);
  };

  const handleCodeChange = (newValue, event) => {
    setCurrentCode(newValue);
  };

  // Create a debounced version of the save function
  const saveFile = useCallback(debounce(async () => {
    if (currentFilePath) {
      setLoading(true);
      const payload = {
        filePath: currentFilePath,
        fileContents: currentCode,
        clerkID: user.id
      };
      
      try {
        socket.emit('update-project', {
          projectPath : projectPath,
          templateName : templateName
        })
        await axios.post(`${process.env.REACT_APP_API_URL}/editor/save-file`, payload);
      } catch (error) {
        console.error('Error saving file:', error);
      } finally {
        setLoading(false);
      }
    }
  }, 1000), [currentFilePath, currentCode, user.id]); // Debounce delay is 1000ms (1 second)


  useEffect(() => {
    if (autoSave) {
      saveFile();
    }
  }, [currentCode, autoSave, saveFile]); // Added saveFile to dependency array


  async function fetchProjectData() {
    setLoading(true);
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/project/${projectID}/${user.id}`);
    if (response.data.success === true) {
      setFiles(response.data.Data);
      setprojectPath(response.data.projectData.ProjectPath);
      //console.log(response.data.projectData.TemplateName)
      setTemplateName(response.data.projectData.TemplateName);
      const updatedFileStructure = buildTree(response.data.Data, response.data.projectData.Projectname);
      setFileStructure(updatedFileStructure);
    } else {
      alert(response.data.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProjectData();
  }, []);

  

  const handleCurrentFileSave = async () => {
    setLoading(true);
    const payload = {
      filePath: currentFilePath,
      fileContents: currentCode,
      clerkID: user.id
    };

    if (payload.filePath === "") {
      alert("Please select a file to save");
      setLoading(false);
      return;
    }
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/save-file`, payload);
    if(response.data.success === true){

      socket.emit('update-project', {
        projectPath : projectPath,
        templateName : templateName
      })
    }
    setLoading(false);
  };

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
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/new-file`, payload);
            if (response.data.success === true) {
              await fetchProjectData();
              updateFileTree();
            } else {
              alert(response.data.message);
            }
          } else {
            alert("Invalid file name");
          }
          setLoading(false);
        }}>
          <Icon><NoteAddIcon /></Icon>
        </IconButton>

        <IconButton onClick={async () => {
          const folderName = prompt("Enter folder name ");
          if (folderName && !folderName.includes('.')) {
            setLoading(true);
            const payload = {
              DirName: `${currentFolder}/${folderName}`,
              projectDirectory: `${projectPath}`,
              clerkID: user.id
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/editor/new-folder`, payload);
            if (response.data.success === true) {
              await fetchProjectData();
              updateFileTree();
            } else {
              alert(response.data.message);
            }
          } else {
            alert("Invalid folder name");
          }
          setLoading(false);
        }}>
          <Icon><CreateNewFolderIcon /></Icon>
        </IconButton>

        <IconButton onClick={async () => {
          setLoading(true);
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
          setLoading(false);
        }}>
          <Icon><DeleteIcon /></Icon>
        </IconButton>

        <IconButton onClick={async () => {
          const newDirName = prompt("Rename");
          if (newDirName) {
            setLoading(true);
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
            setLoading(false);
          } else {
            alert("New name not provided");
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
          console.log(templateName)
          socket.emit('run-project', {
            templateName : templateName,
            projectPath : projectPath
          });
        }}>
          <Icon><PlayCircleFilledWhiteIcon /></Icon>
        </IconButton>
        <IconButton onClick={() => {
          socket.emit('stop-project');
        }}>
          <Icon><StopCircleIcon /></Icon>
        </IconButton>
        <FormControlLabel
          control={<Checkbox checked={autoSave} onChange={() => setAutoSave(!autoSave)} />}
          label="Enable Auto Save"
        />
        <Terminal onData={handleTerminalData} />
      </Grid>
    </Grid>
  );
};

export default IDE;
