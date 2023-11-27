import { redirect } from 'react-router-dom';
import { fetchData } from '@/features/common/helperFetch';

export const loginRouteHandlers = {
  async action({ request }) {
    const res = await fetchData('login', {
      method: 'POST',
      body: Object.fromEntries(await request.formData()),
    });

    if (res.ok) {
      return redirect('/user');
    }

    return (await res.json()).errors;
  },
};
