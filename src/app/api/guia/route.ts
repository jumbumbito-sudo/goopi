import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = 'https://goopiapp.com/wp-json/';

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  jetpack_featured_media_url: string;
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
  count: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const action = searchParams.get('action');

  try {
    // Si pide categorías
    if (action === 'categories') {
      const response = await fetch(
        `${WORDPRESS_API_URL}wp/v2/categories?per_page=100&hide_empty=true`,
        {
          next: { revalidate: 3600 }, // Cache 1 hora
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const categories: WordPressCategory[] = await response.json();
      
      return NextResponse.json(categories.filter(cat => cat.count > 0));
    }

    // Si pide posts/negocios
    const params = new URLSearchParams();
    params.append('_embed', 'true');
    params.append('per_page', '50');
    
    if (category && category !== 'all') {
      params.append('categories', category);
    }
    
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}wp/v2/posts?${params.toString()}`,
      {
        next: { revalidate: 3600 }, // Cache 1 hora
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts: WordPressPost[] = await response.json();
    
    // Transformar posts a formato de negocio
    const businesses = posts.map(post => {
      const featuredImage = post.jetpack_featured_media_url || 
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
      const categories = post._embedded?.['wp:term']?.[0] || [];
      
      return {
        id: post.id.toString(),
        title: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
        image: featuredImage,
        category: categories[0]?.slug || 'sin-categoria',
        categoryName: categories[0]?.name || 'Sin categoría',
        categoryId: categories[0]?.id || null,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)), // Simulado
        reviews: Math.floor(Math.random() * 100) + 10, // Simulado
        content: post.content.rendered,
      };
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching from WordPress:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
