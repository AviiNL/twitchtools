export class UserModel {
    id: number;
    name: string;
    display_name: string;
    email: string;
    logo: string;
    bio: string;
    notifications: any;
    partnered: boolean;
    type: string;
    created_at: Date;
    updated_at: Date;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.display_name = data.display_name;
        this.email = data.email;
        this.logo = data.logo;
        this.bio = data.bio;
        this.notifications = data.notifications;
        this.partnered = data.partnered;
        this.type = data.type;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

}
