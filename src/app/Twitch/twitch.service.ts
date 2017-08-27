import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Headers, Http, RequestOptions} from '@angular/http';
import {StorageService} from '../Storage/storage.service';
import {TokenModel} from './token.model';
import {UserModel} from './user.model';
import {ChannelModel} from './channel.model';
import {ElectronService} from '../Electron/electron.service';

@Injectable()
export class TwitchService {

    token: TokenModel;

    _readySource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    ready = this._readySource.asObservable();

    constructor(private http: Http,
                private store: StorageService,
                private electron: ElectronService) {

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

        const rootUrl = 'https://api.twitch.tv/kraken';
        const headers = new Headers({
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Content-Type': 'application/json',
            'Client-ID': 'fmkkosg3lceokpmzkgv8g8sm76nmy2h',
            'Authorization': `OAuth ${this.token.access_token}`
        });

        const requestOptions = new RequestOptions({headers: headers});

        const validate = await this.http.get(rootUrl, requestOptions).toPromise();

        if (!(await validate.json().token.valid)) {
            console.error('Token is no longer valid');
            this.electron.reset();
            return;
        }

        const response = await this.http.get(
            `${rootUrl}/${what}`,
            new RequestOptions(requestOptions)
        ).toPromise();

        this.store.set(what, response.json());
        return response.json();
    }
}
