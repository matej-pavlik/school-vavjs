import { memoizeWith } from 'ramda';
import { redirect } from 'react-router-dom';
import { getUserToken } from '@/state';
import { fetchData } from '../common/helpersFetch';

export const userLayoutRouteHandlers = {
  loader: memoizeWith(
    () => getUserToken(),
    async () => {
      const res = await fetchData('api/users/me');

      if (res.ok) {
        return res.json();
      }

      return redirect('/login');
    },
  ),
};
