'use client'
import NewsSearchResultCard from "@/components/news/NewsSearchResultCard";
import { NEWS_SOURCE } from "@/lib/common/constants";
import { GetNewsQueryParameters, News } from "@/lib/common/types";
import { formatFromGuardian, formatFromNewsApi, formatFromNewYorkTimes, formatFromNewYorkTimesSearch, selectMaxTotalPages, setTotalPages } from "@/lib/features/combinedNews/combinedNewsSlice";
import { useNewsApiGetEverythingQuery } from "@/lib/features/newsApi/newsApiSlice";
import { useGetNYTArticleSearchQuery } from "@/lib/features/newYorkTimes/newYorkTimesSlice";
import { useGetGuardianContentQuery } from "@/lib/features/theGuardian/guardianApiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Pagination, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {HiArrowLeft} from 'react-icons/hi';
export default function SearchResult({ params }: { params: { slug: string } }){
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const maxTotalPages = useAppSelector(selectMaxTotalPages);
    const scrollToTop = useRef<HTMLDivElement>(null);
    const onClickBack = () => {
        router.back();
    }
    const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
    const guardianPageSize = useAppSelector((state) => state.combinedNews.guardianPageSize);
    const newYorkTimesPageSize = useAppSelector((state) => state.combinedNews.newYorkTimesPageSize);

    const newsApiEnabled = useAppSelector((state) => state.combinedNews.newsApiEnabled);
    const guardianEnabled = useAppSelector((state) => state.combinedNews.guardianEnabled);
    const newYorkTimesEnabled = useAppSelector((state) => state.combinedNews.newYorkTimesEnabled);

    const fromDate = useAppSelector((state) => state.combinedNews.startDate);
    const toDate = useAppSelector((state) => state.combinedNews.endDate);

    const commonParameter = {page: currentPage, search: params.slug, fromDate, toDate}
    const {data: newsApiData, error: newsApiIsError, isLoading: newsApiIsLoading} = useNewsApiGetEverythingQuery({pageSize: newsApiPageSize, ...commonParameter});
    const {data: guardianData, error: guardianError, isLoading: guardianIsLoading} = useGetGuardianContentQuery({pageSize: guardianPageSize, ...commonParameter});
    const {data: nytData, error: nytError, isLoading: nytIsLoading} = useGetNYTArticleSearchQuery({pageSize: newYorkTimesPageSize, ...commonParameter});
    const isContentStillLoading = newsApiIsLoading || guardianIsLoading || nytIsLoading;
    const onPageChange = (page: number) => {
        if(!newsApiIsLoading && !guardianIsLoading && !nytIsLoading){
        setCurrentPage(page);
        if(scrollToTop.current){
            scrollToTop.current.scrollIntoView({behavior: 'smooth'});
        }
        }
    };

    let combinedNews:News[] = [];
    
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

    if(newYorkTimesEnabled && nytData && !nytIsLoading){
        dispatch(setTotalPages({source: NEWS_SOURCE.NEW_YORK_TIMES, totalPages: nytData.response.meta.hits}));
        const formattedNews:News[] = nytData.response.docs.map(formatFromNewYorkTimesSearch);
        combinedNews = combinedNews.concat(formattedNews);
      }

    const newsApiTotalCount = (newsApiEnabled && newsApiData?.totalResults || 0);
    const guardianTotalCount = (guardianEnabled && guardianData?.response.pages || 0);
    const newYorkTimesTotalCount = (newYorkTimesEnabled && nytData?.response.meta.hits || 0);
    const resultCount = newsApiTotalCount + guardianTotalCount + newYorkTimesTotalCount;

    return (
        <main className="flex min-h-screen flex-col py-24 px-64" ref={scrollToTop}>
            <div className="flex flex-row items-center">
                <span><HiArrowLeft className="text-xl cursor-pointer mr-4" onClick={onClickBack}/> </span><span className="text-2xl text-passive">Results for <span className="font-bold text-blacky">{params.slug}</span></span>
            </div>
            <div className="mt-4 text-passive">
                {resultCount} results found
            </div>
            <div id="content" className="mt-4 grid grid-cols-1 gap-4" >
                {
                    combinedNews.map((article, index) => {
                        return <NewsSearchResultCard key={index} article={article}/>
                    })
                }
            </div>
            <div className="flex justify-center">
                {isContentStillLoading && (<Spinner size="xl" />)}
            </div>
            { combinedNews.length > 0 && (
                <div className="flex items-center justify-center">
                    <Pagination currentPage={currentPage} totalPages={maxTotalPages} onPageChange={onPageChange} showIcons />
                </div>
                )
            }
      </main>
    )
}