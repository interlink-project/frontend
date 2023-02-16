import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class GamesApi extends GeneralApi {
  constructor() {
    super('interlink-gamification/interlink/game/');
  }

  async getGame(gameId) {
    const res = await axiosInstance.get(`${this.url}${gameId}`);
    return res.data;
  }

};

export const gamesApi = new GamesApi();