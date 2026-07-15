export const CATEGORY_COLORS: Record<string, string> = {
  'thoi-su': '#dc2626',
  'the-gioi': '#2563eb',
  'kinh-doanh': '#059669',
  'giai-tri': '#d946ef',
  'the-thao': '#ea580c',
  'giao-duc': '#7c3aed',
  'suc-khoe': '#0891b2',
  'doi-song': '#a16207',
  'phap-luat': '#be123c',
  'khoa-hoc': '#0284c7',
  'cong-nghe': '#1d4ed8',
  'van-hoa': '#0d9488',
  'xe': '#ca8a04',
  'ban-doc': '#4f46e5',
  'tam-su': '#db2777',
  'nha-dat': '#65a30d',
  'du-lich': '#0e7490',
  'so-hoa': '#0369a1',
};

export const CATEGORY_NAMES: Record<string, string> = {
  'thoi-su': 'Thời sự',
  'the-gioi': 'Thế giới',
  'kinh-doanh': 'Kinh doanh',
  'giai-tri': 'Giải trí',
  'the-thao': 'Thể thao',
  'giao-duc': 'Giáo dục',
  'suc-khoe': 'Sức khỏe',
  'doi-song': 'Đời sống',
  'phap-luat': 'Pháp luật',
  'khoa-hoc': 'Khoa học',
  'cong-nghe': 'Công nghệ',
  'van-hoa': 'Văn hóa',
  'xe': 'Xe',
  'ban-doc': 'Bạn đọc',
  'tam-su': 'Tâm sự',
  'nha-dat': 'Nhà đất',
  'du-lich': 'Du lịch',
  'so-hoa': 'Số hóa',
};

export const CATEGORY_ALIAS: Record<string, string> = {
  'bong-da': 'the-thao',
};

export function getCategoryColor(slug: string | null): string {
  if (!slug) return '#6b7280';
  const resolved = CATEGORY_ALIAS[slug] || slug;
  return CATEGORY_COLORS[resolved] ?? '#6b7280';
}

export function getCategoryName(slug: string | null): string {
  if (!slug) return 'Khác';
  const resolved = CATEGORY_ALIAS[slug] || slug;
  return CATEGORY_NAMES[resolved] ?? 'Khác';
}

export const SITE_NAME = 'Tin Vịt';
export const SITE_DESCRIPTION = 'Tin Vịt — Nền tảng tổng hợp tin tức Việt Nam. Thu thập và cập nhật tin mới nhất từ VnExpress, Tuổi Trẻ, Dân Trí với 20+ chuyên mục: Thời sự, Kinh doanh, Công nghệ, Giải trí, Thể thao.';
export const SITE_SHORT_DESCRIPTION = 'Tổng hợp tin tức Việt Nam từ nhiều nguồn';
export const DEFAULT_OG_IMAGE = '/images/og-default.svg';
export const ARTICLES_PER_PAGE = 20;

export const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thời sự', href: '/category/thoi-su' },
  { label: 'Kinh doanh', href: '/category/kinh-doanh' },
  { label: 'Công nghệ', href: '/category/cong-nghe' },
  { label: 'Giải trí', href: '/category/giai-tri' },
  { label: 'Thể thao', href: '/category/the-thao' },
  { label: 'Liên hệ', href: '/contact' },
];

