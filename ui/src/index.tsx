import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DiagramEditor from './components/DiagramEditor';

console.log('Starting the React application...');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
    <DiagramEditor />
  </React.StrictMode>
);

console.log('React Application rendered successfully.');
