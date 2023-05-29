import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';

class RatingsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/ratings');
  }

  async getMulti(artefact_id, artefact_type, params = {}) {
    const res = await axiosInstance.get(
      `/${this.url}?artefact_id=${artefact_id}&artefact_type=${artefact_type}`, {
        params: removeEmpty(params)
      }
    );
    return res.data;
  }

  async create(title, text, value, artefact_id,artefact_type) {
    const res = await axiosInstance.post(`/${this.url}`, {
      title, text, value, artefact_id, artefact_type
    });
    console.log('post call', res, res.data);
    return res.data;
  }
}

export const ratingsApi = new RatingsApi();
