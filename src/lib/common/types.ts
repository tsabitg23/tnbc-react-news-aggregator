export interface News {
    sourceId: string;
    sourceName: string;
    title: string;
    description: string;
    publishedAt: string;
    imageUrl: string;
    url: string;
}

export interface GetNewsQueryParameters {
    pageSize: number;
    page: number;
    search?: string;
    fromDate?: Date;
    toDate?: Date;
}

export interface NewYorkTimesQueryParameters extends GetNewsQueryParameters{
    section: string;
}