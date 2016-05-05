'use strict';

const Wemo = require('wemo');
const CronJob = require('cron').CronJob;

const wClient = Wemo.Search(); // eslint-disable-line babel/new-cap

const devices = [];

function toggleDevice(conf) {
  const device = getDevice(conf.name);
  const wemo = new Wemo(device.ip, device.port);
  wemo.getBinaryState((err, result) => {
    if (err) {
      conf.onError(err);
      return;
    }
    wemo.setBinaryState(-result + 1, err => {
      if (err) {
        conf.onError(err);
        return;
      }
      conf.onSuccess();
    });
  });
}

function getDevice(name) {
  return devices.find(device => device.name === name);
}

wClient.on('found', device => {
  console.log(`Device found : ${device.friendlyName}`);
  const isDeviceRegistered = Boolean(devices.find(registeredDevice => {
    return registeredDevice.name === device.friendlyName;
  }));

  if (isDeviceRegistered) {
    console.log(`Device '${device.friendlyName}' already registered`);
    return;
  }

  if (getDevice(device.friendlyName)) {
    console.log(`Device '${device.friendlyName}' already registered`);
    return;
  }
  devices.push({
    name: device.friendlyName,
    ip: device.ip,
    port: device.port
  });
  console.log(`New device '${device.friendlyName}' registered`);
});

const jobWakeUp = new CronJob('*/2 30 11 * * 1-5',
() => {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  toggleDevice({
    name: 'lumiereLit',
    onSuccess: () => {
      console.log({
        success: true,
        message: 'OK'
      });
    },
    onError: err => {
      console.error({
        success: false,
        message: err
      });
    }
  });
});

setTimeout(() => {
  jobWakeUp.start();
  console.log('CRON jobWakeUp running !');
}, 1500);

exports.toggle = function (req, res) {
  // if (devices.find(device => device.name === req.params.name)) {
  //   // return error
  // }
  toggleDevice({
    name: req.params.name,
    onSuccess: () => {
      res.status(200).json({
        success: true,
        message: 'OK'
      });
    },
    onError: err => {
      res.status(500).json({
        success: false,
        message: err
      });
    }
  });
};

exports.index = function (req, res) {
  res.status(200).json({
    devices
  });
};
