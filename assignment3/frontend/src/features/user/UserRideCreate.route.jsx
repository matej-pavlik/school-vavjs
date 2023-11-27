import { redirect } from 'react-router-dom';
import { fetchData } from '../common/helperFetch';

export const userRideCreateRouteHandlers = {
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    const body = { ...data, value: Number(data.value) };

    const res = await fetchData('api/rides', { method: 'POST', body });
    const resJson = await res.json();

    if (res.ok) {
      return redirect('/user/rides');
    }
    return resJson.errors;
  },
};
