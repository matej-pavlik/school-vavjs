import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helperFetch';
import { setUser } from '@/state';

export const loginRouteHandlers = {
  async action({ request }) {
    const res = await fetchData('login', {
      method: 'POST',
      body: Object.fromEntries(await request.formData()),
    });
    const resJson = await res.json();

    if (res.ok) {
      setUser(resJson);
      return redirect('/user');
    }

    return resJson.errors;
  },
};
