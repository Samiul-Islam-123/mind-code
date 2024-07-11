// src/components/FileTree.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FileTree = ({ tree }) => {
  const renderTree = (node, level = 0) => {
    return Object.keys(node).map((key) => (
      <Box key={key} sx={{ ml: level * 2 }}>
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="body1">{key}</Typography>
            {Object.keys(node[key]).length > 0 && renderTree(node[key], level + 1)}
          </CardContent>
        </Card>
      </Box>
    ));
  };

  return <>{renderTree(tree)}</>;
};

export default FileTree;
