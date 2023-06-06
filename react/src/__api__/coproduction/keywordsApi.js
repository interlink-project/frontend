import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class KeywordsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/keywords');
  }

  async createbyName(data) {
    return axiosInstance.post(`/${this.url}/createbyName`, data);
  }


}

export const keywordsApi = new KeywordsApi();
