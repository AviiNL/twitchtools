import {Component, OnDestroy, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {ChannelModel} from '../Twitch/channel.model';
import {PubsubService} from '../Twitch/pubsub.service';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, OnDestroy {

    constructor() {
    }

    async ngOnInit() {
    }

    ngOnDestroy(): void {
    }

}
