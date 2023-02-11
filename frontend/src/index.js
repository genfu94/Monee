import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak.js'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <ReactKeycloakProvider authClient={keycloak} initOptions={{onLoad: 'login-required'}}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactKeycloakProvider>
);