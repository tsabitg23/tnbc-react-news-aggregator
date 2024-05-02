import { GetNewsQueryParameters } from "@/lib/common/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from 'query-string';

const baseApiUrl = process.env.NEXT_PUBLIC_GUARDIAN_API_URL;
const apiKey = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;
const showFields = ['thumbnail', 'trailText'];

interface ShowFields {
    thumbnail: string;
    trailText: string;
}

export interface GuardianArticleResult {
    id: string;
    type: string;
    sectionId: string;
    sectionName: string;
    webPublicationDate: string;
    webTitle: string;
    webUrl: string; 
    apiUrl: string;
    isHosted: boolean;
    pillarId: string;
    pillarName: string;
    fields: ShowFields;
}

export interface GuardianApiResponse {
    results: GuardianArticleResult[];
    status: string;
    total: number;
    pages: number;
}

interface GuardianApiQueryResponse {
    response: GuardianApiResponse;
}

const getQueryString = (data: Record<any, any>) => {
    return queryString.stringify({
      ...data,
      ['api-key']: apiKey,
      ['show-fields']: showFields.join(',')
    });
}

export const guardianApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
    reducerPath: "guardianApi",
    tagTypes: ["GuardianAPI"],
    endpoints: (build) => ({
      getGuardianContent: build.query<GuardianApiQueryResponse, GetNewsQueryParameters>({
        query: (params) => {
          const queryParams:Record<string, string | number> = {['page-size']: params.pageSize, page: params.page}
          if(params.search){
            queryParams['q'] = params.search;
            queryParams['query-fields'] = 'body,thumbnail,webTitle'
          }
          if(params.fromDate){
            queryParams['from-date'] = params.fromDate;
          }
          if(params.toDate){
            queryParams['to-date'] = params.toDate;
          }
          return `search?` + getQueryString(queryParams)
        },
        providesTags: (result, error, params) => [{ type: "GuardianAPI", page: params.page}],
      }),
    }),
  });
  

export const { useGetGuardianContentQuery } = guardianApiSlice;