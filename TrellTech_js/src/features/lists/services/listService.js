import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_TRELLO_API_KEY;
const TOKEN = process.env.EXPO_PUBLIC_TOKEN;
const BASE_URL = process.env.EXPO_PUBLIC_TRELLO_API_BASE_URL;

export const createList = (boardId, name) =>
  axios.post(`${BASE_URL}/lists?name=${name}&idBoard=${boardId}&key=${API_KEY}&token=${TOKEN}`);

export const getLists = (boardId) =>
  axios.get(`${BASE_URL}/members/me/boards?key=${API_KEY}&token=${TOKEN}`);
//   axios.get(`${BASE_URL}/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`);

export const updateList = (listId, name) =>
  axios.put(`${BASE_URL}/lists/${listId}?name=${name}&key=${API_KEY}&token=${TOKEN}`);

export const archiveList = (listId) =>
  axios.put(`${BASE_URL}/lists/${listId}/closed?value=true&key=${API_KEY}&token=${TOKEN}`);
