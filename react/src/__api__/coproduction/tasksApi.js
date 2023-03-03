import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TasksApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/tasks');
  }

  //http://localhost/coproduction/api/v1/tasks/ 4240e946-20e9-4f53-b83e-362a288b0d9c/listTaskAssetsContributions
  async getAssetsAndContributions(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}/listTaskAssetsContributions`);
      console.log('get notifications with contributions data', res.data);
      return res.data;
    }
  }


}

export const tasksApi = new TasksApi();
