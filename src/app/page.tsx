"use client";
import {  useAppSelector } from "@/lib/hooks";
import {  useRef, useState } from "react";
import { useNewsApiGetHeadlineQuery } from "@/lib/features/newsApi/newsApiSlice";
import { useGetGuardianContentQuery } from "@/lib/features/theGuardian/guardianApiSlice";
import { useGetNYTContentQuery } from "@/lib/features/newYorkTimes/newYorkTimesSlice";
import NewsScreen from "@/components/news/NewsScreen";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollToTop = useRef<HTMLDivElement>(null);
  const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
  const guardianPageSize = useAppSelector((state) => state.combinedNews.guardianPageSize);
  const newYorkTimesPageSize = useAppSelector((state) => state.combinedNews.newYorkTimesPageSize);

  const fromDate = useAppSelector((state) => state.combinedNews.startDate);
  const toDate = useAppSelector((state) => state.combinedNews.endDate);
  
  const {data: newsApiData, error: newsApiIsError, isLoading: newsApiIsLoading} = useNewsApiGetHeadlineQuery({pageSize: newsApiPageSize, page: currentPage, fromDate, toDate});
  const {data: guardianData, error: guardianError, isLoading: guardianIsLoading} = useGetGuardianContentQuery({pageSize: guardianPageSize, page: currentPage, fromDate, toDate});
  const {data: nytData, error: nytError, isLoading: nytIsLoading} = useGetNYTContentQuery({pageSize: newYorkTimesPageSize, page: currentPage, fromDate, toDate, section: 'all'});

  const onPageChange = (page: number) => {
    if(!newsApiIsLoading && !guardianIsLoading && !nytIsLoading){
      setCurrentPage(page);
      if(scrollToTop.current){
        scrollToTop.current.scrollIntoView({behavior: 'smooth'});
      }
    }
  };


  return (
    <NewsScreen
      newsApiData={newsApiData}
      guardianData={guardianData}
      nytTopStoriesData={nytData}
      newsApiIsLoading={newsApiIsLoading}
      guardianIsLoading={guardianIsLoading}
      nytIsLoading={nytIsLoading}
      onChangePage={onPageChange}
      screenType="headlines"
    />
  )
}
