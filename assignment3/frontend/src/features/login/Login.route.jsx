import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helpersFetch';
import { setUserToken } from '@/state';

export const loginRouteHandlers = {
  async action({ request }) {
    const res = await fetchData('login', {
      method: 'POST',
      body: Object.fromEntries(await request.formData()),
    });

    if (res.ok) {
      setUserToken((await res.json()).token);
      return redirect('/user');
    }

    return res;
  },
};
