import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';
import { coproductionSchemasApi } from '../catalogue/coproductionSchemasApi';
import { getLanguage } from 'translations/i18n';

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/coproductionprocesses');
  }

  async getProcessCatalogue(id, language = getLanguage()) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/catalogue`, {
        headers: {
          'Accept-Language': language
        }
      });
      //console.log('get call', res.data, 'in', language);
      return res.data;
    }
  }

  async getAssets(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/assets`);
      console.log('get assets', res.data);
      return res.data;
    }
  }

  async addTeam(id, team_id) {
    if (id) {
      const res = await axiosInstance.post(`/${this.url}/${id}/add_team`, { team_id });
      console.log('add team', res.data);
      return res.data;
    }
  }

  async addUser(id, user_id) {
    if (id) {
      console.log({ user_id });
      const res = await axiosInstance.post(`/${this.url}/${id}/add_user`, { user_id });
      console.log('add user', res.data);
      return res.data;
    }
  }

  async getTree(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/tree`);
      console.log('get tree', res.data);
      return res.data;
    }
  }

  async getTreeCatalogue(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/tree/catalogue`);
      //console.log('get tree', res.data);
      return res.data;
    }
  }

  async setSchema(id, coproductionschema_id, language) {
    if (id) {
      const schema = await coproductionSchemasApi.get(coproductionschema_id, language);
      const res = await axiosInstance.post(`/${this.url}/${id}/set_schema`, schema);
      console.log('set schema', res.data);
      return res.data;
    }
  }

  async clearSchema(id) {
    if (id) {
      const res = await axiosInstance.post(`/${this.url}/${id}/clear_schema`);
      console.log('clear schema', res.data);
      return res.data;
    }
  }

  // The timeout: 0 is needed to avoid the default timeout of 40s
  async copy(id,label_name,from_view='settings') {
    console.log(`/${this.url}/${id}/copy?label_name=${label_name}&from_view=${from_view}`);
    if (id) {
      const res = await axiosInstance.request({
        method: 'post',
        url: `/${this.url}/${id}/copy?label_name=${label_name}&from_view=${from_view}`,
        timeout: 0,
      });
      console.log('copy', res.data);
      return res.data;
    }
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();
