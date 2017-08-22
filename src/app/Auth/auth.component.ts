import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {TwitchService} from '../Twitch/twitch.service';

@Component({
    selector: 'app-root',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit, OnDestroy {

    private sub: Subscription;

    constructor(private route: ActivatedRoute,
                private twitch: TwitchService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.twitch.setToken(JSON.parse(params['token']));
            this.router.navigateByUrl('/app');
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
