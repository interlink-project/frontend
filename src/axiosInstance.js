import axios from 'axios'
import store from 'store'

// https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token

export const getAccessToken = () => store.get('accessToken')

export const setAuthHeader = (accessToken) => {
  if (accessToken) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
  } else {
    delete axiosInstance.defaults.headers.Authorization
  }
}

export const getImageUrl = (path) => path && `${process.env.REACT_APP_BACKEND_URL}${path}`

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1/`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    // 'Accept-Language': store.get('language', 'es'),
  },
})

export default axiosInstance