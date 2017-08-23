import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Headers, Http, RequestOptions} from '@angular/http';
import {StorageService} from '../Storage/storage.service';
import {TokenModel} from './token.model';
import {UserModel} from './user.model';
import {ChannelModel} from './channel.model';

@Injectable()
export class TwitchService {

    token: TokenModel;

    _readySource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    ready = this._readySource.asObservable();

    constructor(private http: Http,
                private store: StorageService) {

        if (this.store.has('token')) {
            this.setToken(this.store.get('token'));
        }

    }

    setToken(token: any) {
        this._readySource.next(false);

        this.store.clear();

        this.token = new TokenModel(token);
        this.store.set('token', token);

        this._readySource.next(true);
        this._readySource.complete();
    }

    async getUser() {
        const response = await this.fetch('user', true);
        return new UserModel(response);
    }

    async getChannel() {
        const response = await this.fetch('channel');
        return new ChannelModel(response);
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

        const response = await this.http.get(
            `https://api.twitch.tv/kraken/${what}`,
            new RequestOptions({headers: headers})
        ).toPromise();

        this.store.set(what, response.json());
        return response.json();
    }
}
