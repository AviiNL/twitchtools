import {Component, OnInit} from '@angular/core';
import {TwitchService} from '../Twitch/twitch.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    constructor(public twitch: TwitchService) {
    }

    ngOnInit(): void {

    }

}
