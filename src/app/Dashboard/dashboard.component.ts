import {Component, OnDestroy, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';
import {ChannelModel} from '../Twitch/channel.model';
import {PubsubService} from '../Twitch/pubsub.service';
import {Subscription} from 'rxjs/Subscription';
import {ChatService} from '../Twitch/chat.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

    channel: ChannelModel;
    bitsSubscription: Subscription;
    chatSubscribe: Subscription;

    constructor(
        private twitch: TwitchService,
        private pubsub: PubsubService,
        private chat: ChatService
    ) {
        this.channel = new ChannelModel({});
    }

    async ngOnInit() {
        this.channel = await this.twitch.getChannel();

        this.bitsSubscription = this.pubsub.bits.subscribe((data) => {
            console.log(data);
        });

        this.chatSubscribe = this.chat.messages.subscribe((log) => {
            console.log(log);
        });

    }

    ngOnDestroy(): void {
        this.bitsSubscription.unsubscribe();
    }

}
