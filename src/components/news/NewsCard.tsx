import { Card } from "flowbite-react";
import {format} from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import { News } from "@/lib/common/types";

interface NewsCardProps {
    article: News;
}

export default function NewsCard(props: NewsCardProps) {
    const {article} = props;
    return (
        <Link href={article.url} target="_blank" className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            {
                article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />
                ) : (
                    <Image src="/not_found.jpg" alt={article.title} width={400} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                )
            }
            <div className="p-4">
                <span className="text-passive text-xs">{article.sourceId} - {article.sourceName}</span>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {article.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 text-xs mt-2">
                    {article.description}
                </p>
                <p className="text-passive mt-2 text-md">{format(new Date(article.publishedAt || ''), 'MMM dd, yyyy')}</p>
            </div>
        </Link>
    )
}