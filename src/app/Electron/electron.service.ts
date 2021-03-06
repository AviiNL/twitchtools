import {Injectable} from '@angular/core';

declare const electron: any;

@Injectable()
export class ElectronService {

    electron: any;

    constructor() {
        this.electron = electron;
    }

    close() {
        return this.getCurrentWindow().close();
    }

    minimize() {
        return this.getCurrentWindow().minimize();
    }

    maximize() {
        return this.getCurrentWindow().maximize();
    }

    unmaximize() {
        return this.getCurrentWindow().unmaximize();
    }

    isMaximized() {
        return this.getCurrentWindow().isMaximized();
    }

    getCurrentWindow() {
        return this.electron.remote.getCurrentWindow();
    }

    reset() {
        this.electron.remote.session.defaultSession.clearStorageData({storages: ['cookies', 'localstorage']}, () => {
            this.electron.remote.app.relaunch();
            this.electron.remote.app.quit();
        });
    }

    getApp() {
        return this.electron.remote.app;
    }
}
