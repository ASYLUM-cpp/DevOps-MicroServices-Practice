// Import the main libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component
import App from './App';

// Import the default styling (optional)
import './index.css';

// Create a React root and render the App component inside the HTML element with id "root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
