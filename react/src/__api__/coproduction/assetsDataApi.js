import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class AssetsDataApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/assetsdata');
  }


  async createAssetData(data) {

    const res = await axiosInstance.post(
      `/${this.url}/create`,
      data
    );
    console.log('add assetdata call', res.data);
    return res.data;

  }

  

}

export const assetsDataApi = new AssetsDataApi();
