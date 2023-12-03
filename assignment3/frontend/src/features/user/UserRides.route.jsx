import { fetchData } from '@/features/common/helpersFetch';

export const userRidesRouteHandlers = {
  async loader() {
    return fetchData('api/rides');
  },
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    return fetchData(`api/rides/${data.id}`, { method: 'DELETE' });
  },
};
