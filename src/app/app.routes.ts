import {AuthComponent} from './Auth/auth.component';
import {Routes} from '@angular/router';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {SettingsComponent} from './Settings/settings.component';

export const appRoutes: Routes = [
    {path: 'token/:token', component: AuthComponent},
    {path: 'app', component: DashboardComponent},
    {path: 'app/settings', component: SettingsComponent},
];
