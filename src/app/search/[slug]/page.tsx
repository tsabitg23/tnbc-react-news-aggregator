'use client'
import NewsScreen from "@/components/news/NewsScreen";
import { useNewsApiGetEverythingQuery } from "@/lib/features/newsApi/newsApiSlice";
import { useGetNYTArticleSearchQuery } from "@/lib/features/newYorkTimes/newYorkTimesSlice";
import { useGetGuardianContentQuery } from "@/lib/features/theGuardian/guardianApiSlice";
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export default function SearchResult({ params }: { params: { slug: string } }){
    const [currentPage, setCurrentPage] = useState(1);
    const newsApiPageSize = useAppSelector((state) => state.combinedNews.newsApiPageSize);
    const guardianPageSize = useAppSelector((state) => state.combinedNews.guardianPageSize);
    const newYorkTimesPageSize = useAppSelector((state) => state.combinedNews.newYorkTimesPageSize);


    const fromDate = useAppSelector((state) => state.combinedNews.startDate);
    const toDate = useAppSelector((state) => state.combinedNews.endDate);

    const commonParameter = {page: currentPage, search: params.slug, fromDate, toDate}
    const {data: newsApiData, error: newsApiIsError, isLoading: newsApiIsLoading} = useNewsApiGetEverythingQuery({pageSize: newsApiPageSize, ...commonParameter});
    const {data: guardianData, error: guardianError, isLoading: guardianIsLoading} = useGetGuardianContentQuery({pageSize: guardianPageSize, ...commonParameter});
    const {data: nytData, error: nytError, isLoading: nytIsLoading} = useGetNYTArticleSearchQuery({pageSize: newYorkTimesPageSize, ...commonParameter});

    return (
        <NewsScreen 
            slug={params.slug}
            newsApiData={newsApiData}
            guardianData={guardianData}
            nytSearchData={nytData}
            newsApiIsLoading={newsApiIsLoading}
            guardianIsLoading={guardianIsLoading}
            nytIsLoading={nytIsLoading}
            onChangePage={setCurrentPage}
            screenType={'search'}
            />
    )
}