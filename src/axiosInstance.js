import axios from 'axios';

let currentToken = null;
let refreshToken = null;
let tokenExpiresAt = null;
let dataSpace = null;
let username = null;
let password = null;
let refreshTokenTimer = null;

const updateToken = async () => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://identity.ziqni.com/realms/ziqni/protocol/openid-connect/token',
      data: new URLSearchParams({
        client_id: `${dataSpace}.ziqni.app`,
        username,
        password,
        grant_type: 'password',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = data;

    currentToken = access_token;
    refreshToken = refresh_token;
    tokenExpiresAt = Date.now() + expires_in * 1000;

    console.log('Token updated:', currentToken);
  } catch (err) {
    console.error('Error updating token:', err);
  }
};

const startTokenRefresh = () => {
  refreshTokenTimer = setInterval(() => {
    if (currentToken && Date.now() >= tokenExpiresAt - 60000) {
      updateToken();
    }
  }, 60000);
};

export const stopTokenRefresh = () => {
  if (refreshTokenTimer) {
    clearInterval(refreshTokenTimer);
    refreshTokenTimer = null;
  }
};

export const getApiInstance = async (space, user, pass) => {
  dataSpace = space;
  username = user;
  password = pass;

  if (!currentToken || Date.now() >= tokenExpiresAt - 60000) {
    await updateToken();
    startTokenRefresh();
  }

  return axios.create({
    baseURL: 'https://api.ziqni.com',
    headers: {
      Authorization: `Bearer ${currentToken}`,
      'Content-Type': 'application/json',
    },
  });
};
