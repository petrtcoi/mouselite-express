import axios from 'axios';
import * as moySkaldConfig from '../../../config/moySklad';

import Credential from '../../../models/credential.models';

const _getToken = () => {
  let token = '';
  return async () => {
    if (token !== '') return token;
    const doc = await Credential.findOne({ key: 'moyskladToken' });
    token = doc?.value || '';
    return token;
  };
};
const getToken = _getToken();

const moyskladHttp = axios.create({
  baseURL: moySkaldConfig.baseUrl,
  headers: { 'Accept-Encoding': 'gzip' },
  validateStatus: () => true,
});

moyskladHttp.interceptors.request.use(async config => {
  const token = await getToken();
  return {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
});

export default moyskladHttp;
