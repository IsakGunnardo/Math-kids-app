import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MathApp from './App.jsx'
import './index.css'

console.log('main.jsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering...');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <MathApp />
      </StrictMode>,
    );
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
}
