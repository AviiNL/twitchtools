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

    async getUser(force: boolean = true) {
        const response = await this.fetch('user', force);
        return new UserModel(response);
    }

    async getChannel(force: boolean = false) {
        const response = await this.fetch('channel', force);
        return new ChannelModel(response);
    }

    async getFollows() {
        const channel = await this.getChannel();
        return await this.fetchAll(`channels/${channel._id}/follows`);
    }

    async fetchAll(what: string, existing: Array<any> = [], cursor: string = '') {
        let path = `${what}?limit=100`;
        if (cursor.length > 0) {
            path += `&cursor=${cursor}`;
        }

        const data = await this.fetch(path, true);
        const dataType = what.split('/').pop();

        existing = existing.concat(data[dataType]);

        if (data.hasOwnProperty('_cursor')) {
            return await this.fetchAll(what, existing, data._cursor);
        }

        return existing;
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
