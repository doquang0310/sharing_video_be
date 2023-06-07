export interface InfoVideo {
    title : string;
    description : string;
    url: string;
}

export interface VideoResponse {
    id: Number,
    url: string,
    title: string,
    description: string,
    up_vote: 0,
    down_vote: 0,
    createdDate: Date,
    publishedBy: {
      id: Number,
      email: string,
      createdDate: Date,
    },
}