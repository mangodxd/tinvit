interface JsonLdProps {
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  sourceName: string;
  slug: string;
}

export function JsonLd({
  title,
  description,
  imageUrl,
  publishedAt,
  sourceName,
  slug,
}: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedAt,
    author: {
      '@type': 'Organization',
      name: sourceName,
    },
    publisher: {
      '@type': 'Organization',
      name: sourceName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/article/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
