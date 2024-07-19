import React from 'react';
import { Box, FormControl, FormControlLabel, FormGroup, InputLabel, Select, MenuItem, TextField, Typography, Checkbox } from '@mui/material';

const NodeJsOptions = ({ nodeOptions, handleNodeOptionsChange, popularPackages }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Node.js Options
      </Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Application Type</InputLabel>
        <Select
          value={nodeOptions.applicationType}
          onChange={handleNodeOptionsChange}
          label="Application Type"
          name="applicationType"
        >
          <MenuItem value="server">Node Server</MenuItem>
          <MenuItem value="application">Simple Node Application</MenuItem>
        </Select>
      </FormControl>

      {nodeOptions.applicationType === 'server' ? (
        <>

          <Typography variant="subtitle2" gutterBottom>
            Popular Packages
          </Typography>
          <FormGroup>
            {popularPackages.map((pkg) => (
              <FormControlLabel
                key={pkg}
                control={<Checkbox checked={nodeOptions.additionalPackages.includes(pkg)} onChange={handleNodeOptionsChange} name={pkg} />}
                label={pkg}
              />
            ))}
          </FormGroup>
        </>
      ) : (
        <>
          
          <TextField
            label="Custom Packages (comma separated)"
            fullWidth
            variant="outlined"
            margin="normal"
            value={nodeOptions.customPackages}
            onChange={(e) => handleNodeOptionsChange({ target: { name: 'customPackages', value: e.target.value, type: 'text' } })}
          />
        </>
      )}
    </Box>
  );
};

export default NodeJsOptions;
