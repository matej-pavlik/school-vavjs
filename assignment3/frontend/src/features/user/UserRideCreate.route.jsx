import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helpersFetch';

export const userRideCreateRouteHandlers = {
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    const body = { ...data, date: new Date(data.date).toISOString(), value: Number(data.value) };

    const res = await fetchData('api/rides', { method: 'POST', body });

    if (res.ok) {
      return redirect('/user/rides');
    }

    return res;
  },
};
