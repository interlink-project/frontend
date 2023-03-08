import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class GamesApi extends GeneralApi {
  constructor() {
    // Review the creation of gamification apis by /<variableName>
    super('interlink-gamification/interlink/game/');
  }

  async getGame(processId) {
    const res = await axiosInstance.get(`${this.url}processId/${processId}`);
    return res.data;
  }

  async setGame(processId, taskList) {
  
    const res = await axiosInstance.post(`${this.url}processId/${processId}`, {
      _id: 'null',
      name: 'complexityGame',
      filename: 'game_1.json',
      tagList: ['process1', 'process3'],
      taskList
    });
    return res.data;
  }

  async deleteGame(gameId) {
    const res = await axiosInstance.delete(`${this.url}${gameId}`);
    return res.data;
  }

  async addClaim(gameId, taskId, userId, username, contrib_value) {
    const res = await axiosInstance.put(`${this.url}${gameId}/task/${taskId}/claim`, {
      id: userId,
      name: username,
      development: contrib_value
    });
    return res.data;
  }

  async completeTask(gameId, taskId) {
    const res = await axiosInstance.put(`${this.url}${gameId}/task/${taskId}/complete`);
    return res.data;
  }

  async getTask(gameId, taskId) {
    const res = await axiosInstance.get(`${this.url}${gameId}/task/${taskId}`);
    return res.data;
  }
};

export const gamesApi = new GamesApi();