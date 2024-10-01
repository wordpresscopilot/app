
interface Plugin {
  name: string;
  slug: string;
  version: string;
  author: string;
  rating: number;
  download_link?: string;
}

export async function searchWordPressPlugins(query: string, page: number = 1, perPage: number = 10): Promise<Plugin[]> {
  const apiUrl = `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
  
  try {
    const response = await fetch(`${apiUrl}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data && data.plugins) {
      return data.plugins.map((plugin: any) => ({
        name: plugin.name,
        slug: plugin.slug,
        version: plugin.version,
        author: plugin.author,
        rating: plugin.rating,
        download_link: plugin.download_link,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching WordPress plugins:', error);
    return [];
  }
}

