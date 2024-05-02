import { NEW_YORK_TIMES_SOURCE } from "@/lib/common/constants";
import { GetNewsQueryParameters, NewYorkTimesQueryParameters } from "@/lib/common/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from 'query-string';
import {format} from 'date-fns';
const baseApiUrl = process.env.NEXT_PUBLIC_NYT_API_URL;
const apiKey = process.env.NEXT_PUBLIC_NYT_API_KEY;

interface NewYorkTimesResultMultimedia {
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
}

export interface NewYorkTimesResult {
    section: string;
    subsection: string;
    title: string;
    abstract: string;
    url: string;
    uri: string;
    byline: string;
    item_type: string;
    updated_date: string;
    created_date: string;
    published_date: string;
    material_type_facet: string;
    kicker: string;
    des_facet: string[];
    org_facet: string[];
    per_facet: string[];
    geo_facet: string[];
    multimedia: NewYorkTimesResultMultimedia[];
}

interface NewYorkTimesTopStoriesQueryResponse {
    num_results: number;
    results: NewYorkTimesResult[];
}

interface NYTSearchMeta {
  hits: number;
  offset: number;
  time: number;
}

interface NYTSearchHeadline {
  main: string;
}

export interface NYTSearchDoc {
  multimedia: NewYorkTimesResultMultimedia[];
  web_url: string;
  source: string;
  section_name: string;
  pub_date: string;
  lead_paragraph: string;
  headline: NYTSearchHeadline
}

interface NYTSearchResponse {
  docs: NYTSearchDoc[];
  meta: NYTSearchMeta;
}

interface NewYorkTimesArticleSearchQueryResponse {
  response: NYTSearchResponse;
}

const getQueryString = (data: Record<any, any>) => {
    return queryString.stringify({
      ...data,
      ['api-key']: apiKey,
    });
}

export const newYorkTimesApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
    reducerPath: "newYorkTimesApi",
    tagTypes: ["NewYorkTimesAPI"],
    endpoints: (build) => ({
      getNYTContent: build.query<NewYorkTimesTopStoriesQueryResponse, NewYorkTimesQueryParameters>({
        query: (params) => `news/v3/content/${NEW_YORK_TIMES_SOURCE}/${params.section || 'all'}.json?` + getQueryString({['limit']: params.pageSize, offset: params.pageSize * (params.page - 1)}),
        providesTags: (result, error, params) => [{ type: "NewYorkTimesAPI", ...params}],
      }),
      getNYTArticleSearch: build.query<NewYorkTimesArticleSearchQueryResponse, GetNewsQueryParameters>({
        query: (params) => {
          const queryParameter = getQueryString({
            offset: params.pageSize * (params.page - 1), 
            page: params.page,
            q: params.search,
            ...(params.fromDate ? {begin_date: format(new Date(params.fromDate), 'yyyyMMdd')} : {}),
            ...(params.toDate ? {end_date: format(new Date(params.toDate), 'yyyyMMdd')} : {}),
          })
          return `search/v2/articlesearch.json?` + queryParameter;
        },
        providesTags: (result, error, params) => [{ type: "NewYorkTimesAPI", ...params}],
      }),
    }),
  });
  

export const { useGetNYTContentQuery, useGetNYTArticleSearchQuery } = newYorkTimesApiSlice;