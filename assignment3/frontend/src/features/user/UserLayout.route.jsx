import { redirect } from 'react-router-dom';
import { getUser } from '@/state';

export const userLayoutRouteHandlers = {
  loader() {
    const user = getUser();

    if (user) {
      return user;
    }

    return redirect('/login');
  },
};
