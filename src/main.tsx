import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handlers to capture and prevent unhandled promise crashes
window.addEventListener('error', (event) => {
  if (event.defaultPrevented) return;
  console.warn('App runtime event notice:', event.error?.message || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.warn('App unhandled promise rejection captured:', event.reason?.message || event.reason || 'Handled rejection');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

