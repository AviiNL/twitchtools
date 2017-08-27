import {Injectable} from '@angular/core';
import {TwitchService} from './twitch.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

declare const net: any;

@Injectable()
export class ChatService {

    socket: any;

    _messages: Array<any> = [];

    messageData: Array<any> = [];
    _messageSource: BehaviorSubject<any> = new BehaviorSubject(this.messageData);
    messages = this._messageSource.asObservable();

    constructor(private twitch: TwitchService) {
        this.socket = net.createConnection({
            host: 'irc.chat.twitch.tv',
            port: 6667
        }, () => {
            // Bind listeners
            this.socket.on('data', this.handle.bind(this));
            this.socket.on('disconnect', this.disconnect.bind(this));
            // Start Authentication
            this.authenticate();
        });

    }

    disconnect() {
        this.constructor(this.twitch);
    }

    handle(data) {
        data = data.toString('ascii');

        const lines = data.split('\n');

        for (const line of lines) {

            const obj: any = {
                raw: line
            };

            this._messages.push(obj);
            obj._id = this._messages.indexOf(obj);

            this.distribute(obj);
        }
    }

    distribute(obj: any) {
        if (obj.raw[0] === ':') {
            this.handleTwitchMessage(obj);
        } else if (obj.raw[0] === '@') {
            this.handleIrcMessage(obj);
        } else {
            this.handleGenericMessage(obj);
        }
    }

    /*
     * Commands starting with ':'
     */
    handleTwitchMessage(data: any) {
        const parse = data.raw.split(':');
        // : PRIVMSG #aviinl :blaat schaap boe enzo
        const command = parse[1].split(' ');
        const metadata = /(\w+)!(\w+)@(\w+).tmi.twitch.tv/gi.exec(command);

        if (metadata) {
            data.name = metadata[1];
        }

        switch (command[1]) {
            case 'PRIVMSG':
                data.message = parse[2];

                delete data.raw;
                this.messageData.push(data);
                this._messageSource.next(this.messageData);

                break;
        }
    }

    /*
     * Commands starting with @
     */
    handleIrcMessage(data: any) {
        const parse = data.raw.split(' ');

        const meta = parse.shift().substr(1).split(';');
        for (const premetadata of meta) {
            const metadata = premetadata.split('=');
            data[metadata[0]] = metadata[1];
        }

        data.raw = parse.join(' ');

        this.distribute(data);
    }

    handleGenericMessage(data: any) {
        const parse = data.raw.split(' ', 2);
        switch (parse[0]) {
            case 'PING':
                this.send('PONG');
                break;
        }
    }

    send(data: string) {
        this.socket.write(`${data}\n`);
    }

    async authenticate() {
        const user = await this.twitch.getUser();

        this.send(`PASS oauth:${this.twitch.token.access_token}`);
        this.send(`NICK ${user.name}`);
        this.send(`JOIN #${user.name}`);
        this.send(`CAP REQ :twitch.tv/membership`);
        this.send(`CAP REQ :twitch.tv/tags`);
        this.send(`CAP REQ :twitch.tv/commands`);
    }

}
