import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Article, NewsApiResponse } from '../newsApi/newsApiSlice';
import { GuardianApiResponse, GuardianArticleResult } from '../theGuardian/guardianApiSlice';
import { News } from '@/lib/common/types';
import { NEWS_SOURCE } from '@/lib/common/constants';
import { RootState } from '@/lib/store';
import { NewYorkTimesResult, NYTSearchDoc } from '../newYorkTimes/newYorkTimesSlice';
import { set } from 'date-fns';

interface CombinedNewsState {
    news: News[];
    guardianPageSize: number;
    newsApiPageSize: number;
    newYorkTimesPageSize: number;
    guardianTotalPages: number;
    newsApiTotalPages: number;
    newYorkTimesTotalPages: number;
    newsApiEnabled: boolean;
    guardianEnabled: boolean;
    newYorkTimesEnabled: boolean;
    startDate: string | null;
    endDate: string | null;
}

interface UpdateTotalPagesPayload {
    source: string;
    totalPages: number;
}
const initialState: CombinedNewsState = {
    news: [],
    newsApiEnabled: true,
    guardianEnabled: true,
    newYorkTimesEnabled: true,
    guardianPageSize: 5,
    newsApiPageSize: 5,
    newYorkTimesPageSize: 5,
    guardianTotalPages: 100,
    newsApiTotalPages: 100,
    newYorkTimesTotalPages: 100,
    startDate: null,
    endDate: null
};

export const combinedNewsData = createSlice({
  name: 'combinedNews',
  initialState,
  reducers: {
    clearData(state){
        state.news = [];
    },
    updateCombinedNewsData(state, action: PayloadAction<News>) {
        state.news.push(action.payload);
    },
    addNewsApiData(state, action: PayloadAction<NewsApiResponse>) {
        const newsData: News[] = action.payload.articles.map((article) => {
            return {
                sourceId: 'NewsAPI',
                sourceName: article.source.name,
                title: article.title,
                description: article.description,
                publishedAt: article.publishedAt,
                imageUrl: article.urlToImage,
                url: article.url
            }
        });
        state.news.push(...newsData);
    },
    addGuardianApiData(state, action: PayloadAction<GuardianApiResponse>) {
        const newsData: News[] = action.payload.results.map((article) => {
            return {
                sourceId: 'The Guardian',
                sourceName: article.pillarName,
                title: article.webTitle,
                description: '',
                publishedAt: article.webPublicationDate,
                imageUrl: article.fields?.thumbnail || '',
                url: article.webUrl
            }
        });
        state.news.push(...newsData);
    },
    setTotalPages(state, action: PayloadAction<UpdateTotalPagesPayload>){
        switch(action.payload.source){
            case NEWS_SOURCE.NEWS_API:
                state.newsApiTotalPages = action.payload.totalPages;
                break;
            case NEWS_SOURCE.GUARDIAN:
                state.guardianTotalPages = action.payload.totalPages;
                break;
            case NEWS_SOURCE.NEW_YORK_TIMES:
                state.newYorkTimesTotalPages = action.payload.totalPages;
                break;
        }
    },
    setSourceEnabled(state, action: PayloadAction<{source: string, enabled: boolean}>){
        switch(action.payload.source){
            case NEWS_SOURCE.NEWS_API:
                state.newsApiEnabled = action.payload.enabled;
                break;
            case NEWS_SOURCE.GUARDIAN:
                state.guardianEnabled = action.payload.enabled;
                break;
            case NEWS_SOURCE.NEW_YORK_TIMES:
                state.newYorkTimesEnabled = action.payload.enabled;
                break;
        }
    },
    setFromDate(state, action: PayloadAction<string>){
        console.log('setFromDate', action.payload,'===========')
        state.startDate = action.payload;
    },
    setToDate(state, action: PayloadAction<string>){
        state.endDate = action.payload;
    }
  },
});

export const selectMaxTotalPages = (state: RootState) => {
    const { guardianTotalPages, newsApiTotalPages, newYorkTimesTotalPages } = state.combinedNews;
    return Math.max(guardianTotalPages, newsApiTotalPages, newYorkTimesTotalPages);
};

export const { 
    updateCombinedNewsData, 
    addNewsApiData, 
    addGuardianApiData, 
    setTotalPages, 
    setSourceEnabled,
    setFromDate,
    setToDate
} = combinedNewsData.actions;

export const formatFromNewsApi = (article: Article): News => {
    return {
        sourceId: NEWS_SOURCE.NEWS_API,
        sourceName: article.source.name,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage,
        url: article.url
      }
}

export const formatFromGuardian = (article: GuardianArticleResult): News => {
    return {
        sourceId: NEWS_SOURCE.GUARDIAN,
        sourceName: article.pillarName,
        title: article.webTitle,
        description: '',
        publishedAt: article.webPublicationDate,
        imageUrl: article.fields?.thumbnail || '',
        url: article.webUrl
    }
}

export const formatFromNewYorkTimes = (article: NewYorkTimesResult): News => {
    const hasImageMultimedia = article.multimedia.length > 0 && article.multimedia[article.multimedia.length - 1].url;
    return {
      sourceId: NEWS_SOURCE.NEW_YORK_TIMES,
      sourceName: article.section,
      title: article.title,
      description: article.abstract,
      publishedAt: article.published_date,
      imageUrl: hasImageMultimedia ? article.multimedia[article.multimedia.length - 1].url : '',
      url: article.url
    }
  }

  export const formatFromNewYorkTimesSearch = (article: NYTSearchDoc): News => {
    const hasImageMultimedia = article.multimedia.length > 0 && article.multimedia[0].url;
    return {
      sourceId: NEWS_SOURCE.NEW_YORK_TIMES,
      sourceName: article.section_name,
      title: article.headline.main,
      description: '',
      publishedAt: article.pub_date,
      imageUrl: hasImageMultimedia ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
      url: article.web_url
    }
  }