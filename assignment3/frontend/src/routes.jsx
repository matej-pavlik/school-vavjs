import { redirect } from 'react-router-dom';
import Login from './features/login/Login';
import { loginRouteHandlers } from './features/login/Login.route';
import Register from './features/register/Register';
import { registerRouteHandlers } from './features/register/Register.route';

export const routesConfig = [
  {
    path: '/',
    loader: () => redirect('/login'),
  },
  {
    path: '/login',
    element: <Login />,
    ...loginRouteHandlers,
  },
  {
    path: '/register',
    element: <Register />,
    ...registerRouteHandlers,
  },
];
