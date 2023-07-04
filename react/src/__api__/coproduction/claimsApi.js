import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';

class ClaimsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/claims');
  }



  //Obtain the list of notification of a user
  async getClaims(params = {}, language = getLanguage()) {

    //console.log(`/coproduction/api/v1/claims`+params+'  user_id: '+params['search']['user_id']);
    
    let datos={};

    //console.log(`/${this.url}/${params['search']['user_id']}/listClaims`);

    //Get data of claims
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['user_id']}/listClaims`, {
        params: removeEmpty(params),
        headers: {
          'Accept-Language': language
        }
      }
    );
    //console.log('listClaims call', res.data, 'in', language);

    datos=res.data;

    return datos;
  }


    //Obtain the list of claims of a coproduction process
    async getFullClaimsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of claims
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listFullClaimsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    //Obtain the list of claims of a coproduction process
    async getFullClaimsbyTaskId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of claims
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['task_id']}/listFullClaimsbyTaskId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    //Obtain the list of claims of a coproduction process
    async getFullClaimsbyAssetId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of claims
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['asset_id']}/listFullClaimsbyAssetId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }



    //Obtain the list of claims of a coproduction process
    async getInPendingClaimsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of claims
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listPendingClaimsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
      datos=res.data;
      return datos;
    }
   

  //Change as Approved of a notification to unseen
  async setApprovedClaim(params = {}){
    let datos={};
    ////console.log(`/${this.url}/${params.claimId}`);
    //Put data of claims

    const res = await axiosInstance.put(
      `/${this.url}/${params.claimId}/approve`, 
      {
        is_archived:true
      }
    );
    datos=res.data;
    return datos;
  }

  
}

export const claimsApi = new ClaimsApi();
