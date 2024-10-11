import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.0.0.17:3000', 
  timeout: 5000, 
});

export default instance;
