[![Build Status](https://travis-ci.org/rovale/micro-mqtt.svg?branch=master)](https://travis-ci.org/rovale/micro-mqtt)
[![Coverage Status](https://coveralls.io/repos/github/rovale/micro-mqtt/badge.svg?branch=master)](https://coveralls.io/github/rovale/micro-mqtt?branch=master)
[![dependency Status](https://david-dm.org/rovale/micro-mqtt/status.svg)](https://david-dm.org/rovale/micro-mqtt)
[![devDependency Status](https://david-dm.org/rovale/micro-mqtt/dev-status.svg)](https://david-dm.org/rovale/micro-mqtt#info=devDependencies)
# micro-mqtt

A MQTT client for [Espruino](http://www.espruino.com/).
## TODO list
- [x] Convert to TypeScript and restructure
- [x] Enable unit testing
- [x] Enable tslint with suitable settings
- [ ] **Code coverage > 80%**
- [ ] **Improve assertions on packet content**
- [ ] Handle receiving multiple control packets at once
- [ ] Handle not being able to establish connection to host
- [ ] Implement Last Will and Testament
- [ ] Remove cleanSession options &
- [ ] Remove generated client id
- [ ] Create a build
- [ ] Reconnect on lost connection
- [ ] Optimize memory usage and size

## Technial notes
- About code coverage
    - Currently using [Coverall](https://coveralls.io/github/rovale/micro-mqtt) with [Istanbul](https://github.com/gotwarlost/istanbul)
    - TODO
        - [ ] Figure out how to get reports of the actual TypeScript sources.
        - [ ] Figure out how to see the same detailed level of coverage shown by the original Istanbul coverage reports. 
        
- About [tslint](https://www.npmjs.com/package/tslint)
    - It works perfectly fine in VSCode when the [extension](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) is installed.
    - Atom works by default.
    - tslint.json initially taken from https://github.com/Microsoft/tslint-microsoft-contrib/blob/2.0.2/tslint.json
    - TODO
        - [ ] File an issue for no-document-write, it fails when enabled.
        - [ ] Figure out cause of misplaced 'else' warning.
            - [ ] Add tslint to test if this is resolved.

Based on the [Espruino MQTT.js module](https://github.com/espruino/EspruinoDocs/blob/master/modules/MQTT.md) by Lars Toft Jacobsen (boxed.dk), Gordon Williams. License: MIT.

