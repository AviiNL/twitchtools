import {Component, OnDestroy, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {ChannelModel} from '../Twitch/channel.model';
import {PubsubService} from '../Twitch/pubsub.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

    channel: ChannelModel;
    bitsSubscription: Subscription;

    constructor(private twitch: TwitchService, private pubsub: PubsubService) {
        this.channel = new ChannelModel({});
    }

    async ngOnInit() {
        this.channel = await this.twitch.getChannel();

        this.bitsSubscription = this.pubsub.bits.subscribe((data) => {
            console.log(data);
        });

    }

    ngOnDestroy(): void {
        this.bitsSubscription.unsubscribe();
    }

}
