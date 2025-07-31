import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <CopilotKit publicApiKey="ck_pub_32ed13f8b0c18bf0ce8c558cbe65fec7">
      <App />
    </CopilotKit>
  </React.StrictMode>,
);
}
