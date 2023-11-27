import { redirect } from 'react-router-dom';
import Login from './features/login/Login';
import { loginRouteHandlers } from './features/login/Login.route';
import Register from './features/register/Register';
import { registerRouteHandlers } from './features/register/Register.route';
import UserLayout from './features/user/UserLayout';
import { userLayoutRouteHandlers } from './features/user/UserLayout.route';
import UserRideCreate from './features/user/UserRideCreate';
import { userRideCreateRouteHandlers } from './features/user/UserRideCreate.route';
import UserRides from './features/user/UserRides';
import { userRidesRouteHandlers } from './features/user/UserRides.route';

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
  {
    path: '/user',
    element: <UserLayout />,
    ...userLayoutRouteHandlers,
    children: [
      {
        path: '',
        loader: () => redirect('/user/rides'),
      },
      {
        path: 'rides',
        element: <UserRides />,
        ...userRidesRouteHandlers,
      },
      {
        path: 'rides/create',
        element: <UserRideCreate />,
        ...userRideCreateRouteHandlers,
      },
    ],
  },
];
