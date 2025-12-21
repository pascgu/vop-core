import React from 'react';
import './App.css';
import VopPicoIntegration from './components/VopPicoIntegration';
import VopVscodeIntegration from './components/VopVscodeIntegration';
import VopTestIntegration from './components/VopTestIntegration';

function App() {
  console.log('Rendering App component... data-app:', document.body.getAttribute('data-app'));
  const appType = document.body.getAttribute('data-app');

  let componentToRender;

  if (appType === 'pico') {
    componentToRender = <VopPicoIntegration />;
  } else if (appType === 'vscode') {
    componentToRender = <VopVscodeIntegration />;
  } else {
    componentToRender = <VopTestIntegration />;
  }

  return (
    <div className="App">
      <header className="App-header">
        {componentToRender}
      </header>
    </div>
  );
}

export default App;
