import axios from 'axios';

const baseURL = '';
export const api = axios.create({
  baseURL: baseURL,
});