var express = require("express");
var app = express();
var Wemo = require("wemo");
var _ = require("lodash");
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var CronJob = require('cron').CronJob;
var client = Wemo.Search();
var devices = [];
var alarms = [];

app.use(express.static('public'));
app.use(bodyParser.json());

client.on('found', function (device) {
    console.log("Device found : " + device.friendlyName);
    var isDeviceRegistered = !!devices.find(function (registeredDevice) {
        return registeredDevice.name === device.friendlyName;
    });

    if (isDeviceRegistered) {
        console.log("Device '" + device.friendlyName + "' already registered");
        return;
    }


    if (!!getDevice(device.friendlyName)) {
        console.log("Device '" + device.friendlyName + "' already registered");
        return;
    }
    devices.push({
        name: device.friendlyName,
        ip: device.ip,
        port: device.port
    });
    console.log("Device registered.");
});

new CronJob('0 8 * * *', function(){
    playAction({
        action: "on",
        name: "lumiereLit",
        onSuccess: _.noop,
        onError: _.noop
    });
}, null, true);

app.post('/alarms/add', function (req, res) {
    var deviceName = req.body.name;
    var alarmTimer = new Date(req.body.alarmTimer);
    var action = req.body.action;
    console.log(req.body.alarmTimer);
    console.log("Adding new alarm : ", deviceName, action, alarmTimer);
    var job = schedule.scheduleJob(alarmTimer, function () {
        console.log("Executing job : ", deviceName, action);
        playAction({
            name: deviceName,
            action: action,
            onSuccess: function () {
                console.log("Job executed");
            },
            onError: function (err) {
                console.log(err);
            }
        });
    });
    alarms.push(job);
    res.send({ success: true });
});
app.get('/switch/:name', function (req, res) {
    var wemo;
    if (!!getDevice(req.params.name)) {
        Wemo.Search(req.params.name, function (err, device) {

        });
    }
    toggleDevice({
        name: req.params.name,
        onSuccess: function () {
            res.send({
                success: true
            });
        },
        onError: function (err) {
            res.send({
                success: false,
                message: err
            });
        }
    });
});

app.get('/', function (req, res) {
    res.send('Hello World!');
    var wemo = new Wemo(devices[0].ip, devices[0].port);
    wemo.getBinaryState(function (err, result) {
        if (err) console.error(err);
        wemo.setBinaryState(-result + 1, function (err, result) { // switch on
            if (err) console.error(err);
            console.log("light switch");
        });
    });
});

app.get("/list", function (req, res) {
    res.send({ devices });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function getDevice(name) {
    return devices.find(device => device.name === name);
}

function toggleDevice(conf) {
    var device = getDevice(conf.name);
    var wemo = new Wemo(device.ip, device.port);
    wemo.getBinaryState(function (err, result) {
        if (err) {
            conf.onError(err);
            return;
        }
        wemo.setBinaryState(-result + 1, function (err, result) {
            if (err) {
                conf.onError(err);
                return;
            }
            conf.onSuccess();
        });
    });
}

function setDeviceState(conf) {
    var device = getDevice(conf.name);
    var wemo = new Wemo(device.ip, device.port);
    wemo.setBinaryState(conf.state, function (err, result) {
        if (err) {
            conf.onError(err);
            return;
        }
        conf.onSuccess();
    });
}

function playAction(conf) {
    var defaultConf = {
      name: conf.name  
    };
    switch (conf.action) {
        case "on":
            conf.state = 1;
            setDeviceState(conf);
            break;
            
        case "off":
            conf.state = 0;
            setDeviceState(conf);
            break;
    };
}