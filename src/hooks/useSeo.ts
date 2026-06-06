import { useEffect } from 'react'

const SITE = 'https://www.hautomatico.com'

interface SeoOptions {
  title: string
  description: string
  /** Route path, e.g. '/about' or '/servizi/ionoleggio'. */
  path: string
  /** Image URL (absolute) or site-relative path. Defaults to the logo. */
  image?: string
  /** Page-specific JSON-LD structured data. */
  jsonLd?: object | object[]
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Client-side per-route SEO for the SPA: keeps <title>, description, canonical
 * and Open Graph / Twitter tags in sync with the current page, and injects any
 * page-specific JSON-LD (removed again on unmount). Googlebot renders JS, so it
 * picks these up after hydration.
 */
export function useSeo({ title, description, path, image, jsonLd }: SeoOptions) {
  const ldString = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    const url = `${SITE}${path}`
    const img = image
      ? image.startsWith('http')
        ? image
        : `${SITE}${image.startsWith('/') ? image : `/${image}`}`
      : `${SITE}/logohAutomatico-red.png`

    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    let script: HTMLScriptElement | null = null
    if (ldString) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'page')
      script.textContent = ldString
      document.head.appendChild(script)
    }

    return () => {
      if (script) script.remove()
    }
  }, [title, description, path, image, ldString])
}
