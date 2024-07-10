// src/components/FileTree.js
import React, { useState } from 'react';
import { Treebeard } from 'react-treebeard';

const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'src',
      children: [
        { name: 'index.js' },
        { name: 'App.js' }
      ]
    },
    {
      name: 'public',
      children: [
        { name: 'index.html' }
      ]
    }
  ]
};

const FileTree = () => {
  const [treeData, setTreeData] = useState(data);
  const [cursor, setCursor] = useState(null);

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
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
