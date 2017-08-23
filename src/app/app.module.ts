import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AuthComponent} from './Auth/auth.component';
import {MenuComponent} from './Menu/menu.component';
import {appRoutes} from './app.routes';
import {MenuItemComponent} from './Menu/menuItem.component';
import {TwitchService} from './Twitch/twitch.service';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {HttpModule} from '@angular/http';
import {ElectronService} from './Electron/electron.service';
import {StorageService} from './Storage/storage.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(appRoutes, {enableTracing: true})
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        AuthComponent,
        DashboardComponent,
        MenuItemComponent
    ],
    providers: [
        ElectronService,
        TwitchService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
