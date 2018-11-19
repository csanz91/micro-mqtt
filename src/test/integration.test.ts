/**
 * Integration tests for the MQTT client.
 */

// @ts-ignore
import { NodeClient } from './nodetest';
import { Client } from '../module/micro-mqtt';
import IMessage from '../module/IMessage';

describe('The MQTT client', () => {
    let client: Client;
    let isConnected: boolean;

    beforeEach(() => {
        // tslint:disable-next-line:no-unsafe-any
        client = new NodeClient({
            host: 'test.mosquitto.org',
            clientId: 'micro-mqtt',
            will: {
                topic: 'rovale/espruino/status',
                message: 'offline',
                qos: 1,
                retain: true
            }
        });

        client.on('connected', () => {
            isConnected = true;
        });
    });

    afterEach(() => {
        client.disconnect();
    });

    // tslint:disable-next-line promise-function-async
    it('should be able to connect to an MQTT broker.', () => {
        // tslint:disable-next-line:typedef promise-function-async
        const connect = (): Promise<boolean> => {
            // tslint:disable-next-line:promise-must-complete typedef
            return new Promise((resolve) => {
                const poll: () => void = (): void => {
                    setTimeout(() => {
                        if (isConnected) {
                            resolve(isConnected);
                        } else {
                            poll();
                        }
                    },         100);
                };

                client.connect();
                poll();
            });
        };

        return connect().then((result: boolean) => {
            expect(result).toBe(true);
        });
    });
});
