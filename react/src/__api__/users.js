import axiosInstance from 'axiosInstance';
import GeneralApi from './general';

class UsersApi extends GeneralApi {
  constructor() {
    super('auth/api/v1/users', 'users_cache');
  }

  async search(search, organization_id = null) {
    console.log('get users call', search, organization_id)
    const ser = `by=${search}`;
    const org = organization_id ? `organization_id=${organization_id}` : '';
    const res = await axiosInstance.get(`/coproduction/api/v1/users/search?${ser}&${org}`);
    console.log('get users call', res.data);
    return res.data;
  }

  async me() {
    // Call auth microservice first in order to create an account if it does not exist
    const res = await axiosInstance.get('/auth/api/v1/users/me');
    console.log(res);
    // Coproduction service gets user data from the auth service
    const res2 = await axiosInstance.get('/coproduction/api/v1/users/me');
    console.log(res2);
    const me = { ...res.data, ...res2.data };
    console.log('get me call', me);
    return me;
  }

  async agreeTerms(){

    try {
          const response = await axiosInstance.put('/coproduction/api/v1/users/agree-terms', {});
          // handle the response if needed
          console.log(response.data);
          return response.data;
    } catch (error) {
      // handle error response
      console.error('Error agreeing to terms:', error.response ? error.response.data : error.message);
    }
  }

  async refuseTerms(){

    try {
          const response = await axiosInstance.put('/coproduction/api/v1/users/refuse-terms', {});
          // handle the response if needed
          console.log(response.data);
          return response.data;
    } catch (error) {
      // handle error response
      console.error('Error when refuse the terms:', error.response ? error.response.data : error.message);
    }
  }


  async downloadUserCertificate(privateCode) {
    const folder_name = 'Certificados_Zgz_09_2023';
    const data_sheet_name = 'mapping_usuarios';
    const downloadURL = `/googledrive/api/v1/download_student_resource/${folder_name}/${data_sheet_name}/${privateCode}`;

    try {
        const response = await axiosInstance.get(downloadURL, { responseType: 'blob' });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'certificate.pdf';  // default filename

        // If the header is present, extract the filename
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        
        // If everything is successful, you can optionally return a success message or nothing.
        return { success: true };

    } catch (error) {
        console.error("There was a problem with the download operation:", error);
        
        // Throw the error so it can be caught in your component.
        // You can decide to throw a custom error message or just forward the one from axios.
        throw new Error(error.response?.data?.message || "There was a problem with the download operation.");
    }
}


 


}

export const usersApi = new UsersApi();
