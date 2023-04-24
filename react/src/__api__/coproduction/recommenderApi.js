import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';
import { getLanguage } from 'translations/i18n';

function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

class RecommenderApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/recomenders/typegovernancemodel');
  }

  async recommendGovernanceModel(sampleData, trainingData) {

    const res = await axiosInstance.post(`/${this.url}`, {
        "SampleData": [
          sampleData
        ],
        "TrainingData": trainingData
      });
      
    console.log('post call', res, res.data);
    return res.data;
  }

}

export const recommenderApi = new RecommenderApi();