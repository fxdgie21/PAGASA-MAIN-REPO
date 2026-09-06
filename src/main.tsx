import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handlers to log and prevent silent failures
window.addEventListener('error', (event) => {
  console.error('App runtime error:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('App unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

