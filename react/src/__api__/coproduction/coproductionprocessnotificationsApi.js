import axiosInstance from "axiosInstance";
import GeneralApi, { removeEmpty } from "../general";
import { getLanguage } from "translations/i18n";

class CoproductionProcessNotificationsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/coproductionprocessnotifications");
  }

  async createbyEvent(data) {
    return axiosInstance.post(`/${this.url}/createbyEvent`, data);
  }

  async getNotification(id) {
    if (id) {
      //Get notification by coproductionprocessnotification id
      const res = await axiosInstance.get(`/${this.url}/${id}`);
      return res.data;
    }
  }

  async updateAssetNameParameter(data) {
    //Call update method in backend

    const res = await axiosInstance.put(
      `/${this.url}/updateAssetNameParameter/${data.asset_id}?name=${data.name}&coproductionprocess_id=${data.coproductionprocess_id}`
    );
    //console.log('put coproductionnotifications with assetName', res.data);
    return res.data;
  }

  //Obtain the list of notification of a coproductionprocess
  async getCoproductionProcessNotifications(
    params = {},
    language = getLanguage()
  ) {
    //console.log(`/coproduction/api/v1/coproductionprocessnotifications`+params+'  coproductionprocess_id: '+params['search']['coproductionprocess_id']+'  asset_id: '+params['search']['asset_id']);

    let datos = {};

    //console.log(`/${this.url}/${params['search']['coproductionprocess_id']}/${params['search']['asset_id']}/listCoproductionProcessNotifications`);

    let ruta = "";
    if (params["search"]["asset_id"] != "") {
      ruta = `/${this.url}/${params["search"]["coproductionprocess_id"]}/${params["search"]["asset_id"]}/listCoproductionProcessNotifications`;
    } else {
      ruta = `/${this.url}/${params["search"]["coproductionprocess_id"]}/listCoproductionProcessNotifications`;
    }

    //Get data of coproductionprocess_notifications
    const res = await axiosInstance.get(ruta, {
      params: removeEmpty(params),
      headers: {
        "Accept-Language": language,
      },
    });

    datos = res.data;

    return datos;
  }
}

export const coproductionprocessnotificationsApi =
  new CoproductionProcessNotificationsApi();
