import { createSlice } from '@reduxjs/toolkit';
import { storiesApi,coproductionProcessesApi, organizationsApi, usernotificationsApi, coproductionprocessnotificationsApi, teamsApi } from '../__api__';
import { subDays, subHours } from 'date-fns';

const now = new Date();
const initialState = {
  processes: [],
  loadingProcesses: true,

  schemas: [],
  loadingSchemas: false,

  organizations: [],
  loadingOrganizations: false,
  
  usernotifications:[],
  loadingUserNotifications: false,

  coproductionprocessnotifications:[],
  loadingCoproductionProcessNotifications: false,

  unseenusernotifications:[],
  loadingUnseenUserNotifications: false,

  selectedStory:null,
  loadingSelectedStory: false,

  userActivities:[],
  loadingUserActivities: false,
};

const slice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setProcesses(state, action) {
      state.processes = action.payload;
    },
    setLoadingProcesses(state, action) {
      state.loadingProcesses = action.payload;
    },
    setOrganizations(state, action) {
      state.organizations = action.payload;
    },
    setLoadingOrganizations(state, action) {
      state.loadingOrganizations = action.payload;
    },
    setSchemas(state, action) {
      state.schemas = action.payload;
    },
    setLoadingSchemas(state, action) {
      state.loadingSchemas = action.payload;
    },
    setUserNotifications(state, action) {
      state.usernotifications = action.payload;
    },
    setLoadingUserNotifications(state, action) {
      state.loadingUserNotifications = action.payload;
    },
    setCoproductionProcessNotifications(state, action) {
      state.coproductionprocessnotifications = action.payload;
    },
    setLoadingCoproductionProcessNotifications(state, action) {
      state.loadingCoproductionProcessNotifications = action.payload;
    },
    setSelectedStory(state, action) {
      state.selectedStory = action.payload;
    },
    setLoadingSelectedStory(state, action) {
      state.loadingSelectedStory = action.payload;
    },
    setUnseenUserNotifications(state, action) {
      state.unseenusernotifications = action.payload;
    },
    setLoadingUnseenUserNotifications(state, action) {
      state.loadingUnseenUserNotifications = action.payload;
    },
    setUserActivities(state, action) {
      state.userActivities = action.payload;
    },
    setLoadingUserActivities(state, action) {
      state.loadingUserActivities = action.payload;
    },
  }
});

export const { reducer } = slice;

export const getCoproductionProcesses = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingProcesses(true));
  const processes_data = await coproductionProcessesApi.getMulti({ search });
  dispatch(slice.actions.setProcesses(processes_data));
  dispatch(slice.actions.setLoadingProcesses(false));
};

export const getOrganizations = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingOrganizations(true));
  const organizations_data = await organizationsApi.getMulti({ search });
  dispatch(slice.actions.setOrganizations(organizations_data));
  dispatch(slice.actions.setLoadingOrganizations(false));
};

export const getUserNotifications = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingUserNotifications(true));
  const usernotifications_data = await usernotificationsApi.getUserNotifications({ search });
  dispatch(slice.actions.setUserNotifications(usernotifications_data));
  dispatch(slice.actions.setLoadingUserNotifications(false));
};

export const getUnseenUserNotifications = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingUnseenUserNotifications(true));
  const unseenusernotifications_data = await usernotificationsApi.getUnseenUserNotifications({ search });
  dispatch(slice.actions.setUnseenUserNotifications(unseenusernotifications_data));
  dispatch(slice.actions.setLoadingUnseenUserNotifications(false));
};

export const getCoproductionProcessNotifications = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingCoproductionProcessNotifications(true));
  const coproductionprocessnotifications_data = await coproductionprocessnotificationsApi.getCoproductionProcessNotifications({ search });
  console.log(coproductionprocessnotifications_data);
  dispatch(slice.actions.setCoproductionProcessNotifications(coproductionprocessnotifications_data));
  dispatch(slice.actions.setLoadingCoproductionProcessNotifications(false));
};

export const getSelectedStory = (id) => async (dispatch) => {
  dispatch(slice.actions.setLoadingSelectedStory(true));
  const selectedStory_data = await storiesApi.getStoriesbyId(id);
  dispatch(slice.actions.setSelectedStory(selectedStory_data));
  dispatch(slice.actions.setLoadingSelectedStory(false));
};

export const getUserActivities = (params) => async (dispatch) => {
  let callback = notification => notification.user_id === params.user_id;
  let activity = [];
  dispatch(slice.actions.setLoadingUserActivities(true));
  
  for (let i=0; i<params.assets.length; i++){
    let search = { 'coproductionprocess_id': params.coproductionprocess_id,'asset_id': params.assets[i].id} ;
    const coproductionprocessnotifications_data = await coproductionprocessnotificationsApi.getCoproductionProcessNotifications({ search });
    // console.log(coproductionprocessnotifications_data);
    // const filtered = (coproductionprocessnotifications_data.filter(callback));
    activity = activity.concat(coproductionprocessnotifications_data.filter(callback))
  }
  console.log(activity);
  dispatch(slice.actions.setUserActivities(activity));
  dispatch(slice.actions.setLoadingUserActivities(false));
};

export default slice;
