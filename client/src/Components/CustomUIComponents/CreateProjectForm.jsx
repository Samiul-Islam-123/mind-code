import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, Box } from '@mui/material';
import { useUserData } from '../../Context/UserDataContext';
import axios from 'axios';
import { useCurrentCode } from '../../Context/CurrentCodeContext';
import NodeJsOptions from "../OptionsUI/NodeJsOptions"

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('');
  const [description, setDescription] = useState('');
  const [nodeOptions, setNodeOptions] = useState({
    express: false,
    socket: false,
    applicationType: '',
    additionalPackages: [],
    customPackages: '',
  });
  const { userData, makeAPICall } = useUserData();
  const { setProjectLoading } = useCurrentCode();

  const popularPackages = [
    'express',
    'socket.io',
    'mongoose',
    'cors',
    'dotenv',
    'jsonwebtoken',
    'bcryptjs'
  ];

  const handleNodeOptionsChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox' && popularPackages.includes(name)) {
      setNodeOptions((prev) => ({
        ...prev,
        additionalPackages: checked
          ? [...prev.additionalPackages, name]
          : prev.additionalPackages.filter(pkg => pkg !== name)
      }));
    } else {
      setNodeOptions((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProjectLoading(true);

    const Response = await axios.post(`${process.env.REACT_APP_API_URL}/project`, {
      Projectname: projectName,
      clerkID: userData.user.clerkID,
      description: description,
      template: template,
      nodeOptions: template === 'node' ? {
        ...nodeOptions,
        additionalPackages: [
          ...nodeOptions.additionalPackages,
          ...nodeOptions.customPackages.split(',').map(pkg => pkg.trim())
        ]
      } : null,
    });

    if (Response.data.success === true) {
      await makeAPICall();
    } else {
      console.log(Response);
      alert(Response.data.message);
    }
    setProjectLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h6" gutterBottom>
        Create New Project
      </Typography>

      <TextField
        label="Project Name"
        fullWidth
        variant="outlined"
        margin="normal"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Template</InputLabel>
        <Select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          label="Template"
          required
        >
          <MenuItem value="html">HTML, CSS, Javascript</MenuItem>
          <MenuItem value="react">React App</MenuItem>
          <MenuItem value="node">Node.js application</MenuItem>
          <MenuItem value="mern">MERN stack application</MenuItem>
        </Select>
      </FormControl>

      {template === 'node' && (
        <NodeJsOptions
          nodeOptions={nodeOptions}
          handleNodeOptionsChange={handleNodeOptionsChange}
          popularPackages={popularPackages}
        />
      )}

      <TextField
        label="Description"
        fullWidth
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Project
      </Button>
    </Box>
  );
};

export default CreateProjectForm;
