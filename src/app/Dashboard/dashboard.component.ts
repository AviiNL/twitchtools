import {Component, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {ChannelModel} from '../Twitch/channel.model';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    channel: ChannelModel;

    constructor(public twitch: TwitchService) {
        this.channel = new ChannelModel({});
    }

    async ngOnInit() {
        this.channel = await this.twitch.getChannel();
    }

}
