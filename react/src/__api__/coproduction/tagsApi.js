import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TagsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/tags');
  }

  async getAssetsAndContributions(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}/listTaskAssetsContributions`);
      console.log('get notifications with contributions data', res.data);
      return res.data;
    }
  }


}

export const tagsApi = new TagsApi();
