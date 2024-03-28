export interface IUsers {
    users: [
        data: {
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

export interface ICameras {
    cameras: [
        data: {
            cameraId: string;
            cameraName: string;
            cameraDestination: string;
            status: string;
        }
    ];
    token: string | undefined;
}

export interface ILocations {
    locations: [
        data: {
            locationId: string;
            locationName: string;
        }
    ];
    token: string | undefined;
}
export interface IRecordsDetail {
    data: {
        cameraId: string;
        cameraDestination: string;
        ratingResult: number;
        recordId: string;
        userRatingPercent: number;
        predictedPercent: number;
        status: string;
        videoRecord: {
            videoUrl: string;
        };
        imageRecord: {
            videoUrl: string;
        };
        userRatings: [
            {
                userId: string;
                rating: number;
            }
        ];
        userVoting: [
            {
                userId: string;
                voteLevel: number;
                voteType: string;
            }
        ]
    };
    token: string | undefined;
}

export interface IRecords {
    records: [
        data: {
            id: string;
            status: string;
            recordTime: string;
            userRatingPercent: number;
            predictedPercent: number;
            createdDate: string;
            userRatings: [
                {
                    userId: string;
                    rating: number;
                }
            ]
            userVotings: [
                {
                    userId: string;
                    voteLevel: number;
                    voteType: {
                        actionName: string;
                    }
                }
            ]
            recordType: {
                recordTypeId: number;
                recordTypeName: string;
            }
            notificationLogs: [
                {
                    count: number;
                    notificationType: {
                        notificationTypeId: number;
                        name: string;
                    }
                }
            ]
        }
    ];
    token: string | undefined;
}