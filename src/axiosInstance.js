import axios from 'axios';

export const getToken = async (dataSpace, username, password) => {
  const clientId = `${ dataSpace }.ziqni.app`;

  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://identity.ziqni.com/realms/ziqni/protocol/openid-connect/token',
      data: {
        client_id: clientId,
        username,
        password,
        grant_type: 'password',
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = data;

    return axios.create({
      baseURL: 'https://api.ziqni.com',
      headers: {
        Authorization: `Bearer ${ access_token }`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.log('GET TOKEN ERROR =>', err.response);
  }
};

