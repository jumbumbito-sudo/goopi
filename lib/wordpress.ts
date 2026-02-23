const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://goopiapp.com/wp-json/';
const WORDPRESS_API_KEY = process.env.WORDPRESS_API_KEY || '5vknqysnZSGTUqpi9U7i0zXn';

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export async function getBusinesses(params?: {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<WordPressPost[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.category) {
    searchParams.append('categories', params.category);
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.perPage) {
    searchParams.append('per_page', params.perPage.toString());
  }
  
  searchParams.append('_embed', 'true');
  
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}wp/v2/posts?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(WORDPRESS_API_KEY && { 'Authorization': `Bearer ${WORDPRESS_API_KEY}` }),
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}wp/v2/categories?per_page=100`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(WORDPRESS_API_KEY && { 'Authorization': `Bearer ${WORDPRESS_API_KEY}` }),
        },
        next: { revalidate: 3600 },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getBusinessById(id: number): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}wp/v2/posts/${id}?_embed=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(WORDPRESS_API_KEY && { 'Authorization': `Bearer ${WORDPRESS_API_KEY}` }),
        },
        next: { revalidate: 3600 },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch business');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export function parseWordPressPost(post: WordPressPost) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  const categories = post._embedded?.['wp:term']?.[0] || [];
  
  return {
    id: post.id,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
    featuredImage,
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    rating: Math.floor(Math.random() * 2) + 3.5, // Simulated rating
    reviews: Math.floor(Math.random() * 100) + 10, // Simulated reviews
  };
}
