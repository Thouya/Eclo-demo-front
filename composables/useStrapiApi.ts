// composables/useStrapiApi.ts

export const useStrapiApi = async (endpoint: string, options: any = {}) => {
    const config = useRuntimeConfig()
  
    // Transformation manuelle des filtres si fournis sous forme d'objet
    const transformedParams = options.params ? new URLSearchParams(Object.entries(flattenParams(options.params))) : undefined
  
    return await useFetch(endpoint, {
      baseURL: config.public.STRAPI_URL,
      headers: {
        Authorization: `Bearer ${config.public.STRAPI_TOKEN || ''}`,
      },
      ...options,
      params: transformedParams,
    })
  }
  
  // Fonction pour aplatir un objet type filters.slug.$eq en 'filters[slug][$eq]': 'valeur'
  function flattenParams(obj: any, prefix = ''): Record<string, any> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? `${prefix}[${k}]` : k
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenParams(obj[k], pre))
      } else {
        acc[pre] = obj[k]
      }
      return acc
    }, {} as Record<string, any>)
  }
  
  // Exemple d'utilisation :
  // const { data } = await useStrapiApi('/api/page-tests', {
  //   params: {
  //     filters: { slug: { $eq: 'accueil' } },
  //     populate: '*'
  //   }
  // })