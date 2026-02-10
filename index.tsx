import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const element = document.getElementById('root');
      if (!element) {
        throw new Error("Could not find root element to mount to");
      }
      const root = ReactDOM.createRoot(element);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
  } else {
    throw new Error("Could not find root element to mount to");
  }
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
