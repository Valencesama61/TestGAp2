import axios from 'axios';
import { TRELLO_API_BASE_URL, TRELLO_API_KEY } from './constants';

/**
 * Client Axios de base pour Trello
 */
const trelloClient = axios.create({
  baseURL: TRELLO_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  params: {
    key: TRELLO_API_KEY,
  },
});

export default trelloClient;