"use client";
import { Pagination, Spinner } from "flowbite-react";
import NewsCard from "@/components/news/NewsCard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";
import { addGuardianApiData, addNewsApiData, formatFromGuardian, formatFromNewsApi, formatFromNewYorkTimes, selectMaxTotalPages, setSourceEnabled, setTotalPages } from "@/lib/features/combinedNews/combinedNewsSlice";
import { useNewsApiGetHeadlineQuery } from "@/lib/features/newsApi/newsApiSlice";
import { News } from "@/lib/common/types";
import { useGetGuardianContentQuery } from "@/lib/features/theGuardian/guardianApiSlice";
import { NEWS_SOURCE } from "@/lib/common/constants";
import { useGetNYTContentQuery } from "@/lib/features/newYorkTimes/newYorkTimesSlice";
import { format } from "path";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollToTop = useRef<HTMLDivElement>(null);
  const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
  const guardianPageSize = useAppSelector((state) => state.combinedNews.guardianPageSize);
  const newYorkTimesPageSize = useAppSelector((state) => state.combinedNews.newYorkTimesPageSize);

  const fromDate = useAppSelector((state) => state.combinedNews.startDate);
  const toDate = useAppSelector((state) => state.combinedNews.endDate);

  const newsApiEnabled = useAppSelector((state) => state.combinedNews.newsApiEnabled);
  const guardianEnabled = useAppSelector((state) => state.combinedNews.guardianEnabled);
  const newYorkTimesEnabled = useAppSelector((state) => state.combinedNews.newYorkTimesEnabled);

  const maxTotalPages = useAppSelector(selectMaxTotalPages);

  const dispatch = useAppDispatch();
  
  const {data: newsApiData, error: newsApiIsError, isLoading: newsApiIsLoading} = useNewsApiGetHeadlineQuery({pageSize: newsApiPageSize, page: currentPage, fromDate, toDate});
  const {data: guardianData, error: guardianError, isLoading: guardianIsLoading} = useGetGuardianContentQuery({pageSize: guardianPageSize, page: currentPage, fromDate, toDate});
  const {data: nytData, error: nytError, isLoading: nytIsLoading} = useGetNYTContentQuery({pageSize: newYorkTimesPageSize, page: currentPage, fromDate, toDate, section: 'all'});

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
    dispatch(setTotalPages({source: NEWS_SOURCE.NEW_YORK_TIMES, totalPages: nytData.num_results}));
    const formattedNews:News[] = nytData.results.map(formatFromNewYorkTimes);
    combinedNews = combinedNews.concat(formattedNews);
  }

  return (
    <main className="flex min-h-screen flex-col py-24 px-64" ref={scrollToTop}> 
      <div className="mb-4">
        <h1 className="text-4xl font-bold">Headlines</h1>
      </div>
      <div id="content" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" >
        {
          combinedNews.map((article, index) => (
            <NewsCard 
              key={index}
              article={article} />
          ))
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
  );
}
