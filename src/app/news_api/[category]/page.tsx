'use client'
import NewsScreen from "@/components/news/NewsScreen";
import { useNewsApiGetEverythingQuery, useNewsApiGetHeadlineQuery } from "@/lib/features/newsApi/newsApiSlice";
import { useGetNYTArticleSearchQuery } from "@/lib/features/newYorkTimes/newYorkTimesSlice";
import { useGetGuardianContentQuery } from "@/lib/features/theGuardian/guardianApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export default function SearchResult({ params }: { params: { category: string } }){
    const [currentPage, setCurrentPage] = useState(1);
    const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
    const guardianPageSize = useAppSelector((state) => state.combinedNews.guardianPageSize);
    const newYorkTimesPageSize = useAppSelector((state) => state.combinedNews.newYorkTimesPageSize);


    const fromDate = useAppSelector((state) => state.combinedNews.startDate);
    const toDate = useAppSelector((state) => state.combinedNews.endDate);

    const commonParameter = {page: currentPage, search: params.category, fromDate, toDate}
    const {data: newsApiData, error: newsApiIsError, isLoading: newsApiIsLoading} = useNewsApiGetHeadlineQuery({pageSize: 9, ...commonParameter, category: params.category});

    return (
        <NewsScreen 
            slug={params.category}
            newsApiData={newsApiData}
            newsApiIsLoading={newsApiIsLoading}
            onChangePage={setCurrentPage}
            screenType={'categories'}
            />
    )
}