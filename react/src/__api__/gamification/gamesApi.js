import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class GamesApi extends GeneralApi {
  constructor() {
    // Review the creation of gamification apis by /<variableName>
    super('interlink-gamification/interlink/game/processId/');
  }

  async getGame(gameId) {
    const res = await axiosInstance.get(`${this.url}${gameId}`);
    return res.data;
  }

};

export const gamesApi = new GamesApi();