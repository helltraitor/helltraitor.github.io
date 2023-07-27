---
title: How it works
description: Site structure description
language: English
created: 2023-06-23
modified: 2023-06-23
---

# How it works

In this post, we will talk about this site structure.

Source code available in my [Github Repository][repository]

## Nuxt

Current site is written in [Nuxt][nuxt] web framework v3.

I have chosen because of many out-of-the-box features, such like:

- File-based routing: define routes based on the structure of your pages/ directory.
  This can make it easier to organize your application and avoid the need for manual route configuration.

- Code splitting: Nuxt automatically splits your code into smaller chunks,
  which can help reduce the initial load time of your application.

- Server-side rendering out of the box: Nuxt comes with built-in SSR capabilities,
  so you don't have to set up a separate server yourself.

- Auto-imports: write Vue composables and components in their respective directories
  and use them without having to import them with the benefits of tree-shaking and optimized JS bundles.

- Data-fetching utilities: Nuxt provides composables to handle SSR-compatible data fetching as well as different strategies.

- Zero-config TypeScript support: write type-safe code without having
  to learn TypeScript with our auto-generated types and tsconfig.json

- Configured build tools: we use Vite by default to support hot module replacement (HMR)
  in development and bundling your code for production with best-practices baked-in.

But most important for me is the Nuxt is buildup on Vue and its ecosystem, which allows to use Vue features in Nuxt framework.
Plus, native TypeScript support and `ContentRenderer` for Markdown files as documents.

## Post structure

In contrast of pervious versions, this requires only `yaml` heading in the document beginning:

```yaml
---
title: string
description: string
language: string
created: yyyy-MM-dd
modified: yyyy-MM-dd
---
```

With significant feature:

```yaml
---
modified: yyyy-MM-dd
override:
  - { key: value, key1: value1, ... }
---
```

That allows (as mentioned in `yaml`) to add meta tags and ignore similar tags that set by the internal `seoMetaHelper` function.

```ts []{} { filename=[...slug].vue }
useHeadSafe({
  meta: postMeta,
})

useSeoMetaHelper({
  title: data.value.title || 'No title provided',
  description: data.value.description || 'No description provided',
  // Meta could have not only name, but property too
  //   Note: undefined values being ignored by seo helper
  excluded: postMeta.flatMap(record => [record.name, record.property]),
})
```

The post data is fetched via `queryContent` Nuxt function (documentation can be found [here][query_content]).
And preprocessed with `hydrateMeta` helper:

```ts
const postMeta = (
  Object
    .entries(data.value)
    .filter(([key, _]) => key.match(/^override$/))
    .flatMap(([_, packed]) => Array.isArray(packed) ? packed : [])
    .map(hydrateMeta)
)
```

This function replaced special content marks by its content:

- `%URL_ABSOLUTE%` by current absolute url value (e.g. `https://helltraitor.github.io`)

The `hydrateMeta` function allows set real url to, for example,
an alternative [og:image][ogp].
Or set the different image for Twitter.

Example with twitter image:

```yaml
---
modified: yyyy-MM-dd
override:
  - { property: twitter:image, content: '%URL_ABSOLUTE%/path-to-alternative.png' }
---
```

Since meta `title` and `<meta name="title" content="...">`
is preferred over `<meta property="og:title" content="...">` (same for twitter title).
Its content may be ignored.

<!-- LABELS -->
[nuxt]: https://nuxt.com "nuxt official site"
[ogp]: https://ogp.me "Open Graph Protocol documentation"
[query_content]: https://content.nuxtjs.org/api/composables/query-content/ "queryContent function documentation"
[repository]: https://github.com/helltraitor/helltraitor.github.io "helltraitor.github.io repository"
