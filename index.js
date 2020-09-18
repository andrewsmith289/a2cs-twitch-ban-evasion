'use strict';

const express = require('express');
const fs = require('fs');
const { startStream, restartStream, isRunning } = require('./src/stream');
const { accountExists, getAccount } = require('./src/pool');

const loadConfig = (path) => {
  if (!fs.existsSync(path)) {
    console.log(`Config data not found at ${path}`);
    exit();
  }
  return JSON.parse(fs.readFileSync(path));
};
const config = loadConfig('./config/config.json');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get('/activeUser', (req, res) => {
  const allowedIps = config.api_allowed_ips;
  const reqIp = req.connection.remoteAddress;

  console.log(`Client ${reqIp} requested /activeUser endpoint.`);

  if (!allowedIps.includes(reqIp)) {
    console.log(`-Request denied. IP not in allowed IP list.`);
    res.status(403).send();
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.json({ username: getAccount().username });
});

const run = async () => {
  const streamKey = getAccount().stream_key;
  const masterAccount = config.master_stream;

  startStream(masterAccount, streamKey);

  const interval = await setInterval(async () => {
    if (!isRunning()) {
      return;
    }
    if (false === (await accountExists())) {
      restartStream();
    }
  }, config.interval * 1000);
};

run();
