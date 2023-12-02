import { fetchData } from '@/features/common/helpersFetch';

export const userRidesRouteHandlers = {
  async loader() {
    return fetchData('api/rides');
  },
  async action({ request }) {
    // TODO delete ride
    console.log('data', Object.fromEntries(await request.formData()));
    return null;
  },
};
