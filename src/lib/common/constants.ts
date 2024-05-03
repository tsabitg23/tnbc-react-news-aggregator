import { HiPresentationChartLine, HiSparkles, HiNewspaper, HiHeart, HiLightBulb, HiOutlineSupport, HiOutlineDesktopComputer } from "react-icons/hi";
export const NEWS_SOURCE:Record<string, string> = {
    NEWS_API: 'NewsAPI',
    GUARDIAN: 'The Guardian',
    NEW_YORK_TIMES: 'The New York Times'
}

export const NEW_YORK_TIMES_SOURCE = 'all'; // available options all, nyt, inyt
export const NEW_YORK_TIMES_ASSET_URL = 'https://www.nytimes.com/';
export const NEWS_API_LANGUAGE = 'en';
export const NEWS_API_SEARCH_IN = 'title,content,description';
export const NEWS_API_CATEGORY = ['business','entertainment','general','health','science','sports','technology'];
export const NEWS_API_CATEGORY_ICONS = [HiPresentationChartLine, HiSparkles, HiNewspaper, HiHeart, HiLightBulb, HiOutlineSupport, HiOutlineDesktopComputer  ]