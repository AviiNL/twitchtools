import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TwitchTokenModel} from './twitchToken.model';
import {Headers, Http, RequestOptions} from '@angular/http';
import {TwitchUserModel} from './twitchUser.model';
import {TwitchChannelModel} from './twitchChannel.model';
import {StorageService} from '../Storage/storage.service';

@Injectable()
export class TwitchService {

    token: TwitchTokenModel;

    _readySource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    ready = this._readySource.asObservable();

    constructor(
        private http: Http,
        private store: StorageService
    ) {

        if (this.store.has('token')) {
            this.setToken(this.store.get('token'));
        }

    }

    setToken(token: any) {
        this._readySource.next(false);

        this.store.clear();

        this.token = new TwitchTokenModel(token);
        this.store.set('token', token);

        this._readySource.next(true);
        this._readySource.complete();
    }


    /**
     * @returns {TwitchUserModel}
     */
    async getUser() {
        const response = await this.fetch('user', true);
        return new TwitchUserModel(response);
    }

    async getChannel() {
        const response = await this.fetch('channel');
        return new TwitchChannelModel(response);
    }

    async fetch(what: string, force: boolean = false) {

        if (this.store.has(what) && !force) {
            return await new Promise((resolve) => {
                resolve(this.store.get(what));
            });
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Client-ID': 'fmkkosg3lceokpmzkgv8g8sm76nmy2h',
            'Authorization': `OAuth ${this.token.access_token}`
        });

        const response = await this.http.get(`https://api.twitch.tv/kraken/${what}`, new RequestOptions({headers: headers})).toPromise();

        this.store.set(what, response.json());
        return response.json();
    }
}
