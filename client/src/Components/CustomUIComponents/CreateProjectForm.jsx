import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, Box } from '@mui/material';
import { useUserData } from '../../Context/UserDataContext';
import axios from 'axios';

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('');
  const [description, setDescription] = useState('');
  const {userData} = useUserData();

  const handleSubmit =async (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API
    console.log({
      projectName,
      template,
      description
    });

    const Response = await axios.post(`${process.env.REACT_APP_API_URL}/project`, {
      Projectname : projectName,
      clerkID : userData.user.clerkID,
      description : description
     })

     console.log(Response)
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
          <MenuItem value="template1">Template 1</MenuItem>
          <MenuItem value="template2">Template 2</MenuItem>
          <MenuItem value="template3">Template 3</MenuItem>
        </Select>
      </FormControl>

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
