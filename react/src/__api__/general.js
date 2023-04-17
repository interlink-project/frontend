import axiosInstance from 'axiosInstance';
import { getLanguage } from 'translations/i18n';

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export default class GeneralApi {
  constructor(url, cache_key = '') {
    this.url = url;
    this.cache_key = cache_key;
  }

  async create(data) {
    //console.log(data);
    return axiosInstance.post(`/${this.url}`, data);
  }

  async getMulti(params = {}, language = getLanguage()) {
    console.log(`/${this.url}`+params);
    //Get data of user_notifications
    const res = await axiosInstance.get(
      `/${this.url}`, {
        params: removeEmpty(params),
        headers: {
          'Accept-Language': language
        }
      }
    );
    return res.data;
  }

  async update(id, data) {
    if (id) {
      const res = await axiosInstance.put(`/${this.url}/${id}`, data);
      console.log('update call', res.data);
      return res.data;
    }
  }

  async get(id, language = getLanguage()) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}`, {
        headers: {
          'Accept-Language': language
        }
      });
      console.log('get call', res.data, 'in', language);
      return res.data;
    }
  }

  async delete(id) {
    if (id) {
      const res = await axiosInstance.delete(`/${this.url}/${id}`);
      console.log('delete call', res.data);
      return res.data;
    }
  }

  async setFile(id, endpoint, file, language = getLanguage()) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post(
      `/${this.url}/${id}/${endpoint}`,
      formData,
      {
        headers: {
          'Content-type': 'multipart/form-data',
          'Accept-Language': language
        },
      }
    );
    console.log('setLogotype call', res.data);
    return res;
  }

  async addAdministrator(object_id, user_id) {
    if (user_id) {
      const res = await axiosInstance.post(`/${this.url}/${object_id}/administrators`, { user_id });
      console.log('add administrator call', res.data);
      return res.data;
    }
  }

  async removeAdministrator(object_id, user_id) {
    if (user_id) {
      const res = await axiosInstance.delete(`/${this.url}/${object_id}/administrators/${user_id}`);
      console.log('delete administrator call', res.data);
      return res.data;
    }
  }
}
