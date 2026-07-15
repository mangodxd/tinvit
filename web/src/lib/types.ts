export interface ArticleDTO {
  id: number;
  title: string;
  slug: string;
  description: string;
  url: string;
  source: string;
  source_logo: string;
  category: string | null;
  published_at: string;
  image: string;
  content: ContentBlock[] | null;
  tags: string[];
}

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  category_name: string;
  category_slug: string | null;
  source_name: string;
  published_at: string;
  is_video?: boolean;
  video_url?: string | null;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'quote';
  content: string;
  src: string;
  caption: string;
}

export interface Category {
  slug: string;
  name: string;
}

export interface Source {
  slug: string;
  name: string;
  logo_url: string;
  enabled: boolean;
}

export interface HomepageResponse {
  hero: ArticleCardData | null;
  hero_secondary: ArticleCardData[];
  featured: {
    article: ArticleCardData | null;
    list: ArticleCardData[];
  };
  latest: ArticleCardData[];
  videos: ArticleCardData[];
  categories: {
    meta: { slug: string; name: string; color: string; count: number }[];
    articles: Record<string, ArticleCardData[]>;
  };
  tags: { name: string; slug: string }[];
}

export interface ArticleDetailResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  content: ArticleContentBlock[];
  category_name: string;
  category_slug: string;
  source_name: string;
  source_slug: string;
  source_url: string;
  published_at: string;
  updated_at: string;
  view_count: number;
  tags: { name: string; slug: string }[];
  is_video: boolean;
  video_url: string | null;
  author?: string | null;
  prev_article?: { slug: string; title: string } | null;
  next_article?: { slug: string; title: string } | null;
}

export interface ArticleContentBlock {
  type: 'text' | 'image' | 'quote' | 'heading' | 'video';
  content?: string;
  src?: string;
  url?: string;
  caption?: string;
  author?: string;
  level?: 2 | 3 | 4;
  text?: string;
}

export interface CategoryArticlesResponse {
  articles: ArticleCardData[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  category: {
    slug: string;
    name: string;
    color: string;
    article_count: number;
  };
}

export interface SearchResponse {
  results: ArticleCardData[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
