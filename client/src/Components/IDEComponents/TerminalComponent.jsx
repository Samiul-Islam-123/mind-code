import React, { useState } from 'react';
import Terminal, { ColorMode, TerminalOutput, TerminalInput } from 'react-terminal-ui';

function TerminalComponent({ onData }) {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={0}>Welcome to the React Terminal UI!</TerminalOutput>
  ]);

  const handleTerminalInput = (input) => {
    console.log(`New terminal input received: '${input}'`);
    onData(input);  // Callback to handle terminal input in the IDE component
    
    // Process the command and generate a response
    const newTerminalLineData = processCommand(input);

    setTerminalLineData(newTerminalLineData);
  };

  const processCommand = (command) => {
    const args = command.split(' ');
    const cmd = args[0];
    const rest = args.slice(1);

    const newTerminalLineData = [...terminalLineData];

    // Display the entered command
    newTerminalLineData.push(
      <TerminalInput key={newTerminalLineData.length} prompt="$">{command}</TerminalInput>
    );

    let response;

    switch (cmd) {
      case 'help':
        response = 'Available commands: help, echo [text], fetch [url], clear';
        break;
      case 'echo':
        response = rest.join(' ');
        break;
      case 'fetch':
        response = 'Fetching data... (mock implementation)'; // Add actual fetching logic if needed
        break;
      case 'clear':
        return [<TerminalOutput key={0}>Terminal cleared.</TerminalOutput>];
      default:
        response = `Command not found: ${cmd}`;
        break;
    }

    newTerminalLineData.push(
      <TerminalOutput key={newTerminalLineData.length}>{response}</TerminalOutput>
    );

    return newTerminalLineData;
  };

  return (
    <div className="container">
      <Terminal 
        height="82vh" 
        prompt=">" 
        colorMode={ColorMode.Dark} 
        onInput={handleTerminalInput}
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
}

export default TerminalComponent;
