import axios from 'axios';

const client = axios.create({
  baseURL: 'https://vantum-test.herokuapp.com/',
});

export default axios;