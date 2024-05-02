import { NEWS_API_LANGUAGE, NEWS_API_SEARCH_IN } from "@/lib/common/constants";
import { GetNewsQueryParameters } from "@/lib/common/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from 'query-string';

const COUNTRY = 'us';
const baseApiUrl = process.env.NEXT_PUBLIC_NEWS_API_URL;
const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

interface Source {
    id: string;
    name: string;
}
export interface Article {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface NewsApiResponse {
    articles: Article[];
    status: string;
    totalResults: number;
}

const getQueryString = (data: Record<any, any>) => {
    return queryString.stringify({
      ...data,
      apiKey
    });
}

export const newsApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
    reducerPath: "newsApi",
    tagTypes: ["NewsAPI"],
    endpoints: (build) => ({
      newsApiGetHeadline: build.query<NewsApiResponse, GetNewsQueryParameters>({
        query: (params) => `top-headlines?` + getQueryString({pageSize: params.pageSize,page: params.page,country: COUNTRY}),
        providesTags: (result, error, params) => [{ type: "NewsAPI", page: params.page }],
      }),
      newsApiGetEverything: build.query<NewsApiResponse, GetNewsQueryParameters>({
        query: (params) => {
          const queryStringParameter = getQueryString({
            pageSize: params.pageSize,
            page: params.page, 
            searchIn: NEWS_API_SEARCH_IN, 
            language: NEWS_API_LANGUAGE,
            q: params.search,
            ...(params.fromDate ? {from: params.fromDate} : {}),
            ...(params.toDate ? {to: params.toDate} : {})
          })
          return `everything?` + queryStringParameter;
        },
        providesTags: (result, error, params) => [{ type: "NewsAPI", ...params }],
      }),
    }),
  });
  

export const { useNewsApiGetHeadlineQuery, useNewsApiGetEverythingQuery } = newsApiSlice;