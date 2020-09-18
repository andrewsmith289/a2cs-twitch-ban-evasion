'use strict';

const { execFile } = require('child_process');

let streamPid = 0;
let running = false;

const startStream = (masterAccount, streamKey) => {
  if (0 !== streamPid) {
    return;
  }

  streamPid = execFile('ls', [`streaming ${masterAccount}`, `${streamKey}`])
    .pid;

  setTimeout(() => {
    console.log('Stream started.');
    running = true;
  }, 10 * 1000);

  console.log(`Starting stream. pid ${streamPid}`);
};

const stopStream = () => {
  if (0 === streamPid) {
    return;
  }

  console.log(`Stopping stream. Killing pid ${streamPid}`);
  try {
    process.kill(streamPid, 'SIGKILL');
  } catch (e) {
    console.log(`Process didn't exist.`);
  }

  streamPid = 0;
  running = false;
};

const restartStream = (masterAccount, streamKey) => {
  stopStream();
  startStream(masterAccount, streamKey);
};

const isRunning = () => {
  return running;
};

const getPid = () => {
  return streamPid;
};

exports.startStream = startStream;
exports.stopStream = stopStream;
exports.restartStream = restartStream;
exports.isRunning = isRunning;
exports.getPid = getPid;
