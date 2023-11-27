import '@fontsource/inter';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './main.css';
import { routesConfig } from './routes';

const theme = extendTheme({
  components: {
    JoyStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
});

const router = createBrowserRouter(routesConfig);

// TODO remove
console.log(import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>,
);
