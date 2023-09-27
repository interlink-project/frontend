import axiosInstance from 'axiosInstance';
import GeneralApi from './general';

class UsersApi extends GeneralApi {
  constructor() {
    super('auth/api/v1/users', 'users_cache');
  }

  async search(search, organization_id = null) {
    console.log('get users call', search, organization_id)
    const ser = `by=${search}`;
    const org = organization_id ? `organization_id=${organization_id}` : '';
    const res = await axiosInstance.get(`/coproduction/api/v1/users/search?${ser}&${org}`);
    console.log('get users call', res.data);
    return res.data;
  }

  async me() {
    // Call auth microservice first in order to create an account if it does not exist
    const res = await axiosInstance.get('/auth/api/v1/users/me');
    console.log(res);
    // Coproduction service gets user data from the auth service
    const res2 = await axiosInstance.get('/coproduction/api/v1/users/me');
    console.log(res2);
    const me = { ...res.data, ...res2.data };
    console.log('get me call', me);
    return me;
  }

  async agreeTerms(){

    try {
          const response = await axiosInstance.put('/coproduction/api/v1/users/agree-terms', {});
          // handle the response if needed
          console.log(response.data);
          return response.data;
    } catch (error) {
      // handle error response
      console.error('Error agreeing to terms:', error.response ? error.response.data : error.message);
    }
  }

  async refuseTerms(){

    try {
          const response = await axiosInstance.put('/coproduction/api/v1/users/refuse-terms', {});
          // handle the response if needed
          console.log(response.data);
          return response.data;
    } catch (error) {
      // handle error response
      console.error('Error when refuse the terms:', error.response ? error.response.data : error.message);
    }
  }

 


}

export const usersApi = new UsersApi();
