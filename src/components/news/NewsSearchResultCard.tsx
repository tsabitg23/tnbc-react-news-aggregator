import { News } from "@/lib/common/types";
import Image from "next/image";
import Link from "next/link";
import {format} from 'date-fns'
interface NewsCardProps {
    article: News;
}

export default function NewsSearchResultCard(props: NewsCardProps) {
    const {article} = props;

    return (
        <Link href={article.url} target="_blank" className="flex flex-row bg-green-500 block bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
             <div>
                {
                    article.imageUrl ? (
                        <img src={article.imageUrl} alt={article.title} className="w-96 h-52 object-cover rounded-lg" />
                    ) : (
                        <Image src="/not_found.jpg" alt={article.title} width={400} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                    )
                }
             </div>
             <div className="p-4">
                <span className="text-passive font-semibold">{article.sourceId} - {article.sourceName}</span>
                <h5 className="text-2xl font-bold tracking-tight dark:text-white mt-2">
                    {article.title}
                </h5>
                <div className="text-passive">
                    {article.description}
                </div>
                <p className="text-passive mt-2 text-md font-semibold">{format(new Date(article.publishedAt || ''), 'MMM dd, yyyy')}</p>
             </div>
        </Link>
    )
}