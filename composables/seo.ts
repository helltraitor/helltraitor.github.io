interface UseSeoMetaHelperOptions {
  title: string
  description: string
  path?: string
  excluded?: any[]
}

/**
 * Zips values helper for seo. For shortness it's called `seo`
 */
const seo = (keys: string[], value: string) => ({ keys, value })

/**
 * Sets default values according to provided title and description.
 * In case when excluded names provided, some keys are ignored
 * (This is important when some tags must be overrode).
 *
 * When excluded are not strings - they doesn't cause errors,
 * so it's safe to pass undefined arrays.
 *
 * Full list available here: https://ogp.me/#metadata
 *
 * Default values:
 * ```yaml
 *   [title]: $title
 *   [description]: $description
 *   [ogTitle, og:title]: $title
 *   [ogDescription, og:description]: $description
 *   [ogImage, og:images]: URL_BASE + /og.png
 *   [ogUrl, og:url]: URL_BASE + /(routerPath | $path)
 *   [twitterTitle, twitter:title]: $title
 *   [twitterDescription, twitter:description]: $description
 *   [twitterImage, twitter:image]: URL_BASE + /og.png
 *   [twitterCard, twitter:card]: summary_large_image
 * ```
 * Note: The keys array contains allowed aliases
 */
export const useSeoMetaHelper = (options: UseSeoMetaHelperOptions) => {
  const runtimeConfig = useRuntimeConfig()

  const urlBase = runtimeConfig.public.urlBase

  const router = useRouter()
  const fullRawRealPath = router.currentRoute.value.fullPath
  const fullRawOptionPath = options.path
  const fullPreferredPath = (fullRawOptionPath ?? fullRawRealPath).replace(/^\//, '')

  const defaultAutoMeta = [
    seo(['title'], options.title),
    seo(['description'], options.description),

    seo(['ogTitle', 'og:title'], options.title),
    seo(['ogDescription', 'og:description'], options.description),
    seo(['ogImage', 'og:image'], `${urlBase}/og.png`),
    seo(['ogUrl', 'og:url'], `${urlBase}/${fullPreferredPath}`),

    seo(['twitterTitle', 'twitter:title'], options.title),
    seo(['twitterDescription', 'twitter:description'], options.description),
    seo(['twitterImage', 'twitter:image'], `${urlBase}/og.png`),
    seo(['twitterCard', 'twitter:card'], 'summary_large_image'),
  ]

  useSeoMeta(
    Object.fromEntries(
      defaultAutoMeta
        .filter(({ keys }) => !options.excluded?.some(exc => keys.includes(exc)))
        .map(({ keys, value }) => [keys[0], value])))
}
