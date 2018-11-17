var events = require('events');
var net = require('net');
var Client = require('../../espruino/modules/micro-mqtt').Client;

class NodeEventEmitter extends events.EventEmitter {
}

class NodeClient extends Client {
    constructor(options) {
        super(options);

        this.nodeEventEmitter = new NodeEventEmitter();
    }

    on(event, listener) {
        this.nodeEventEmitter.on(event, listener);
    }

    emit(event, args) {
        this.nodeEventEmitter.emit(event, args)
    }    

    onConnect() {
        this.sct.setEncoding('binary');
    }

    write(data) {
        this.sct.write(data, 'binary');
    }
}

var client = new NodeClient({
    host: 'pi',
    clientId: 'micro-mqtt',
    will: {
        topic: 'rovale/espruino/status',
        message: 'offline',
        qos: 1,
        retain: true
    },
});

client.on('connected', () => {
    client.subscribe('rovale/#', 1);
    client.publish('rovale/espruino/status', 'online', 1, true);
});

client.on('receive', (message) => {
    console.log('on receive');
    console.log(message);
});

client.on('debug', (debug) => {
    console.log('[debug] ' + debug);
});

client.on('info', (info) => {
    console.log('[info] ' + info);
});

client.on('error', (error) => {
    console.log('[error] ' + error);
});

client.connect();

global.client = client;
