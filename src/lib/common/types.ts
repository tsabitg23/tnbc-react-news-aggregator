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
    fromDate?: string | null;
    toDate?: string | null;
    category?: string;
}

export interface NewYorkTimesQueryParameters extends GetNewsQueryParameters{
    section: string;
}