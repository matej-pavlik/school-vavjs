import { fetchData } from '../common/helperFetch';

export const userRidesRouteHandlers = {
  async loader() {
    return fetchData('api/rides');
  },
};
