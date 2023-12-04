import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helpersFetch';

export const userRideTypeCreateRouteHandlers = {
  async action({ request }) {
    const res = await fetchData('api/ride-types', {
      method: 'POST',
      body: Object.fromEntries(await request.formData()),
    });

    if (res.ok) {
      return redirect('/user/ride-types');
    }

    return res;
  },
};
