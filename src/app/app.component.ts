import {ElectronService} from './Electron/electron.service';
import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    maximized: boolean;

    constructor(private ref: ChangeDetectorRef, private electron: ElectronService) {
        const window = this.electron.getCurrentWindow();
        this.maximized = this.electron.isMaximized();

        const handler = () => {
            this.maximized = this.electron.isMaximized();
            this.ref.detectChanges();
        };

        window.on('maximize', handler);
        window.on('unmaximize', handler);
        window.on('resize', handler);
        window.on('enter-full-screen', handler);
    }

    close() {
        this.electron.close();
    }

    minimize() {
        this.electron.minimize();
    }

    maximize() {
        if (this.electron.isMaximized()) {
            this.electron.unmaximize();
        } else {
            this.electron.maximize();
        }
    }

}
