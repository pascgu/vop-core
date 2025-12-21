import React from 'react';
import './App.css';
import DiagramEditor from './components/DiagramEditor';
import VopPicoIntegration from './components/VopPicoIntegration';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <DiagramEditor /> */}
        <VopPicoIntegration />
      </header>
    </div>
  );
}

export default App;
