import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';
import UpdateNotification from './component/UpdateNotification';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <UpdateNotification />
  </React.StrictMode>
);

// Register service worker
registerServiceWorker(); 