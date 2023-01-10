import { createSlice } from '@reduxjs/toolkit';
import { coproductionProcessesApi, organizationsApi, usernotificationsApi, coproductionprocessnotificationsApi, teamsApi } from '../__api__';
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
    setUnseenUserNotifications(state, action) {
      state.unseenusernotifications = action.payload;
    },
    setLoadingUnseenUserNotifications(state, action) {
      state.loadingUnseenUserNotifications = action.payload;
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

export const getCoproductionProcessNotifications_byCoproId = (search) => async (dispatch) => {
  dispatch(slice.actions.setLoadingCoproductionProcessNotifications(true));
  const coproductionprocessnotifications_data = await coproductionprocessnotificationsApi.getCoproductionProcessNotifications_byCoproId({ search });
  dispatch(slice.actions.setCoproductionProcessNotifications(coproductionprocessnotifications_data));
  dispatch(slice.actions.setLoadingCoproductionProcessNotifications(false));
};


export default slice;
