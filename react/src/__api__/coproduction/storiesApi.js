import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';
import { date } from 'yup';

class StoriesApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/stories');
  }

  async create(extractedData,processId){
      const newStory={
        data_story:extractedData,
        state:true,
        rating:3
      };
      console.log(newStory);

      return axiosInstance.post(`/${this.url}/${processId}/createStory`, newStory);
  }

  async getStoriesbyId(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}/story`);
      console.log('get notifications data', res.data);
      return res.data;
    }
  }

  async getStoriesbyCopro(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}/listStories`);
      console.log('get notifications data', res.data);
      return res.data;
    }
  }

  async getStories() {
   
    const res = await axiosInstance.get(`/${this.url}/listStories`);
    console.log('get notifications data', res.data);
    return res.data;
  
  }


  
}

export const storiesApi = new StoriesApi();
