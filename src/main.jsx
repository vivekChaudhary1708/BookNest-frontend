import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.10)',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#FFFFFF' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
