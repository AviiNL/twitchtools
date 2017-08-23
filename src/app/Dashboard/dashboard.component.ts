import {Component, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {TwitchChannelModel} from '../Twitch/twitchChannel.model';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    channel: TwitchChannelModel;

    constructor(public twitch: TwitchService) {
        this.channel = new TwitchChannelModel({});
    }

    async ngOnInit() {
        this.channel = await this.twitch.getChannel();
    }

}
