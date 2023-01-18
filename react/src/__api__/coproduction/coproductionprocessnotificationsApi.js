import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';

class CoproductionProcessNotificationsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/coproductionprocessnotifications');
  }

  async getNotification(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}`);
      console.log('get notifications data', res.data);
      return res.data;
    }
  }


  //Obtain the list of notification of a coproductionprocess
  async getCoproductionProcessNotifications_byCoproId(params = {}, language = getLanguage()) {

    console.log(`/coproduction/api/v1/coproductionprocessnotifications`+params+'  coproductionprocess_id: '+params['search']['coproductionprocess_id']);
    
    let datos={};

    console.log(`/${this.url}/${params['search']['coproductionprocess_id']}/listCoproductionProcessNotifications`);

    //Get data of coproductionprocess_notifications
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['coproductionprocess_id']}/listCoproductionProcessNotifications`, {
        params: removeEmpty(params),
        headers: {
          'Accept-Language': language
        }
      }
    );
    console.log('getMulti call', res.data, 'in', language);

    

    datos=res.data;

    return datos;
  }

  


  
  

  
}

export const coproductionprocessnotificationsApi = new CoproductionProcessNotificationsApi();