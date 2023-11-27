import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helperFetch';
import { parseFieldErrors } from '../common/helperErrors';

export const registerRouteHandlers = {
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    const body = { ...data, age: Number(data.age) };

    const res = await fetchData('register', { method: 'POST', body });

    if (res.ok) {
      return redirect('/user');
    }

    return parseFieldErrors((await res.json()).errors);
  },
};
