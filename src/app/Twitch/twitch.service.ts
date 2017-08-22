import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TwitchTokenModel} from './twitchToken.model';
import {Headers, Http, RequestOptions} from '@angular/http';
import {TwitchUserModel} from './twitchUser.model';

@Injectable()
export class TwitchService {

    token: TwitchTokenModel;

    _readySource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    ready = this._readySource.asObservable();

    constructor(private http: Http) {
    }

    setToken(token: any) {
        this.token = new TwitchTokenModel(token);
        this._readySource.next(true);
        this._readySource.complete();
    }

    /**
     * @returns {TwitchUserModel}
     */
    async getUser() {
        const response = await this.fetch('user');
        return new TwitchUserModel(response.json());
    }

    async fetch(what: string) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Client-ID': 'fmkkosg3lceokpmzkgv8g8sm76nmy2h',
            'Authorization': `OAuth ${this.token.access_token}`
        });

        return await this.http.get(`https://api.twitch.tv/kraken/${what}`, new RequestOptions({headers: headers})).toPromise();
    }
}
