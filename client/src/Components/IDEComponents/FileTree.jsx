import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Treebeard } from 'react-treebeard';
import { useCurrentCode } from '../../Context/CurrentCodeContext';

const FileTree = ({ fileStructure, files }) => {
  const [treeData, setTreeData] = useState(fileStructure);
  const [cursor, setCursor] = useState(null);
  const { user } = useUser();
  const { setCurrentCode, setCurrentFilePath } = useCurrentCode();

  function extractFileFromPaths(files, target) {
    for (let file of files) {
      if (file.split("\\").pop() === target) {
        return file;
      }
    }
  }

  const onToggle = async (node, toggled) => {
    if (cursor) {
      setCursor({ ...cursor, toggled: false });
    }
    node.active = true;
    node.toggled = toggled;
    if (node.children) {
      node.children.forEach(child => {
        child.active = false; // Deactivate all children
      });
    }

    if (!node.children && files) {
      const filePath = extractFileFromPaths(files, node.name);
      if (filePath) {
        const doubleBackslashPath = encodeURIComponent(filePath);
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/editor/${doubleBackslashPath}/${user.id}`);
          if (response.data.success === true) {
            setCurrentCode(response.data.contents);
            setCurrentFilePath(filePath)
          }
        } catch (error) {
          console.error('Error fetching file contents:', error);
        }
      }
    }

    setCursor(node);
    setTreeData({ ...treeData });
  };

  return (
    <Treebeard
      data={treeData}
      onToggle={onToggle}
    />
  );
};

export default FileTree;
