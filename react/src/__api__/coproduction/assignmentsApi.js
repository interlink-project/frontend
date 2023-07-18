import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from '../general';
import { getLanguage } from 'translations/i18n';

class AssignmentsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/assignments');
  }



  //Obtain the list of notification of a user
  async getAssignments(params = {}, language = getLanguage()) {

    //console.log(`/coproduction/api/v1/assignments`+params+'  user_id: '+params['search']['user_id']);
    
    let datos={};

    //console.log(`/${this.url}/${params['search']['user_id']}/listAssignments`);

    //Get data of assignments
    const res = await axiosInstance.get(
      `/${this.url}/${params['search']['user_id']}/listAssignments`, {
        params: removeEmpty(params),
        headers: {
          'Accept-Language': language
        }
      }
    );
    //console.log('listAssignments call', res.data, 'in', language);

    datos=res.data;

    return datos;
  }


    //Obtain the list of assignments of a coproduction process
    async getFullAssignmentsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listFullAssignmentsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    //Obtain the list of assignments of a coproduction process
    async getFullAssignmentsbyCoproIdUserId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listFullAssignmentsbyCoproIdUserId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    //Obtain the list of assignments of a coproduction process
    async getFullAssignmentsbyTaskId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['task_id']}/listFullAssignmentsbyTaskId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    //Obtain the list of assignments of a coproduction process
    async getFullAssignmentsbyAssetId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['asset_id']}/listFullAssignmentsbyAssetId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
 
      datos=res.data;
      return datos;
    }

    
    //Obtain the list of assignments of a coproduction process
    async getAssignmentbyId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['assignment_id']}/view`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
      datos=res.data;
      return datos;
    }


    //Obtain the list of assignments of a coproduction process
    async getInPendingAssignmentsbyCoproId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listPendingAssignmentsbyCoproId`, {
          params: removeEmpty(params),
          headers: {
            'Accept-Language': language
          }
        }
      );
      
      datos=res.data;
      return datos;
    }
   
    //Obtain the list of assignments of a coproduction process and User
    async getInPendingAssignmentsbyCoproIdUserId(params = {}, language = getLanguage()) {

      let datos={};
      
      //Get data of assignments
      const res = await axiosInstance.get(
        `/${this.url}/${params['search']['coproductionprocess_id']}/listPendingAssignmentsbyCoproIdUserId`, {
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
  async setApprovedAssignment(params = {}){
    let datos={};
    ////console.log(`/${this.url}/${params.assignmentId}`);
    //Put data of assignments

    const res = await axiosInstance.put(
      `/${this.url}/${params.assignmentId}/approve`, 
      {
        state:true
      }
    );
    datos=res.data;
    return datos;
  }

   //Change as Approved of a notification to unseen
   async setInProgressAssignment(params = {}){
    let datos={};
    ////console.log(`/${this.url}/${params.assignmentId}`);
    //Put data of assignments

    const res = await axiosInstance.put(
      `/${this.url}/${params.assignmentId}/approve`, 
      {
        state:false
      }
    );
    datos=res.data;
    return datos;
  }


  async createAssignmentsForUsers(assignmentData = {}, language = getLanguage()) {
    

    try {
        // You need to replace this URL with the appropriate endpoint on your server that accepts assignment creation requests
        const res = await axiosInstance.post(
            `/${this.url}/create_user_list`, // I've updated the URL to match your new endpoint
            assignmentData,  // The assignment data here should be whatever data is required to create a assignment
            {
                headers: {
                    'Accept-Language': language
                }
            }
        );

        // Push each response to an array
        return res.data;

    } catch(error) {
        console.error(`Error creating assignments: `, error);
        // If an error happens, you can decide whether to stop the whole process or continue with the next user
        // In this case, we just log the error and continue with the next user
    }
}


async createAssignmentsForTeams(assignmentData = {}, language = getLanguage()) {


  try {
      // You need to replace this URL with the appropriate endpoint on your server that accepts assignment creation requests
      const res = await axiosInstance.post(
          `/${this.url}/create_team_list`, // I've updated the URL to match your new endpoint
          assignmentData,  // The assignment data here should be whatever data is required to create a assignment
          {
              headers: {
                  'Accept-Language': language
              }
          }
      );

      // Push each response to an array
      return res.data;

  } catch(error) {
      console.error(`Error creating assignments: `, error);
      // If an error happens, you can decide whether to stop the whole process or continue with the next user
      // In this case, we just log the error and continue with the next user
  }


}



  
}

export const assignmentsApi = new AssignmentsApi();
