import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, Box } from '@mui/material';
import { useUserData } from '../../Context/UserDataContext';
import axios from 'axios';

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('');
  const [description, setDescription] = useState('');
  const {userData, makeAPICall} = useUserData();

  const handleSubmit =async (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API

    const Response = await axios.post(`${process.env.REACT_APP_API_URL}/project`, {
      Projectname : projectName,
      clerkID : userData.user.clerkID,
      description : description
     })

     //console.log(Response)

     if(Response.data.success === true){
      await makeAPICall()
     }

     else{
      console.log(Response);
      alert(Response.data.message)
     }
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
