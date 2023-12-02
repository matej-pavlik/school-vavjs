import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helpersFetch';
import { setUserToken } from '@/state';

export const registerRouteHandlers = {
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    const body = { ...data, age: Number(data.age) };

    const res = await fetchData('register', { method: 'POST', body });

    if (res.ok) {
      setUserToken((await res.json()).token);
      return redirect('/user');
    }

    return res;
  },
};
