var express = require("express");
var app = express();
var Wemo = require("wemo");
var _ = require("lodash");
var client = Wemo.Search();
var devices = [];

client.on('found', function (device) {
    console.log("Device found : " + device.friendlyName);
    var isDeviceRegistered = !!devices.find(function (registeredDevice) {
        return registeredDevice.name === device.friendlyName;
    });

    if (isDeviceRegistered) {
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.use(express.static('public'));