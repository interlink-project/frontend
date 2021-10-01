import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { UserManager, WebStorageStateStore, Log } from 'oidc-client';
import { IDENTITY_CONFIG, METADATA_OIDC } from '../config';
import { useNavigate } from 'react-router';
import axiosInstance, { setAuthHeader } from '../axios';

const initialState = {
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state) => ({
    ...state,
    isInitialized: true,
  }),
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  SET_USER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: 'OIDC',
  signinRedirectCallback: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signoutRedirectCallback: () => Promise.resolve(),
  isAuthenticated: () => Promise.resolve(),
  signinRedirect: () => Promise.resolve(),
  signinSilentCallback: () => Promise.resolve(),
  signinSilent: () => Promise.resolve(),
  createSigninRequest: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
  parseJwt: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const navigate = useNavigate();

  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const [userManager] = useState(
    new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      metadata: {
        ...METADATA_OIDC,
      },
    })
  );

  useEffect(() => {
    const initialize = async () => {
      Log.logger = console;
      Log.level = Log.DEBUG;

      userManager.events.addUserLoaded((user) => {
        if (window.location.href.indexOf('signin-oidc') !== -1) {
          navigateToScreen();
        }
      });
      userManager.events.addSilentRenewError((e) => {
        console.log('silent renew error', e.message);
      });

      userManager.events.addAccessTokenExpired(() => {
        console.log('token expired');
        startSilentRenew();
        //         signinSilent();
      });

      const user = await userManager.getUser();
      const init = () =>
        dispatch({
          type: 'INITIALIZE',
        });
      if (user && user.access_token) {
        setUser(user.access_token, init);
      } else {
        init();
      }
    };
    initialize();
  }, []);

  const setUser = (access_token, callback) => {
    setAuthHeader(access_token);
    axiosInstance.post('/users/me').then(({ data }) => {
      console.log('RESPONSE FOR ME', data);
      dispatch({
        type: 'SET_USER',
        payload: {
          user: data,
        },
      });
      callback && callback();
    });
  };

  const signinRedirectCallback = (callback) => {
    userManager.signinRedirectCallback().then(async (e) => {
      const user = await userManager.getUser();
      setUser(user.access_token, callback);
    });
  };

  const getUser = async () => {
    const user = await userManager.getUser();
    if (!user) {
      return await userManager.signinRedirectCallback();
    }
    return user;
  };

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  const signinRedirect = () => {
    localStorage.setItem('redirectUri', window.location.pathname);
    userManager.signinRedirect({});
  };

  const navigateToScreen = () => {
    window.location.replace('/dashboard');
  };

  const isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      sessionStorage.getItem(
        `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`
      )
    );
    const authenticated = !!oidcStorage && !!oidcStorage.access_token;
    console.log('isAuthenticated call', oidcStorage);

    if (authenticated && !state.user) {
      setUser(oidcStorage.access_token);
    }
    return authenticated;
  };

  const signinSilent = () => {
    userManager
      .signinSilent()
      .then((user) => {
        console.log('signed in', user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signinSilentCallback = () => {
    userManager.signinSilentCallback();
  };

  const createSigninRequest = () => userManager.createSigninRequest();

  const logout = () => {
    userManager.signoutRedirect({
      id_token_hint: localStorage.getItem('id_token'),
    });
    userManager.clearStaleState();
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const signoutRedirectCallback = () => {
    userManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL);
    });
    userManager.clearStaleState();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'OIDC',
        signinRedirectCallback,
        logout,
        signoutRedirectCallback,
        isAuthenticated,
        signinRedirect,
        signinSilentCallback,
        signinSilent,
        createSigninRequest,
        getUser,
        parseJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
