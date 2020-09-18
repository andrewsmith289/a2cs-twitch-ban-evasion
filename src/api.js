'use strict';

const axios = require('axios');

exports.getToken = async (clientId, clientSecret) => {
  const uri = `id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  const res = await axios.post(`https://${uri}`);
  //console.log(res.data.access_token);
  return new Promise((resolve) => {
    resolve(res.data.access_token);
  });
};

exports.getClientId = async (token) => {
  const uri = `id.twitch.tv/oauth2/validate`;
  const res = await axios.get(`https://${uri}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return new Promise((resolve) => {
    resolve(res.data.client_id);
  });
};

exports.getAccountInfo = async (clientId, token, username) => {
  const uri = `api.twitch.tv/helix/users?login=${username}`;
  const res = await axios.get(`https://${uri}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-ID': clientId,
    },
  });
  return new Promise((resolve) => {
    resolve(res.data.data);
  });
};
