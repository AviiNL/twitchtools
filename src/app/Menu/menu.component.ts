import {Component, OnDestroy, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {Subscription} from 'rxjs/Subscription';
import {ElectronService} from '../Electron/electron.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, OnDestroy {

    menuItems: any[] = [];
    private subscriber: Subscription;

    constructor(private twitch: TwitchService, private electron: ElectronService) {
    }

    async ngOnInit() {

        const fileMenu = [
            {name: 'New', path: '/'},
            {name: 'Open', path: ''},
            {name: 'Logout', click: () => this.electron.reset()},
            {name: 'Exit', click: () => this.electron.close()},
        ];


        const fileMenuItem = {name: 'N/A', children: fileMenu};

        let user = await this.twitch.getUser();
        fileMenuItem.name = user.display_name;
        if (!user) {
            this.subscriber = this.twitch.ready.subscribe(async (value) => {
                if (value) {
                    user = await this.twitch.getUser();
                    fileMenuItem.name = user.display_name;
                }
            });
        }

        this.menuItems.push(fileMenuItem);
        this.menuItems.push({name: 'Auth', path: '/auth'});

    }

    ngOnDestroy(): void {
        this.subscriber.unsubscribe();
    }

}
