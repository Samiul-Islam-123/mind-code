// src/components/ProjectDetails.js
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Paper, Button } from '@mui/material';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { buildFileTree } from '../../utils';
import AlertDialog from './AlertDialog';

function ProjectDetails() {
  const navigate = useNavigate();
  const { projectID } = useParams();
  const { user } = useUser();
  const [projectData, setProjectData] = useState(null);
  const [files, setFiles] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [confirmation, setConfirmation] = React.useState(false);


  const fetchProjectData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/project/${projectID}/${user.id}`);
      if (response.data.success) {
        setProjectData(response.data.projectData);
        setFiles(response.data.Data);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectID]);

  useEffect(() => {
    if (files.length > 0 && projectData) {
      const projectName = projectData.Projectname;
      const { nodes, edges } = buildFileTree(files, projectData.owner._id);

      console.log(nodes)

      setNodes(nodes);
      setEdges(edges);
    }
  }, [files, projectData]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDeleteProject = async () => {
    const clerkID = user.id;

    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/project/${projectID}/${clerkID}`);
    if (response.data.success === true) {

      alert(projectData.Projectname + " deleted successfully")
      navigate('/dashboard')
    }

    else {
      console.log(response)
      alert("Error")
    }
  }

  useEffect(() => {
    if (confirmation === true)
      handleDeleteProject();
  }, [confirmation])

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {projectData ? (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {projectData.Projectname}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Description: {projectData.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Last Updated: {new Date(projectData.updatedAt).toLocaleString()}
            </Typography>

            <Button variant='outlined' onClick={()=>{
              navigate(`/dashboard/ide/${projectID}`)
            }}>
              Open with Editor
            </Button>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Project Strcuture
            </Typography>
            <div style={{ height: '70vh' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView

              >
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </Paper>
        </>
      ) : (
        <Typography variant="h5">Loading...</Typography>
      )}

      <AlertDialog buttonName={"Delete Project"}
        Type={'error'}
        Dialogtitle={"Are you Sure, you want to Delete this project ? "}
        DialogText={"Keep in mind on proceeding, all your project data will be removed permanently, if it's ok for you then click proceed or else click dismiss"}
        AgreeContent={"Proceed"}
        DisagreeContent={"Dismiss"}
        confirmation={confirmation}
        setConfirmation={setConfirmation}
      />


    </Container>
  );
}

export default ProjectDetails;
