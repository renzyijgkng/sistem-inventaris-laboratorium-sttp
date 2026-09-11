import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './providers/AuthProvider';
import { LabStatusProvider } from './providers/LabStatusContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <LabStatusProvider>
        <App />
      </LabStatusProvider>
    </AuthProvider>
  </React.StrictMode>,
);