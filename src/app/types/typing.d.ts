export interface IUsers {
    users: [
        data : {
            Id: string;
            securityCode: string;
            name: string;
            phone: string;
            role: {
                roleName: string;
            };
            accessToken: string;
            refreshToken: string;
        }
    ];
    token: string | undefined;
}