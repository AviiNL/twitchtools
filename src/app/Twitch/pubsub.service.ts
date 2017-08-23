import {Injectable} from '@angular/core';
import {TwitchService} from './twitch.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class PubsubService {

    _bitsSource: BehaviorSubject<any> = new BehaviorSubject(null);
    bits = this._bitsSource.asObservable();

    _subscribeSource: BehaviorSubject<any> = new BehaviorSubject(null);
    subscribe = this._subscribeSource.asObservable();

    _commerceSource: BehaviorSubject<any> = new BehaviorSubject(null);
    commerce = this._commerceSource.asObservable();

    private socket: WebSocket;

    constructor(private twitch: TwitchService) {
    }

    connect() {
        if (this.socket && this.socket.readyState === this.socket.OPEN) {
            console.warn('Socket already connected');
            return;
        }

        this.socket = new WebSocket('wss://pubsub-edge.twitch.tv');
        this.socket.onmessage = this.handle;

        this.socket.onopen = () => {
            this.addTopic([
                'channel-bits-events-v1',
                'channel-subscribe-events-v1',
                'channel-commerce-events-v1'
            ]);
        };

        const ping = () => {
            setTimeout(() => {
                if (this.socket.readyState === this.socket.OPEN) {
                    this.send({type: 'PING'});
                }
                ping();
            }, 5000);
        };
        ping();
    }

    async addTopic(topics: string | string[]) {
        const channel = await this.twitch.getChannel();

        if (typeof topics === 'string') {
            topics = [topics];
        }

        topics = topics.map((topic) => {
            return `${topic}.${channel._id}`;
        });

        this.send({
            'type': 'LISTEN',
            'data': {
                'topics': topics,
                'auth_token': this.twitch.token.access_token
            }
        });
    }

    send(data: any) {
        this.socket.send(JSON.stringify(data));
    }

    disconnect() {
        this.socket.close();
    }

    reconnect() {
        this.disconnect();
        this.socket.onclose = () => {
            this.connect();
        };
    }

    handle(event) {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error(e);
            return;
        }

        switch (data.type.toUpperCase()) {
            case 'MESSAGE':
                this.messageHandler(data.data);
                break;
            case 'RESPONSE':
                break;
            case 'RECONNECT':
                this.reconnect();
                break;
            case 'PONG':
                break;
            default:
                console.log(`Unknown event ${data.type}`);
                break;
        }
    }

    messageHandler(data: any) {
        let message = data.message;

        if (typeof message === 'string') {
            message = JSON.parse(message);
        }

        switch (data.topic.split('.')[0]) {
            case 'channel-bits-events-v1':
                this._bitsSource.next(message);
                break;
            case 'channel-subscribe-events-v1':
                this._subscribeSource.next(message);
                break;
            case 'channel-commerce-events-v1':
                this._commerceSource.next(message);
                break;
        }

    }
}