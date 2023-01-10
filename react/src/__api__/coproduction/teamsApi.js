import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TeamsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/teams');
  }

  async addUser(id, user_id) {
    const res = await axiosInstance.post(
      `/${this.url}/${id}/users`,
      { user_id }
    );
    console.log('add user call', res.data);
    return res.data;
  }

  async removeUser(id, user_id) {
    const res = await axiosInstance.delete(
      `/${this.url}/${id}/users/${user_id}`
    );
    console.log('remove user call', res.data);
    return res.data;
  }

  // async getUsers(id) {
  //   const res = await axiosInstance.get(
  //     `/${this.url}/${id}`
  //   );
  //   console.log('list of members from team', res.data);
  //   return res.data;
  // }

}

export const teamsApi = new TeamsApi();
