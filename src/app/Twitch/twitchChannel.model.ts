export class TwitchChannelModel {
    mature: boolean;
    status: string;
    broadcaster_language: string;
    display_name: string;
    game: string;
    language: string;
    _id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    partner: boolean;
    logo: string;
    video_banner: string;
    profile_banner: string;
    profile_banner_background_color: string;
    url: string;
    views: number;
    followers: number;
    broadcaster_type: string;
    stream_key: string;
    email: string;

    constructor(data: any) {
        this.mature = data.mature;
        this.status = data.status;
        this.broadcaster_language = data.broadcaster_language;
        this.display_name = data.display_name;
        this.game = data.game;
        this.language = data.language;
        this._id = data._id;
        this.name = data.name;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.partner = data.partner;
        this.logo = data.logo;
        this.video_banner = data.video_banner;
        this.profile_banner = data.profile_banner;
        this.profile_banner_background_color = data.profile_banner_background_color;
        this.url = data.url;
        this.views = data.views;
        this.followers = data.followers;
        this.broadcaster_type = data.broadcaster_type;
        this.stream_key = data.stream_key;
        this.email = data.email;
    }
}
