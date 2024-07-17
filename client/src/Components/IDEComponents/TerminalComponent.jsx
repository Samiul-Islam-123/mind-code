import React, { useEffect, useState } from 'react';
import Terminal, { ColorMode, TerminalOutput, TerminalInput } from 'react-terminal-ui';
import { useSocket } from '../../Context/SocketContext';
import { useCurrentCode } from '../../Context/CurrentCodeContext';

function TerminalComponent({ onData }) {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={0}>Welcome to the React Terminal UI!</TerminalOutput>
  ]);
  const [currentPath, setCurrentPath] = useState('');
  
  const { projectPath } = useCurrentCode();
  const socket = useSocket();
  const [connection, setConnection] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleConnected = (msg) => {
        console.log(msg);
        setConnection(true);
        socket.emit('setPath', projectPath);
      };

      const handleCommandOut = (output) => {
        console.log(output);
        setTerminalLineData(prevData => [
          ...prevData,
          <TerminalOutput key={prevData.length}>{output}</TerminalOutput>
        ]);
      };

      const handleSetPath = (path) => {
        console.log(`Directory changed to: ${path}`);
        setCurrentPath(path);
      };

      socket.on("connected", handleConnected);
      socket.on('command-out', handleCommandOut);
      socket.on('set-path', handleSetPath);

      // Cleanup function to remove event listeners
      return () => {
        socket.off("connected", handleConnected);
        socket.off('command-out', handleCommandOut);
        socket.off('set-path', handleSetPath);
      };
    }
  }, [socket, projectPath]);

  const handleTerminalInput = (input) => {
    console.log(`New terminal input received: '${input}'`);
    onData(input); // Callback to handle terminal input in the IDE component

    // Emit the command to the server
    if (socket) {
      socket.emit('command', { command: input, path: currentPath });
    }

    // Display the entered command
    setTerminalLineData(prevData => [
      ...prevData,
      <TerminalInput key={prevData.length} prompt={`${currentPath} $`}>{input}</TerminalInput>
    ]);

    // Handle clear command locally
    if (input.trim() === "clear") {
      setTerminalLineData([]);
    }
  };

  return (
    <div className="container">
      {connection ? (
        <Terminal
          height="81vh"
          prompt={`${currentPath} $`}
          colorMode={ColorMode.Dark}
          onInput={handleTerminalInput}
        >
          {terminalLineData}
        </Terminal>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
}

export default TerminalComponent;
