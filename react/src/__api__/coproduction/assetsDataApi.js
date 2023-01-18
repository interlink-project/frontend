import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class AssetsDataApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/assetsdata');
  }


  async createAssetData(id, name) {
    const res = await axiosInstance.post(`/${this.url}`, {
      id,
      name
    });
    console.log('post call', res, res.data);
    return res.data;
  }

  

}

export const assetsDataApi = new AssetsDataApi();
