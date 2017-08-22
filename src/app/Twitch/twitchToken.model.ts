export class TwitchTokenModel {
    access_token: string;
    refresh_token: string;
    scope: Array<string>;

    constructor(data: any) {
        this.access_token = data.access_token;
        this.refresh_token = data.refresh_token;
        this.scope = data.scope;
    }

}
