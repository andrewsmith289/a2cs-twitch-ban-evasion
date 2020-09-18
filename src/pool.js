'use strict';

const fs = require('fs');
const { getToken, getClientId, getAccountInfo } = require('./api');
const { exit } = require('process');

const CONFIG_PATH = './config/pool-config.json';
const POOL_PATH = './config/account-pool.json';

if (!fs.existsSync(CONFIG_PATH)) {
  console.log(`Account pool data not found at ${CONFIG_PATH}`);
  exit();
}

if (!fs.existsSync(POOL_PATH)) {
  console.log(`Account pool data not found at ${POOL_PATH}`);
  exit();
}

let config = JSON.parse(fs.readFileSync(CONFIG_PATH));
let pool = JSON.parse(fs.readFileSync(POOL_PATH));

const getAccount = () => {
  return pool[pool.length - 1];
};

const removeAccount = () => {
  const username = getAccount().username;
  console.log(`Account ${username} removed from pool.`);
  pool.pop();
  console.log(`${pool.length} accounts remaining in the pool.`);
};

const saveData = () => {};

const accountExists = async () => {
  const username = getAccount().username;
  console.log(`Checking if active account '${username}' exists...`);

  let token = await getToken(config.client_id, config.client_secret);
  let clientId = await getClientId(token);
  let userInfo = await getAccountInfo(clientId, token, username);

  if (userInfo.length !== 0) {
    console.log('User exists.');
    return true;
  }

  console.log("User doesn't exist.");
  removeAccount();
  saveData();
  return false;
};

exports.getAccount = getAccount;
exports.accountExists = accountExists;
