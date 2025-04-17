export const useStrapiImage = (url?: string) => {
    const config = useRuntimeConfig();
    if (!url) return '';
    return url.startsWith('http') ? url : `${config.public.STRAPI_URL}${url}`;
  };
  