import { fetchData } from '@/features/common/helpersFetch';

export const userRideTypesRouteHandlers = {
  async loader() {
    return fetchData('api/ride-types');
  },
  async action({ request }) {
    const data = Object.fromEntries(await request.formData());
    return fetchData(`api/ride-types/${data.id}`, { method: 'DELETE' });
  },
};
