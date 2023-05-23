import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TagsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/tags');
  }

  async createbyName(data) {
    return axiosInstance.post(`/${this.url}/createbyName`, data);
  }


}

export const tagsApi = new TagsApi();
