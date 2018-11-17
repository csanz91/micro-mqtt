[![Build Status](https://travis-ci.org/rovale/micro-mqtt.svg?branch=master)](https://travis-ci.org/rovale/micro-mqtt)
[![Coverage Status](https://coveralls.io/repos/github/rovale/micro-mqtt/badge.svg?branch=master)](https://coveralls.io/github/rovale/micro-mqtt?branch=master)
[![dependency Status](https://david-dm.org/rovale/micro-mqtt/status.svg)](https://david-dm.org/rovale/micro-mqtt)
[![devDependency Status](https://david-dm.org/rovale/micro-mqtt/dev-status.svg)](https://david-dm.org/rovale/micro-mqtt#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/rovale/micro-mqtt.svg)](https://greenkeeper.io/)

# micro-mqtt

A lightweight MQTT client. I keep it to stay up to date with TypeScript. Don't use it for anything serious! :-)

## Technial notes
- The [npm-scripts](https://docs.npmjs.com/misc/scripts) are documented with [npm-scripts-info](https://www.npmjs.com/package/npm-scripts-info).

- The unit tests can be debugged in [Visual Studio Code](https://code.visualstudio.com/). The .vscode/launch.json is configured for this project, just put a breakpoint in the TypeScript code and press F5.

- Based on the [Espruino MQTT.js module](https://github.com/espruino/EspruinoDocs/blob/master/modules/MQTT.md) by Lars Toft Jacobsen (boxed.dk), Gordon Williams. License: MIT.

```
    ----> add method WriteToSocket.......
    Client.prototype.subscribe = function (topic, qos) {
        if (qos === void 0) { qos = 0 /* DefaultQos */; }
        if (this.sct) {
            var x = Protocol.createSubscribe(topic, qos);
            var buf = Buffer(x, 'binary');
            console.log(this.sct.write(buf));
        }
    };
```