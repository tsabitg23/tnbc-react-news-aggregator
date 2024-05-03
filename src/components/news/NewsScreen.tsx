"use client"
import { News } from '@/lib/common/types';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {HiArrowLeft} from 'react-icons/hi';
import NewsCard from './NewsCard';
import { Pagination, Spinner } from 'flowbite-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formatFromGuardian, formatFromNewsApi, formatFromNewYorkTimes, formatFromNewYorkTimesSearch, selectMaxTotalPages, setTotalPages } from '@/lib/features/combinedNews/combinedNewsSlice';
import { NewsApiResponse } from '@/lib/features/newsApi/newsApiSlice';
import { GuardianApiQueryResponse } from '@/lib/features/theGuardian/guardianApiSlice';
import { NewYorkTimesArticleSearchQueryResponse, NewYorkTimesTopStoriesQueryResponse } from '@/lib/features/newYorkTimes/newYorkTimesSlice';
import { NEWS_SOURCE } from '@/lib/common/constants';
import { capitalizeFirstLetter } from '@/lib/common/utils';

type ScreenTypes = 'search' | 'headlines' | 'categories';

interface NewsScreen {
    slug?: string;
    newsApiData?: NewsApiResponse | undefined; 
    guardianData?: GuardianApiQueryResponse | undefined
    nytSearchData?: NewYorkTimesArticleSearchQueryResponse | undefined,
    nytTopStoriesData?: NewYorkTimesTopStoriesQueryResponse | undefined,
    newsApiIsLoading?: boolean;
    guardianIsLoading?: boolean;
    nytIsLoading?: boolean;
    onChangePage: (page: number) => void;
    screenType: ScreenTypes;
}

function NewsScreenHeader(params: {resultCount?: number, onClickBack: () => void, slug: string, screenType: string}){
    const {resultCount, onClickBack, slug, screenType} = params;

    if(screenType === 'search'){
        return (
            <>
                <div className="flex flex-row items-center mt-12 md:mt-0">
                    <span><HiArrowLeft className="text-xl cursor-pointer mr-4" onClick={onClickBack}/> </span><span className="text-2xl text-passive">Results for <span className="font-bold text-blacky">{slug}</span></span>
                </div>
                <div className="mt-4 text-passive">
                    {resultCount} results found
                </div>
            </>
        )
    } else {
       return (
        <div className="mb-4">
            <h1 className="text-4xl font-bold">{capitalizeFirstLetter(slug) || 'Headlines'}</h1>
        </div>
       )
    }
}

function getGridTypes(screenType: ScreenTypes){
    switch (screenType) {
        case 'search':
            return 'grid grid-cols-1 gap-4';
        case 'headlines':
            return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
        default:
            return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
    }
}

/**
 * Main component used to display news articles
 * Currently support two mode, search and headlines
 * Basically 1 row for search and grid 3 columns for headlines
 */
export default function NewsScreen(params:NewsScreen) {
    const {newsApiData, guardianData, nytSearchData, nytTopStoriesData, newsApiIsLoading, guardianIsLoading, nytIsLoading, onChangePage, screenType} = params;
    const scrollToTop = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const onClickBack = () => {
        // go to /
        router.push('/');
    }

    let combinedNews:News[] = [];
    const [currentPage, setCurrentPage] = useState(1);
    const maxTotalPages = useAppSelector(selectMaxTotalPages);

    const onPageChange = (page: number) => {
        if(!isContentStillLoading){
            setCurrentPage(page);
            if(scrollToTop.current){
                scrollToTop.current.scrollIntoView({behavior: 'smooth'});
            }
            onChangePage(page);
        }
    };

    // Redux
    const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
    const newsApiEnabled = useAppSelector((state) => state.combinedNews.newsApiEnabled);
    const guardianEnabled = useAppSelector((state) => state.combinedNews.guardianEnabled);
    const newYorkTimesEnabled = useAppSelector((state) => state.combinedNews.newYorkTimesEnabled);
    
    const isContentStillLoading = newsApiIsLoading || guardianIsLoading || nytIsLoading;

    if(newsApiEnabled && newsApiData && !newsApiIsLoading){
        const newsApiTotalPages = Math.ceil(newsApiData.totalResults / newsApiPageSize);
        dispatch(setTotalPages({source: NEWS_SOURCE.NEWS_API, totalPages: newsApiTotalPages}));
        const formattedNews:News[] = newsApiData.articles.map(formatFromNewsApi);
        combinedNews = combinedNews.concat(formattedNews);
    }

    if(guardianEnabled && guardianData && !guardianIsLoading){
        dispatch(setTotalPages({source: NEWS_SOURCE.GUARDIAN, totalPages: guardianData.response.pages}));
        const formattedNews:News[] = guardianData.response.results.map(formatFromGuardian);
        combinedNews = combinedNews.concat(formattedNews);
    }

    if(newYorkTimesEnabled && !nytIsLoading){
        let totalPages = 0;
        if(nytSearchData){
            totalPages = nytSearchData.response.meta.hits;
            const formattedNews:News[] = nytSearchData.response.docs.map(formatFromNewYorkTimesSearch);
            combinedNews = combinedNews.concat(formattedNews);
        } else if(nytTopStoriesData){
            totalPages = nytTopStoriesData.num_results;
            const formattedNews:News[] = nytTopStoriesData.results.map(formatFromNewYorkTimes);
            combinedNews = combinedNews.concat(formattedNews);
        }
        dispatch(setTotalPages({source: NEWS_SOURCE.NEW_YORK_TIMES, totalPages: totalPages}));
    }

    const newsApiTotalCount = (newsApiEnabled && newsApiData?.totalResults || 0);
    const guardianTotalCount = (guardianEnabled && guardianData?.response.pages || 0);
    const newYorkTimesTotalCount = newYorkTimesEnabled ? (nytSearchData?.response.meta.hits || nytTopStoriesData?.num_results || 0) : 0;
    const resultCount = newsApiTotalCount + guardianTotalCount + newYorkTimesTotalCount;
    
    const gridTypes = getGridTypes(screenType)
    return (
        <main className="flex min-h-screen flex-col p-4 md:py-24 md:px-64" ref={scrollToTop}>
            <NewsScreenHeader resultCount={resultCount} onClickBack={onClickBack} slug={params?.slug || ""} screenType={params.screenType}/>
            <div id="content" className={`mt-4 ${gridTypes}`} >
                {
                    combinedNews.map((article, index) => {
                        return <NewsCard type={screenType} key={index} article={article}/>
                    })
                }
            </div>
            <div className="flex justify-center">
                {isContentStillLoading && (<Spinner size="xl" />)}
            </div>
            { combinedNews.length > 0 && (
                <div className="flex items-center justify-center mt-4">
                    <Pagination currentPage={currentPage} totalPages={maxTotalPages} onPageChange={onPageChange} showIcons />
                </div>
                )
            }
      </main>
    )
} 