import React, { createContext, useContext, useState } from 'react';

const FileTreeContext = createContext();

export const useFileTree = () => useContext(FileTreeContext);

export const FileTreeProvider = ({ children }) => {
  const [fileTreeKey, setFileTreeKey] = useState(0); // Initial key

  const updateFileTree = () => {
    setFileTreeKey(prevKey => prevKey + 1); // Increment key to force rerender
  };

  return (
    <FileTreeContext.Provider value={{ fileTreeKey, updateFileTree }}>
      {children}
    </FileTreeContext.Provider>
  );
};


