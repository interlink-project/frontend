import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TagsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/tags');
  }


}

export const tagsApi = new TagsApi();
