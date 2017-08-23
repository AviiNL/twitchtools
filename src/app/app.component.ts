import {ElectronService} from './Electron/electron.service';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

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

    ngOnDestroy(): void {
        window.removeEventListener('maximize');
        window.removeEventListener('unmaximize');
        window.removeEventListener('resize');
        window.removeEventListener('enter-full-screen');
    }

}
