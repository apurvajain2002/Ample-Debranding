export const APP_AUTH_BASE_URL = process.env.REACT_APP_APP_API_BASE_URL;
export const APP_AUTH_URL = process.env.REACT_APP_APP_AUTH_URL;

export const baseUrl = process.env.REACT_APP_APP_API_BASE_URL; // harsh_HSC did this 20 months ago
//export const baseUrl = APP_AUTH_BASE_URL; // my chnages based on 12th 09 stand up call

export const OAUTH = {
  CLIENT_ID: "ev-client-1",
  CLIENT_SECRET: "egov",
  GRANT_TYPE: "authorization_code",
  REDIRECT_URI: process.env.REACT_APP_APP_API_REDIRECT_URL,
};
