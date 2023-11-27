import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helperFetch';
import { setUser } from '@/state';
import { parseFieldErrors } from '../common/helperErrors';

export const registerRouteHandlers = {
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    const body = { ...data, age: Number(data.age) };

    const res = await fetchData('register', { method: 'POST', body });
    const resJson = await res.json();

    if (res.ok) {
      setUser(resJson);
      return redirect('/user');
    }

    return parseFieldErrors(resJson.errors);
  },
};
