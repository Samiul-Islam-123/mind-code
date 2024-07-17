import React, { useEffect, useState } from 'react';
import Terminal, { ColorMode, TerminalOutput, TerminalInput } from 'react-terminal-ui';
import { useSocket } from '../../Context/SocketContext';
import { useCurrentCode } from '../../Context/CurrentCodeContext';

function TerminalComponent({ onData }) {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={0}>Welcome to the React Terminal UI!</TerminalOutput>
  ]);

  const { projectPath } = useCurrentCode();
  const socket = useSocket();
  const [connection, setConnection] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("connected", msg => {
        console.log(msg);
        setConnection(true);
        socket.emit('setPath', projectPath);
      });

      socket.on('command-out', output => {
        console.log(output);
        setTerminalLineData(prevData => [
          ...prevData,
          <TerminalOutput key={prevData.length}>{output}</TerminalOutput>
        ]);
      });
    }
  }, [socket, projectPath]);

  const handleTerminalInput = (input) => {
    console.log(`New terminal input received: '${input}'`);
    onData(input); // Callback to handle terminal input in the IDE component

    // Emit the command to the server
    if (socket) {
      socket.emit('command-in', input);
    }

    // Display the entered command
    setTerminalLineData(prevData => [
      ...prevData,
      <TerminalInput key={prevData.length} prompt="$">{input}</TerminalInput>
    ]);
  };

  const processCommand = (command) => {
    const args = command.split(' ');
    const cmd = args[0];
    const rest = args.slice(1);

    switch (cmd) {
      case 'help':
        return 'Available commands: help, echo [text], fetch [url], clear';
      case 'echo':
        return rest.join(' ');
      case 'fetch':
        return 'Fetching data... (mock implementation)'; // Add actual fetching logic if needed
      case 'clear':
        setTerminalLineData([<TerminalOutput key={0}>Terminal cleared.</TerminalOutput>]);
        return '';
      default:
        return `Command not found: ${cmd}`;
    }
  };

  return (
    <div className="container">
      {connection ? (
        <Terminal
          height="81vh"
          prompt="$"
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
