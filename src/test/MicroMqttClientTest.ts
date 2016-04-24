/**
 * Tests for the MQTT client.
 */
/// <reference path='_common.ts' />
import { ConnectFlags, ConnectReturnCode } from '../module/micro-mqtt';
import ControlPacketType from '../module/ControlPacketType';
import { MicroMqttClientTestSubclass, TestNetwork, TestNetworkSocket} from './TestClasses';
import ControlPacketVerifier from './ControlPacketVerifier';
import { ControlPacketBuilder, MicroMqttClientTestSubclassBuilder } from './Builders';
import * as sinon from 'sinon';

describe('MicroMqttClient', () => {
    let subject: MicroMqttClientTestSubclass;
    let networkSocket: TestNetworkSocket;

    describe('When establishing a network connection', () => {
        let network: TestNetwork;

        describe('to a specific host and port', () => {
            beforeEach(() => {
                network = new TestNetwork();
                network.connectIsCalled.should.be.equal(false, 'did not expect the client to connect to the network yet');
                subject = new MicroMqttClientTestSubclass({ host: 'some-host', port: 1234 }, network);
                subject.connect();
            });

            it('it should emit information about this action', () => {
                subject.shouldHaveEmittedInfo(`Connecting MicroMqttClient ${subject.version} to some-host:1234`);
            });

            it('it should try to establish a connection to the expected host and port', () => {
                network.connectIsCalled.should.be.equal(true, 'expected the client to connect to the network');
                network.options.host.should.equal('some-host');
                network.options.port.should.equal(1234);
            });
        });

        describe('without specifying the port', () => {
            beforeEach(() => {
                network = new TestNetwork();
                subject = new MicroMqttClientTestSubclass({ host: 'some-host' }, network);
                subject.connect();
            });

            it('it should default to port 1883', () => {
                network.options.port.should.equal(1883);
            });
        });
    });

    describe('When the network connection is established', () => {
        let network: TestNetwork;

        describe('and no username and password are specified', () => {
            beforeEach(() => {
                network = new TestNetwork();
                subject = new MicroMqttClientTestSubclass({ host: 'some-host', clientId: 'some-client' }, network);
                networkSocket = new TestNetworkSocket();
                subject.connect();
                network.callback(networkSocket);
            });

            it('it should send a Connect packet without username and password', () => {
                networkSocket.sentPackages.should.have.lengthOf(1);
                const packet = new ControlPacketVerifier(networkSocket.sentPackages[0]);

                packet.shouldBeOfType(ControlPacketType.Connect);
                packet.shouldHaveValidRemainingLength();
                packet.shouldHaveMqttProtocol();
                packet.shouldHaveProtocolLevel4();
                packet.shouldHaveConnectFlags(ConnectFlags.CleanSession);
                packet.shouldHaveKeepAliveOf60Seconds();
                packet.shouldHavePayload('some-client');
            });
        });

        describe('and only a username is specified', () => {
            beforeEach(() => {
                network = new TestNetwork();
                subject = new MicroMqttClientTestSubclass(
                    { host: 'host', clientId: 'some-client', username: 'some-username' }, network);
                networkSocket = new TestNetworkSocket();
                subject.connect();
                network.callback(networkSocket);
            });

            it('it should send a Connect packet with username and without password', () => {
                networkSocket.sentPackages.should.have.lengthOf(1);
                const packet = new ControlPacketVerifier(networkSocket.sentPackages[0]);
                packet.shouldHaveConnectFlags(ConnectFlags.UserName | ConnectFlags.CleanSession);
                packet.shouldHavePayload('some-client', 'some-username');
            });
        });

        describe('and the username and password are specified', () => {
            beforeEach(() => {
                network = new TestNetwork();
                subject = new MicroMqttClientTestSubclass(
                    { host: 'host', clientId: 'some-client', username: 'some-username', password: 'some-password' }, network);
                networkSocket = new TestNetworkSocket();
                subject.connect();
                network.callback(networkSocket);
            });

            it('it should send a Connect packet with username and password', () => {
                networkSocket.sentPackages.should.have.lengthOf(1);
                const packet = new ControlPacketVerifier(networkSocket.sentPackages[0]);
                packet.shouldHaveConnectFlags(ConnectFlags.UserName | ConnectFlags.Password | ConnectFlags.CleanSession);
                packet.shouldHavePayload('some-client', 'some-username', 'some-password');
            });
        });
    });

    describe('When receiving an unexpected packet', () => {
        beforeEach(() => {
            networkSocket = new TestNetworkSocket();

            subject = new MicroMqttClientTestSubclassBuilder()
                .whichJustSentAConnectPacketOn(networkSocket)
                .build();

            networkSocket.receivePackage('Some unexpected packet');
        });

        it('it should emit some debug information', () => {
            subject.shouldHaveEmittedEvent(subject.emittedDebugInfo(),
                i => { return i.should.contain('Rcvd:').and.contain('\'Some unexpected packet\''); });
        });

        it('it should emit an error', () => {
            subject.shouldHaveEmittedEvent(subject.emittedError(),
                e => { return e.should.contain('MQTT unsupported packet type:'); });
        });
    });

    describe('When receiving a ConnAck packet', () => {
        beforeEach(() => {
            networkSocket = new TestNetworkSocket();

            subject = new MicroMqttClientTestSubclassBuilder()
                .whichJustSentAConnectPacketOn(networkSocket)
                .build();
        });

        describe('with ConnectReturnCode UnacceptableProtocolVersion', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.UnacceptableProtocolVersion)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, unacceptable protocol version.');
            });
        });

        describe('with ConnectReturnCode IdentifierRejected', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.IdentifierRejected)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, identifier rejected.');
            });
        });


        describe('with ConnectReturnCode ServerUnavailable', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.ServerUnavailable)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, server unavailable.');
            });
        });

        describe('with ConnectReturnCode BadUserNameOrPassword', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.BadUserNameOrPassword)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, bad user name or password.');
            });
        });

        describe('with ConnectReturnCode NotAuthorized', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.NotAuthorized)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, not authorized.');
            });
        });

        describe('with an unknown return code', () => {
            beforeEach(() => {
                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(<ConnectReturnCode>111)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            it('it should emit an error', () => {
                subject.shouldHaveEmittedError('Connection refused, unknown return code: 111.');
            });
        });

        describe('with ConnectReturnCode Accepted', () => {
            let clock: Sinon.SinonFakeTimers;

            beforeEach(() => {
                clock = sinon.useFakeTimers();

                const connAckPacket = new ControlPacketBuilder(ControlPacketType.ConnAck)
                    .withConnectReturnCode(ConnectReturnCode.Accepted)
                    .build();

                networkSocket.receivePackage(connAckPacket);
            });

            afterEach(() => {
                clock.restore();
            });

            it('it should not emit errors', () => {
                subject.shouldNotEmitErrors();
            });

            it('it should emit information about this succes', () => {
                subject.shouldHaveEmittedInfo('MQTT connection accepted');
            });

            it('it should emit the \'connected\' event', () => {
                const emittedConnect = subject.emittedConnected();
                emittedConnect.should.have.lengthOf(1);
            });

            it('it should send the first PingReq packet after 40 seconds', () => {
                subject.clearEmittedEvents();
                networkSocket.clear();

                clock.tick(40 * 1000);

                subject.shouldHaveEmittedDebugInfo('Sent: Ping request');

                networkSocket.sentPackages.should.have.lengthOf(1);
                const packet = new ControlPacketVerifier(networkSocket.sentPackages[0]);
                packet.shouldBeOfType(ControlPacketType.PingReq);
                packet.shouldHaveValidRemainingLength();
            });

            it('it should send PingReq packets every 40 seconds', () => {
                subject.clearEmittedEvents();
                networkSocket.clear();

                const expectedNumberOfPingReqPackets = 10;
                clock.tick(expectedNumberOfPingReqPackets * 40 * 1000);

                networkSocket.sentPackages.should.have.lengthOf(expectedNumberOfPingReqPackets);
            });
        });
    });
});