/* export const TRELLO_API_BASE_URL = process.env.TRELLO_API_BASE_URL || "https://api.trello.com/1";
export const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
export const TRELLO_TOKEN_SCOPES = 'read,write,account';
export const TRELLO_TOKEN_EXPIRATION = '30days';
export const TRELLO_AUTH_URL = `https://trello.com/1/authorize?expiration=${TRELLO_TOKEN_EXPIRATION}&name=TrellTech&scope=${TRELLO_TOKEN_SCOPES}&response_type=token&key=${TRELLO_API_KEY}`; */

export const TRELLO_API_BASE_URL = process.env.EXPO_PUBLIC_TRELLO_API_BASE_URL || "https://api.trello.com/1";
export const TRELLO_API_KEY = process.env.EXPO_PUBLIC_TRELLO_API_KEY;
export const TRELLO_TOKEN_SCOPES = 'read,write,account';
export const TRELLO_TOKEN_EXPIRATION = '30days';
export const TRELLO_AUTH_URL = `https://trello.com/1/authorize?expiration=${TRELLO_TOKEN_EXPIRATION}&name=TrellTech&scope=${TRELLO_TOKEN_SCOPES}&response_type=token&key=${TRELLO_API_KEY}`;