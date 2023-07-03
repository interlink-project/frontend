import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';

class ParticipationRequestsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/participationrequests');
  }



  //Obtain the list of notification of a user
  async getParticipationRequests(params = {}, language = getLanguage()) {

    //console.log(`/coproduction/api/v1/participationrequests`+params+'  user_id: '+params['search']['user_id']);
    
    let datos={};

    //console.log(`/${this.url}/${params['search']['user_id']}/listParticipationRequests`);

    //Get data of participation_requests
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['user_id']}/listParticipationRequests`, {
        params: removeEmpty(params),
        headers: {
          'Accept-Language': language
        }
      }
    );
    //console.log('listParticipationRequests call', res.data, 'in', language);

    

    datos=res.data;

    return datos;
  }


    //Obtain the list of participation_requests of a coproduction process
    async getFullParticipationRequestsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of participation_requests
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listFullParticipationRequestsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }


    //Obtain the list of participation_requests of a coproduction process
    async getInProgressParticipationRequestsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of participation_requests
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listInprogressParticipationRequestsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
      datos=res.data;
      return datos;
    }
   

  //Change as Archived of a notification to unseen
  async setArchiveParticipationRequest(params = {}){
    let datos={};
    ////console.log(`/${this.url}/${params.participationrequestId}`);
    //Put data of participation_requests

    const res = await axiosInstance.put(
      `/${this.url}/${params.participationrequestId}/archive`, 
      {
        is_archived:true
      }
    );
    datos=res.data;
    return datos;
  }

  
}

export const participationrequestsApi = new ParticipationRequestsApi();
