import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';

class UserNotificationsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/usernotifications');
  }

  async getNotification(id) {
    if (id) {
      //Get notification by usernotification id
      const res = await axiosInstance.get(`/${this.url}/${id}`);
      console.log('get notifications data', res.data);
      return res.data;
    }
  }


  //Obtain the list of notification of a user
  async getUserNotifications(params = {}, language = getLanguage()) {

    console.log(`/coproduction/api/v1/usernotifications`+params+'  user_id: '+params['search']['user_id']);
    
    let datos={};

    console.log(`/${this.url}/${params['search']['user_id']}/listUserNotifications`);

    //Get data of user_notifications
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['user_id']}/listUserNotifications`, {
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

  

   //Obtain the list of notification of a user
   async getUnseenUserNotifications(params = {}, language = getLanguage()) {

    console.log(`/coproduction/api/v1/usernotifications`+params+'  user_id: '+params['search']['user_id']);
    
    let datos={};

    console.log(`/${this.url}/${params['search']['user_id']}/listUnseenUserNotifications`);

    //Get data of user_notifications
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['user_id']}/listUnseenUserNotifications`, {
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

  //Change the state of a notification to unseen
  async setSeenUserNotification(params = {}){
    let datos={};
    //console.log(`/${this.url}/${params.usernotificationId}`);
    //Put data of user_notifications

    const res = await axiosInstance.put(
      `/${this.url}/${params.usernotificationId}`, 
      {
        state:true
      }
    );
    datos=res.data;
    return datos;
  }

  //Change the state of all unseen user notification
  async setSeenAllUserNotification(params = {}){
    let datos={};
    //console.log(`/${this.url}/${params.usernotificationId}`);
    //Put data of user_notifications

    await axiosInstance.get(`/${this.url}/setAllSeen`);
    return {};
  }


  

  
}

export const usernotificationsApi = new UserNotificationsApi();