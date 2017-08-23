import {Injectable} from '@angular/core';
import {ElectronService} from '../Electron/electron.service';

declare const fs: any;

@Injectable()
export class StorageService {

    path: string;
    store: { [name: string]: any } = {};

    constructor(private electron: ElectronService) {
        this.path = electron.getApp().getPath('userData') + '/datastore.json';
        if (!fs.existsSync(this.path)) {
            this.save();
        }

        this.store = JSON.parse(fs.readFileSync(this.path));
    }

    get (name: string) {
        if (!this.has(name)) {
            return null;
        }

        return this.store[name];
    }

    set (name: string, value: any) {
        this.store[name] = value;
        this.save();
    }

    remove(name: string) {
        delete this.store[name];
        this.save();
    }

    has(name: string) {
        return this.store.hasOwnProperty(name);
    }

    clear() {
        this.store = {};
        this.save();
    }

    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.store, null, 4));
    }

}
